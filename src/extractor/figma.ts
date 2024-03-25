import { existsSync, mkdirSync, promises, writeFileSync } from "node:fs";
import path from "node:path";
import axios from "axios";
import * as Figma from "figma-js";
import sharp from "sharp";
import type { Animation } from "../models/animation/animation";
import type {
	CursorTheme,
	Sprite,
	Variant,
} from "../models/cursor-theme";

type FigmaSprite = {
	properties: SpriteVariantProperties;
	config: SpriteVariantConfig;
	svg: string;
};

type SpriteVariantProperties = {
	cursor: string;
	variant: string;
	size: string;
};

type SpriteVariantConfig = {
	aliases?: string[];
	flips?: string[];
	animations?: Animation[];
};

export class FigmaExtractor {
	private client: Figma.ClientInterface;
	private figmaFile: Promise<Figma.FileResponse>;

	constructor(
		apiKey: string,
		private fileId: string,
		private cursorTheme: CursorTheme,
		private targetDirectory: string,
	) {
		this.client = Figma.Client({
			personalAccessToken: apiKey,
		});
		this.figmaFile = this.client
			.file(this.fileId)
			.then((response) => response.data);
	}

	async export(): Promise<string> {
		this.cursorTheme.variants = await this.getVariants();
		if (!existsSync(this.targetDirectory)) {
			mkdirSync(this.targetDirectory, { recursive: true });
		}
		await promises.writeFile(
			path.join(this.targetDirectory, "cursor-theme.json"),
			JSON.stringify(this.cursorTheme, null, 2),
		);
		return (await this.figmaFile).version;
	}

	private parseName(name: string): SpriteVariantProperties {
		return Object.fromEntries(
			name.split(", ").map((part) => part.split("=")),
		) as SpriteVariantProperties;
	}

	private getOptions(description: string): SpriteVariantConfig {
		try {
			return JSON.parse(description) as SpriteVariantConfig;
		} catch (error) {
			return {} as SpriteVariantConfig;
		}
	}

	private async saveFigmaSprite(figmaSprite: FigmaSprite): Promise<string> {
		const filePath = path.join(
			this.targetDirectory,
			figmaSprite.properties.variant,
			`${figmaSprite.properties.cursor}_${await this.getSvgSize(
				figmaSprite.svg,
			)}.svg`,
		);
		if (!existsSync(path.dirname(filePath))) {
			mkdirSync(path.dirname(filePath), { recursive: true });
		}
		writeFileSync(filePath, figmaSprite.svg);
		return path.relative(this.targetDirectory, filePath);
	}

	private async buildSprite(figmaSprite: FigmaSprite): Promise<Sprite> {
		const filePath = await this.saveFigmaSprite(figmaSprite);
		return {
			file: filePath,
			animations: figmaSprite.config.animations,
			flips: figmaSprite.config.flips,
		};
	}

	private async getSvgSize(svg: string): Promise<number> {
		const metadata = await sharp(Buffer.from(svg)).metadata();
		if (!metadata.width || !metadata.height) {
			throw new Error("Invalid SVG size");
		}
		if (metadata.width !== metadata.height) {
			throw new Error("SVG sizes are set but not equal");
		}

		return metadata.width;
	}

	private async getVariants(): Promise<Variant[]> {
		const variantMap: Map<string, Variant> = new Map();

		const spriteComponents = Object.entries(
			(await this.figmaFile).components,
		).filter(([, component]) => {
			return (
				component.name.includes("cursor=") &&
				component.name.includes("variant=")
			);
		});

		const spriteComponentImageUrls = (
			await this.client.fileImages(this.fileId, {
				ids: spriteComponents.map(([id]) => id),
				format: "svg",
				scale: 1,
				svg_include_id: true,
				svg_simplify_stroke: false,
				use_absolute_bounds: true,
			})
		).data.images;

		const figmaSprites = spriteComponents.map(async ([id, component]) => {
			return {
				config: this.getOptions(component.description),
				properties: this.parseName(component.name),
				svg: (await axios.get(spriteComponentImageUrls[id])).data,
			} as FigmaSprite;
		});

		for await (const figmaSprite of figmaSprites) {
			const { properties, config } = figmaSprite;
			const name = properties.variant.split("/").slice(-1)[0];

			if (!variantMap.has(properties.variant)) {
				variantMap.set(properties.variant, {
					name: name,
					cursors: [],
				});
			}

			const variant = variantMap.get(properties.variant);

			if (!variant) {
				throw new Error("Variant not found");
			}

			if (
				!variant.cursors.find((cursor) => cursor.name === properties.cursor)
			) {
				variant.cursors.push({
					name: properties.cursor,
					sprites: [],
				});
			}
			const cursor = variant.cursors.find(
				(cursor) => cursor.name === properties.cursor,
			);

			if (!cursor) {
				throw new Error("Cursor not found");
			}

			if (config.aliases && config.aliases.length > 0) {
				cursor.aliases = [
					...new Set([...(cursor.aliases || []), ...config.aliases]),
				];
			}

			cursor.sprites.push(await this.buildSprite(figmaSprite));
		}

		variantMap.forEach((variant, name) => {
			const parentName = name.substring(0, name.lastIndexOf("/"));
			const parent = variantMap.get(parentName);
			if (parent) {
				parent.variants ??= [];
				parent.variants.push(variant);
			}
		});

		return Array.from(variantMap.entries())
			.filter(([name]) => !name.includes("/"))
			.map(([, variant]) => variant);
	}
}
