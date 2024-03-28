import {
	existsSync,
	mkdirSync,
	readFileSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import path from "node:path";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { SVG, registerWindow } from "@svgdotjs/svg.js";
import { stringify } from "ini";
import sharp from "sharp";
import { createSVGWindow } from "svgdom";
import { type Frame, SvgAnimator } from "../animator/svg";
import { type Chunk, type Image, encode } from "../x11/xcursor";
import {
	type Cursor,
	CursorTheme,
	type Sprite,
	type Variant,
	isHotSpot,
	isHotSpotSelector,
} from "../models/cursor-theme";

const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);

type IndexFile = {
	"Icon Theme": {
		Name: string;
		Comment?: string;
		Author?: string;
		Inherits?: string;
	};
};

export class CursorThemeBuilder {
	private cursorTheme: CursorTheme;
	private inputDirectory: string;

	constructor(
		themeFilePath: string,
		private outputDirectory: string,
	) {
		this.cursorTheme = JSON.parse(readFileSync(themeFilePath, "utf8"));
		this.inputDirectory = path.dirname(themeFilePath);
		this.validateTheme();
	}

	private validateTheme() {
		const C = TypeCompiler.Compile(CursorTheme);
		if (!C.Check(this.cursorTheme)) {
			const errors = [...C.Errors(this.cursorTheme)];
			console.info(JSON.stringify(errors, null, 2));
			throw new Error("Cursor theme json file is not valid!");
		}
	}

	build() {
		for (const variant of this.cursorTheme.variants) {
			this.buildVariant(variant);
		}
	}

	private slugify(...args: string[]) {
		return args
			.map((arg) => arg.split(" "))
			.flat()
			.join("-")
			.toLowerCase();
	}

	private getVariantDirectory(variant: Variant, leftHanded?: boolean) {
		return path.join(
			this.outputDirectory,
			this.slugify(
				this.cursorTheme.name,
				variant.name,
				leftHanded ? "left-handed" : "",
			),
		);
	}

	private createDirectoryAndIndex(
		variant: Variant,
		parent?: Variant,
		leftHanded?: boolean,
	) {
		const variant_directory = this.getVariantDirectory(variant, leftHanded);
		mkdirSync(path.join(variant_directory, "cursors"), { recursive: true });

		const index: IndexFile = {
			"Icon Theme": {
				Name: `${this.cursorTheme.name} (${variant.name}${
					leftHanded ? " left handed" : ""
				})`,
			},
		};

		if (this.cursorTheme.author) {
			index["Icon Theme"].Author = this.cursorTheme.author;
		}

		if (this.cursorTheme.description) {
			index["Icon Theme"].Comment = this.cursorTheme.description;
		}

		if (leftHanded) {
			index["Icon Theme"].Inherits = this.slugify(
				this.cursorTheme.name,
				variant.name,
			);
		} else if (parent) {
			index["Icon Theme"].Inherits = this.slugify(
				this.cursorTheme.name,
				parent.name,
			);
		}

		writeFileSync(
			path.join(variant_directory, "index.theme"),
			stringify(index),
		);
	}

	private buildVariant(variant: Variant, parent?: Variant) {
		this.createDirectoryAndIndex(variant, parent);
		const leftHanded = variant.cursors.some((cursor) =>
			cursor.sprites.some((sprite) => sprite.flips),
		);
		if (leftHanded) {
			this.createDirectoryAndIndex(variant, parent, true);
		}
		for (const cursor of variant.cursors) {
			this.buildCursor(cursor, variant);
		}
		for (const child_variant of variant.variants ?? []) {
			this.buildVariant(child_variant, variant);
		}
	}

	private buildLeftHandedFrames(
		animationFrameMap: Map<Sprite, Frame[]>,
	): Map<Sprite, Frame[]> {
		const leftHandedAnimationFrameMap = new Map<Sprite, Frame[]>();
		for (const [sprite, frames] of animationFrameMap) {
			if (sprite.flips) {
				const leftHandedFrames = frames.map((frame) => {
					const svg = SVG(frame.svg);
					for (const flip of sprite.flips ?? []) {
						const elements = svg.find(flip);
						for (const element of elements) {
							element.flip("x");
						}
					}
					return { svg: svg, duration: frame.duration } as Frame;
				});
				leftHandedAnimationFrameMap.set(sprite, leftHandedFrames);
			}
		}
		return leftHandedAnimationFrameMap;
	}

	private setHotspotFromSelector(frame: Frame, selector: string) {
		const hotspotElement = frame.svg.findOne(selector);
		if (hotspotElement) {
			const x = hotspotElement.attr("cx");
			const y = hotspotElement.attr("cy");
			const width = hotspotElement.attr("width");
			const height = hotspotElement.attr("height");
			hotspotElement.remove();
			frame.hotSpot = {
				x: Math.floor(x + width / 2),
				y: Math.floor(y + height / 2),
			};
		}
	}

