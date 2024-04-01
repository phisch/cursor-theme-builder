import {
	existsSync,
	mkdirSync,
	readFileSync,
	symlinkSync,
	write,
	writeFile,
	writeFileSync,
} from "node:fs";
import path from "node:path";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { type Element, SVG, type Svg, registerWindow } from "@svgdotjs/svg.js";
import { stringify } from "ini";
import sharp from "sharp";
import { createSVGWindow } from "svgdom";
import { type Frame, SvgAnimator } from "../animator/svg";
import {
	type Coordinates,
	type Cursor,
	CursorTheme,
	type HotSpot,
	type Selector,
	type Sprite,
	type Variant,
	isCoordinates,
	isSelector,
} from "../models/cursor-theme";
import { type Chunk, type Image, encode } from "../x11/xcursor";

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
			.flatMap((arg) => arg.split(" "))
			.join("-")
			.toLowerCase();
	}

	private getVariantDirectory(variant: Variant, leftHanded?: boolean) {
		const parts = [this.cursorTheme.name, variant.name];
		if (leftHanded) {
			parts.push("left-handed");
		}
		return path.join(
			this.outputDirectory,
			this.slugify(...parts),
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
				Name: `${this.cursorTheme.name} (${variant.name}${leftHanded ? " left handed" : ""
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

	private async render(svg: string, scale: number): Promise<Buffer> {
		const sharpImage = sharp(Buffer.from(svg), {
			density: 72 * scale,
		});
		return sharpImage.raw().toBuffer();
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

	private transformIntoLeftHandedFrames(
		sprite: Sprite,
		frames?: Frame[]
	): Frame[] | undefined {
		if (!sprite.flips || !frames) {
			return;
		}
		const leftHandedFrames = frames.map((frame) => {
			const svg = SVG(frame.svg);
			for (const flip of sprite.flips ?? []) {
				const elements = flip === "svg" ? svg.find("svg > g") : svg.find(flip);
				for (const element of elements) {
					if (flip === "svg") {
						element.flip("x", svg.width() as number / 2);
					} else {
						element.flip("x");
					}
				}
			}
			return { svg: svg, duration: frame.duration } as Frame;
		});
		return leftHandedFrames;
	}

	private extractHotSpot(
		svg: Element,
		selector: Selector,
	): Coordinates | undefined {
		const element = svg.findOne(selector);
		if (element) {
			const bb = SVG(element).bbox();
			element.remove();
			return {
				x: Math.floor(bb.x + bb.width / 2),
				y: Math.floor(bb.y + bb.height / 2),
			};
		}
	}

	private possiblyExtractHotspot(svg: Element, hotSpot?: HotSpot): Coordinates {
		if (isCoordinates(hotSpot)) {
			return hotSpot;
		}

		if (isSelector(hotSpot)) {
			const coordinates = this.extractHotSpot(svg, hotSpot);
			if (coordinates) {
				return coordinates;
			}
		}

		const coordinates = this.extractHotSpot(svg, "#hotspot");
		if (coordinates) {
			return coordinates;
		}

		return { x: 0, y: 0 };
	}

	private async createChunks(
		frameMap: Map<Sprite, Frame[]>,
		sprites: Sprite[],
		scaleMap: Map<number, Set<number>>,
		leftHanded: boolean
	): Promise<Image[]> {
		const chunks: Image[] = [];
		for (const sprite of sprites) {
			const frames = leftHanded
				? this.transformIntoLeftHandedFrames(sprite, frameMap.get(sprite))
				: frameMap.get(sprite);
			if (!frames) {
				continue;
			}

			for (const frame of frames) {
				const scales = scaleMap.get(frame.svg.width() as number) ?? new Set();
				for (const scale of scales) {
					const svg = SVG(frame.svg.svg());
					const hotspot = this.possiblyExtractHotspot(svg, sprite.hotSpot);
					if (leftHanded) {
						hotspot.x = frame.svg.width() as number - hotspot.x;
					}
					const renderedImage = await this.render(svg.svg(), scale);
					chunks.push({
						width: frame.svg.width() as number * scale,
						height: frame.svg.height() as number * scale,
						delay: frame.duration,
						xhot: hotspot.x * scale,
						yhot: hotspot.y * scale,
						pixels: renderedImage,
					});
				}
			}
		}
		return chunks.sort((a, b) => a.width - b.width);
	}

	private async buildCursor(cursor: Cursor, variant: Variant) {
		const sizes = new Set<number>();

		const frameMap = cursor.sprites.reduce((map, sprite) => {
			const element = SVG(this.getFile(sprite.file));
			sizes.add(element.width() as number);
			const frames = new SvgAnimator(
				element,
				sprite.animations,
			).getAnimationFrames();
			map.set(sprite, frames);
			return map;
		}, new Map<Sprite, Frame[]>());

		const scaleMap = this.determineScaleMap(sizes, new Set([1, 2, 3, 4]));

		const chunks = await this.createChunks(
			frameMap,
			cursor.sprites,
			scaleMap,
			false
		);
		this.writeCursorFile(chunks, cursor, variant);

		if (cursor.sprites.find((sprite) => sprite.flips)) {
			const chunks = await this.createChunks(
				frameMap,
				cursor.sprites,
				scaleMap,
				true
			);
			this.writeCursorFile(chunks, cursor, variant, true);
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
