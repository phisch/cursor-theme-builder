import { Cursor, CursorTheme, Sprite, Variant } from "../models/cursor-theme";
import { Exporter } from "./exporter";
import * as Figma from 'figma-js';
import { Animation } from "../models/animation";
import { ComponentMetadata } from "figma-js";
import { AxiosPromise } from "axios";

type SpriteComponentProperties = {
    cursor: string,
    variant: string,
};

type SpriteComponentOptions = {
    aliases?: string[],
    flips?: string[],
    animations?: Animation[]
}

enum AssetStorage {
    File,
    Inline
}

export class FigmaExporter implements Exporter {

    private client: Figma.ClientInterface;
    private file: AxiosPromise<Figma.FileResponse>;

    constructor(apiKey: string, private fileId: string) {
        this.client = Figma.Client({
            personalAccessToken: apiKey
        });
        this.file = this.client.file(this.fileId);
    }

    async export(outputDirectory: string): Promise<CursorTheme> {
        return {
            name: "phingers",
            author: "phisch",
            variants: await this.getVariants()
        }
    }

    private parseName(name: string): SpriteComponentProperties {
        return Object.fromEntries(
            name.split(", ").map((part) => part.split("="))
        ) as SpriteComponentProperties;
    }

    private getOptions(description: string): SpriteComponentOptions {
        try {
            return JSON.parse(description) as SpriteComponentOptions;
        } catch (error) {
            return {} as SpriteComponentOptions;
        }
    }

    private async getSpriteComponents(): Promise<Map<string, ComponentMetadata>> {
        const spriteComponents: Map<string, ComponentMetadata> = new Map();

        Object.entries((await this.file).data.components).map(([id, component]) => {
            if (
                component.name.includes("cursor=") &&
                component.name.includes("variant=")
            ) {
                spriteComponents.set(id, component);
            }
        });

        return spriteComponents;
    }

    private makeSprite(assetUrl: string, options: SpriteComponentOptions): Sprite {
        //const svg = (await axios.get(assetUrl)).data;
        return {
            file: "empty for now",
            ...options
        }
    }

    // please don't judge...
    // transforming randomly ordered flat data into deeply nested data with partial
    // parent/child relationships seems to be impossible without the code getting ugly
    private async getVariants(): Promise<Variant[]> {
        const parentMap = new Map<string, string>();
        const variantMap = new Map<string, Variant>();
        const cursorMap = new Map<string, Cursor>();
        const spriteMap = new Map<Sprite, [string, string]>();

        const spriteComponents = await this.getSpriteComponents();
        const fileImages = await this.getFileImages(Array.from(spriteComponents.keys()));

        await Promise.all(Object.entries(fileImages).map(async ([key, url]) => {
            const component = spriteComponents.get(key)!;
            const properties = this.parseName(component.name);
            const [variantName, parentVariantName] = properties.variant.split(':');

            parentMap.set(variantName, parentVariantName);
            if (!variantMap.has(variantName)) {
                variantMap.set(variantName, { name: variantName, cursors: [] })
            }

            if (parentVariantName && !variantMap.has(parentVariantName)) {
                variantMap.set(parentVariantName, { name: parentVariantName, cursors: [] })
            }

            if (!cursorMap.has(JSON.stringify([variantName, properties.cursor]))) {
                cursorMap.set(JSON.stringify([variantName, properties.cursor]), { name: properties.cursor, sprites: [] });
            }

            const sprite = this.makeSprite(url, this.getOptions(component.description));
            spriteMap.set(sprite, [variantName, properties.cursor]);
        }));

        for (let [sprite, [variant, cursor]] of spriteMap) {
            cursorMap.get(JSON.stringify([variant, cursor]))?.sprites.push(sprite);
        }

        for (let [keys, cursor] of cursorMap) {
            const [variantName, _] = JSON.parse(keys);
            variantMap.get(variantName)!.cursors.push(cursor);
        }

        for (let [variantName, parentVariantName] of parentMap) {
            if (parentVariantName) {
                const variant = variantMap.get(variantName)!;
                const parentVariant = variantMap.get(parentVariantName)!;
                parentVariant.variants?.push(variant)
                if (!parentVariant.variants) {
                    parentVariant.variants = [variant];
                }
            }
        }

        return [...parentMap]
            .filter(([_, parent]) => !parent)
            .map(([variantName, _]) => variantMap.get(variantName)!);
    }


    private async getFileImages(ids: string[]): Promise<Figma.FileImageResponse["images"]> {
        return (await this.client.fileImages(
            this.fileId,
            {
                ids: ids,
                format: "svg",
                scale: 1,
                svg_include_id: true,
                svg_simplify_stroke: false,
                use_absolute_bounds: true,
            }
        )).data.images;
    }

}