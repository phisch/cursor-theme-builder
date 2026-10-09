import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { type Element, SVG, registerWindow } from '@svgdotjs/svg.js';
import { stringify } from 'ini';
import sharp from 'sharp';
import { createSVGWindow } from 'svgdom';
import { type Frame, SvgAnimator } from '../animator/svg';
import {
	type Coordinates,
	type Cursor,
	CursorTheme,
	type HotSpot,
	type Selector,
	type Sprite,
	type Variant,
	isCoordinates,
	isSelector
} from '../models/cursor-theme';
import { type Chunk, type Image, encode } from '../x11/xcursor';

const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);

type IndexFile = {
	'Icon Theme': {
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
		private outputDirectory: string
	) {
		this.cursorTheme = JSON.parse(readFileSync(themeFilePath, 'utf8'));
		this.inputDirectory = path.dirname(themeFilePath);
		this.validateTheme();
	}

	private validateTheme() {
		const C = TypeCompiler.Compile(CursorTheme);
		if (!C.Check(this.cursorTheme)) {
			const errors = [...C.Errors(this.cursorTheme)];
			console.info(JSON.stringify(errors, null, 2));
			throw new Error('Cursor theme json file is not valid!');
		}
	}

	build() {
		for (const variant of this.cursorTheme.variants) {
			this.buildVariant(variant);
		}
	}

	private slugify(...args: string[]) {
		return args
			.flatMap((arg) => arg.split(' '))
			.join('-')
			.toLowerCase();
	}

	private getVariantDirectory(variant: Variant, leftHanded?: boolean) {
		const parts = [this.cursorTheme.name, variant.name];
		if (leftHanded) {
			parts.push('left');
		}
		return path.join(this.outputDirectory, this.slugify(...parts));
	}

	private createDirectoryAndIndex(variant: Variant, parent?: Variant, leftHanded?: boolean) {
		const variant_directory = this.getVariantDirectory(variant, leftHanded);
		mkdirSync(path.join(variant_directory, 'cursors'), { recursive: true });
		mkdirSync(path.join(variant_directory, 'cursors_scalable'), { recursive: true });

		const index: IndexFile = {
			'Icon Theme': {
				Name: `${this.cursorTheme.name} (${variant.name}${leftHanded ? ' left handed' : ''})`
			}
		};

		if (this.cursorTheme.author) {
			index['Icon Theme'].Author = this.cursorTheme.author;
		}

		if (this.cursorTheme.description) {
			index['Icon Theme'].Comment = this.cursorTheme.description;
		}

		if (leftHanded) {
			index['Icon Theme'].Inherits = this.slugify(this.cursorTheme.name, variant.name);
		} else if (parent) {
			index['Icon Theme'].Inherits = this.slugify(this.cursorTheme.name, parent.name);
		}

		writeFileSync(path.join(variant_directory, 'index.theme'), stringify(index));
	}

	private buildVariant(variant: Variant, parent?: Variant) {
		this.createDirectoryAndIndex(variant, parent);
		const leftHanded = variant.cursors.some((cursor) =>
			cursor.sprites.some((sprite) => sprite.flips)
		);
		if (leftHanded) {
			this.createDirectoryAndIndex(variant, parent, true);
		}
		for (const cursor of variant.cursors) {
			this.buildCursor(cursor, variant, leftHanded);
		}
		for (const child_variant of variant.variants ?? []) {
			this.buildVariant(child_variant, variant);
		}
	}

	private async render(svg: string, scale: number): Promise<Buffer> {
		const sharpImage = sharp(Buffer.from(svg), {
			density: 72 * scale
		});
		return sharpImage.raw().toBuffer();
	}

	private writeCursorFile(chunks: Chunk[], cursor: Cursor, variant: Variant, leftHanded?: boolean) {
		const cursorFile = path.join(
			this.getVariantDirectory(variant, leftHanded),
			'cursors',
			`${cursor.name}`
		);
		writeFileSync(cursorFile, encode(chunks));
		this.writeAliases(path.dirname(cursorFile), cursor);
	}

	private writeAliases(directory: string, cursor: Cursor) {
		for (const alias of cursor.aliases ?? []) {
			const aliasFile = path.join(directory, alias);
			if (existsSync(aliasFile)) {
				console.warn(`Alias file ${aliasFile} already exists`);
			} else {
				symlinkSync(cursor.name, aliasFile);
			}
		}
	}

	// Writes the SVG cursor format introduced by KDE Plasma 6.2 and GNOME 51:
	// cursors_scalable/<name>/metadata.json listing the SVG frames of the cursor.
	private writeScalableCursor(
		frames: Frame[],
		sprite: Sprite,
		cursor: Cursor,
		variant: Variant,
		leftHanded?: boolean
	) {
		const scalableDirectory = path.join(
			this.getVariantDirectory(variant, leftHanded),
			'cursors_scalable'
		);
		const cursorDirectory = path.join(scalableDirectory, cursor.name);
		mkdirSync(cursorDirectory, { recursive: true });

		const metadata = frames.map((frame, index) => {
			const svg = SVG(frame.svg.svg());
			const size = frame.svg.width() as number;
			const hotspot = this.possiblyExtractHotspot(svg, sprite.hotSpot);
			if (leftHanded && sprite.flips) {
				hotspot.x = size - 1 - hotspot.x;
			}
			const filename =
				frames.length > 1
					? `${cursor.name}-${String(index + 1).padStart(2, '0')}.svg`
					: `${cursor.name}.svg`;
			writeFileSync(path.join(cursorDirectory, filename), svg.svg());
			return {
				filename,
				...(frames.length > 1 ? { delay: frame.duration } : {}),
				hotspot_x: hotspot.x,
				hotspot_y: hotspot.y,
				nominal_size: size
			};
		});

		writeFileSync(
			path.join(cursorDirectory, 'metadata.json'),
			JSON.stringify(metadata, null, 2) + '\n'
		);
		this.writeAliases(scalableDirectory, cursor);
	}

	private getFile(file: string) {
		return readFileSync(path.join(this.inputDirectory, file), 'utf8');
	}

	private transformIntoLeftHandedFrames(sprite: Sprite, frames?: Frame[]): Frame[] | undefined {
		if (!sprite.flips || !frames) {
			return;
		}
		const leftHandedFrames = frames.map((frame) => {
			const svg = SVG(frame.svg.svg());
			for (const flip of sprite.flips ?? []) {
				const elements = flip === 'svg' ? svg.find('svg > g') : svg.find(flip);
				for (const element of elements) {
					if (flip === 'svg') {
						element.flip('x', (svg.width() as number) / 2);
					} else {
						element.flip('x');
					}
				}
			}
			return { svg: svg, duration: frame.duration } as Frame;
		});
		return leftHandedFrames;
	}

	private extractHotSpot(svg: Element, selector: Selector): Coordinates | undefined {
		const element = svg.findOne(selector);
		if (element) {
			const bb = SVG(element).bbox();
			element.remove();
			return {
				x: Math.floor(bb.x + bb.width / 2),
				y: Math.floor(bb.y + bb.height / 2)
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

		const coordinates = this.extractHotSpot(svg, '#hotspot');
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
					const width = (frame.svg.width() as number) * scale;
					const renderedImage = await this.render(svg.svg(), scale);
					chunks.push({
						width,
						height: (frame.svg.height() as number) * scale,
						delay: frame.duration,
						// mirror the hotspot pixel in the scaled image, not in the sprite
						xhot: leftHanded ? width - 1 - hotspot.x * scale : hotspot.x * scale,
						yhot: hotspot.y * scale,
						pixels: renderedImage
					});
				}
			}
		}
		return chunks.sort((a, b) => a.width - b.width);
	}

	private async buildCursor(cursor: Cursor, variant: Variant, leftHandedVariant: boolean) {
		const sizes = new Set<number>();

		const frameMap = cursor.sprites.reduce((map, sprite) => {
			const element = SVG(this.getFile(sprite.file));
			sizes.add(element.width() as number);
			const frames = new SvgAnimator(element, sprite.animations).getAnimationFrames();
			map.set(sprite, frames);
			return map;
		}, new Map<Sprite, Frame[]>());

		const scaleMap = this.determineScaleMap(sizes, new Set([1, 2, 3, 4]));

		const chunks = await this.createChunks(frameMap, cursor.sprites, scaleMap, false);
		this.writeCursorFile(chunks, cursor, variant);

		// The scalable format holds a single SVG per frame, use the most detailed sprite.
		const [largestSprite, largestFrames] = [...frameMap.entries()].reduce((largest, entry) =>
			(entry[1][0].svg.width() as number) > (largest[1][0].svg.width() as number) ? entry : largest
		);
		this.writeScalableCursor(largestFrames, largestSprite, cursor, variant);

		if (!leftHandedVariant) {
			return;
		}

		if (cursor.sprites.find((sprite) => sprite.flips)) {
			const chunks = await this.createChunks(frameMap, cursor.sprites, scaleMap, true);
			this.writeCursorFile(chunks, cursor, variant, true);

			const leftHandedFrames = this.transformIntoLeftHandedFrames(largestSprite, largestFrames);
			if (leftHandedFrames) {
				this.writeScalableCursor(leftHandedFrames, largestSprite, cursor, variant, true);
			}
		} else {
			// GNOME ignores index.theme inheritance for scalable cursors, so the
			// left handed variant needs the unflipped cursors as well.
			this.writeScalableCursor(largestFrames, largestSprite, cursor, variant, true);
		}
	}

	private determineScaleMap(sizes: Set<number>, scales: Set<number>): Map<number, Set<number>> {
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