	private async renderFrame(frame: Frame, scale: number): Promise<Image> {
		const sharpImage = sharp(Buffer.from(frame.svg.svg()), {
			density: 72 * scale,
		});
		const meta = await sharpImage.metadata();
		if (!meta.width || !meta.height) {
			throw new Error("Width or height is 0 or undefined");
		}
		return {
			width: meta.width,
			height: meta.height,
			delay: frame.duration,
			xhot: frame.hotSpot?.x ?? 0,
			yhot: frame.hotSpot?.y ?? 0,
			pixels: await sharpImage.raw().toBuffer(),
		};
	}

	private writeCursorFile(
		chunks: Chunk[],
		cursor: Cursor,
		variant: Variant,
		leftHanded?: boolean,
	) {
		const cursorFile = path.join(
			this.getVariantDirectory(variant, leftHanded),
			"cursors",
			`${cursor.name}`,
		);
		writeFileSync(cursorFile, encode(chunks));

		for (const alias of cursor.aliases ?? []) {
			const aliasFile = path.join(
				this.getVariantDirectory(variant, leftHanded),
				"cursors",
				`${alias}`,
			);
			if (existsSync(aliasFile)) {
				console.warn(`Alias file ${aliasFile} already exists`);
			} else {
				symlinkSync(cursor.name, aliasFile);
			}
		}
	}

	private getFile(file: string) {
		return readFileSync(path.join(this.inputDirectory, file), "utf8");
	}

	private withHotSpot(frames: Frame[], sprite: Sprite) {
		return frames.map((frame) => {
			if (isHotSpot(sprite.hotSpot)) {
				frame.hotSpot = sprite.hotSpot;
			} else if (isHotSpotSelector(sprite.hotSpot)) {
				this.setHotspotFromSelector(frame, sprite.hotSpot);
			}
			return frame;
		});
	}

	private framesToChunks(
		frames: Frame[],
		scaleMap: Map<number, Set<number>>,
	): Promise<Image[]> {
		return Promise.all(
			frames.flatMap((frame) => {
				const scales = scaleMap.get(frame.svg.width() as number) ?? new Set();
				return Array.from(scales).map(async (scale) => {
					return await this.renderFrame(frame, scale);
				});
			}),
		).then((chunks) => {
			return chunks.sort((a, b) => a.width - b.width);
		});
	}

	private async buildCursor(cursor: Cursor, variant: Variant) {
		const sizes = new Set<number>();

		const frameMap = cursor.sprites.reduce((map, sprite) => {
			const element = SVG(this.getFile(sprite.file));
			sizes.add(element.width() as number);
			const frames = new SvgAnimator(element, sprite.animations).getAnimationFrames();
			map.set(sprite, frames);
			return map;
		}, new Map<Sprite, Frame[]>());

		const frames: Frame[] = cursor.sprites.flatMap((sprite) =>
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			this.withHotSpot(frameMap.get(sprite)!, sprite),
		);

		const scaleMap = this.determineScaleMap(sizes, new Set([1, 2, 3, 4]));
		const chunks = await this.framesToChunks(frames, scaleMap);
		this.writeCursorFile(chunks, cursor, variant);

		if (cursor.sprites.find((sprite) => sprite.flips)) {
			const frameMapLeftHanded = this.buildLeftHandedFrames(frameMap);
			const framesLeftHanded: Frame[] = cursor.sprites.flatMap((sprite) =>
				this.withHotSpot(
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					frameMapLeftHanded.get(sprite) ?? frameMap.get(sprite)!,
					sprite,
				),
			);
			const chunksLeftHanded = await this.framesToChunks(
				framesLeftHanded,
				scaleMap,
			);
			this.writeCursorFile(chunksLeftHanded, cursor, variant, true);
		}
	}

	private determineScaleMap(
		sizes: Set<number>,
		scales: Set<number>,
	): Map<number, Set<number>> {
		const scaleMap = new Map<number, Set<number>>();
		const usedSizes = new Set<number>();
		const sortedScales = Array.from(scales).sort((a, b) => a - b);

		for (const size of Array.from(sizes).sort((a, b) => b - a)) {
			const sizeScales = new Set<number>();

			for (const scale of sortedScales) {
				const scaledSize = size * scale;

				if (usedSizes.has(scaledSize)) {
					continue;
				}

				sizeScales.add(scale);
				usedSizes.add(scaledSize);
			}

			scaleMap.set(size, sizeScales);
		}

		return scaleMap;
	}
}
