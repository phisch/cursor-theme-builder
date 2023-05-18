import { mkdirSync, readFile, readFileSync, writeFileSync } from "fs";
import path from "path";
import { stringify } from "ini";
import { Cursor, CursorTheme, HotSpot, Sprite, Variant } from "./models/cursor-theme";
import { Frame, SvgAnimator } from "../animator/svg-animator";
import { Chunk } from "../x11/xcursor";
import { SVG, Svg } from "@svgdotjs/svg.js";
import sharp from "sharp";

type IndexFile = {
    "Icon Theme": {
        "Name": string;
        "Comment"?: string;
        "Author"?: string;
        "Inherits"?: string;
    }
}

class CursorThemeGenerator {



    constructor(private cursorTheme: CursorTheme, private outputDirectory: string) {

    }

    generate() {
        for (const variant of this.cursorTheme.variants) {
            this.generateVariant(variant);
        }
    }

    private slugify(...args: string[]) {
        return args.filter(arg => arg).join("-").toLowerCase();
    }

    private extractHotspot(svg: Svg) {
        const hotspotElement = svg.findOne("#hotspot");
        if (hotspotElement) {
            const x = hotspotElement.attr("cx");
            const y = hotspotElement.attr("cy");
            const width = hotspotElement.attr("width");
            const height = hotspotElement.attr("height");
            hotspotElement.remove();
            return {
                x: Math.floor(x + width / 2),
                y: Math.floor(y + height / 2)
            }
        }

        return {
            x: 0,
            y: 0
        }
    }

    private async makeChunk(frame: Frame, hotspot: HotSpot): Promise<Chunk> {
        const sharpImage = sharp(Buffer.from(frame.svg));
        const meta = await sharpImage.metadata();
        
        return {
            width: meta.width,
            height: meta.height,
            delay: frame.duration,
            xhot: hotspot.x,
            yhot: hotspot.y,
            pixels: await sharpImage.raw().toBuffer()
        } as Chunk;
    }


    private async ö(sprite: Sprite, frame: Frame): Promise<Chunk> {
        if (sprite.hotSpot && typeof sprite.hotSpot === "object") {
            return await this.makeChunk(frame, sprite.hotSpot);
        }
        const svg = SVG(frame.svg);
        const hotSpotElement = svg.findOne("#hotspot");
        if (hotSpotElement) {
            const x = hotSpotElement.attr("cx");
            const y = hotSpotElement.attr("cy");
            const width = hotSpotElement.attr("width");
            const height = hotSpotElement.attr("height");
            hotSpotElement.remove();
            return await this.makeChunk(frame, {
                x: Math.floor(x + width / 2),
                y: Math.floor(y + height / 2)
            });
        }
        return await this.makeChunk(frame, {
            x: 0,
            y: 0
        });
    }

    private performFlips(sprite: Sprite, frame: Frame) {
        if(sprite.flips) {
            const svg = SVG(frame.svg);
            for (const flip of sprite.flips) {
                const elements = svg.find(flip);
                elements.forEach(element => {
                    element.flip("x");
                });
            }
            return svg.svg();
        }
        return frame.svg;
    }

    private async frameToChunk(frame: Frame, sprite: Sprite): Promise<Chunk> {
        sprite.hotSpot


        const svg = SVG(frame.svg);
        const sharpImage = sharp(Buffer.from(frame.svg));
        
        const meta = await sharpImage.metadata();
        return {
            width: meta.width,
            height: meta.height,
            delay: frame.duration,
            xhot: 0,
            yhot: 0,
            pixels: await sharpImage.raw().toBuffer()
        } as Chunk
    }

    
    private createChunk(frame: Frame, sprite: Sprite, performFlips: boolean = false) {
        // possibly extract hotspot, an
    }

    private cc(svg: string, duration: number, flips?: string[], hotspot?: HotSpot): Chunk {

    }

    private async createCursor(cursor: Cursor, variant: Variant) {
        const animationFrameMap = new Map<Sprite, Frame[]>();

        const chunkMap = new Map<Sprite, Chunk[]>();
        const leftHandedChunkMap = new Map<Sprite, Chunk[]>();

        cursor.sprites.forEach(sprite => {
            const svg = sprite.file !== undefined ? readFileSync(sprite.file, "utf8") : sprite.svg;
            const animator = new SvgAnimator(svg);
            if (sprite.animations) {
                animator.applyAnimations(sprite.animations);
            }
            animator.saveFrames().forEach(frame => {

                sprite.

                const chunk = this.createChunk(frame, sprite);
                const leftHandedChunk = this.createChunk(frame, sprite, true);
            });
        });


        // right handed: extract hotspot from each frame and use sharp to create chunks
        // left handed: perform flips, extract hotspot from each frame and use sharp to create chunks

        /*
        const chunks: Chunk[] = cursor.sprites.map(sprite => {
            animationFrameMap.get(sprite)?.map(frame => {
                const hotspot = this.getHotSpot(sprite, frame);
                return this.frameToChunk(frame, sprite);
            });
        });
        */

        // iterate over sprites again and create xcursor image chunks
        // for each sprite, iterate over the frames and create an xcursor image chunk
        /*
        const chunks: Chunk[] = cursor.sprites.map(async sprite => {
            const frames = animationFrameMap.get(sprite)!;
            const chunks = await Promise.all(
                frames.map(async frame => {
                    
                    // set hotspot to sprite.hotSpot if it exists and is a type HotSpot object, extract it from the frame otherwise
                    const hotspot = sprite.hotSpot && typeof sprite.hotSpot === "object" ? sprite.hotSpot : this.extractHotspot(SVG(frame.svg));

                    const sharpImage = sharp(Buffer.from(frame.svg));
                    const meta = await sharpImage.metadata();
                    return {
                        width: meta.width,
                        height: meta.height,
                        delay: frame.duration,
                        xhot: xHot,
                        yhot: yHot,
                        pixels: await sharpImage.raw().toBuffer()
                    } as Chunk

                })
            );
        });
        */

    }

    createDirectoryAndIndex(variant: Variant, parent?: Variant, leftHanded?: boolean) {
        const directory = path.join(
            this.outputDirectory,
            this.slugify(cursorTheme.name, variant.name),
            leftHanded ? "left-handed" : ""
        );

        mkdirSync(directory, { recursive: true });

        const index: IndexFile = {
            "Icon Theme": {
                "Name": `${this.cursorTheme.name} (${variant.name})`
            }
        };
        this.cursorTheme.author ? index["Icon Theme"]["Author"] = this.cursorTheme.author : null;
        this.cursorTheme.description ? index["Icon Theme"]["Comment"] = this.cursorTheme.description : null;
        parent ? index["Icon Theme"]["Inherits"] = this.slugify(this.cursorTheme.name, parent.name) : null;

        writeFileSync(path.join(directory, "index.theme"), stringify(index));
    }

    generateVariant(variant: Variant, parent?: Variant) {
        this.createDirectoryAndIndex(variant, parent);
        const leftHanded = variant.cursors.some(cursor => cursor.sprites.some(sprite => sprite.flips));
        if (leftHanded) {
            this.createDirectoryAndIndex(variant, parent, true);
        }
        variant.cursors.forEach(cursor => {
            // creating a cursor:
                //  - animate all sprites into a HashMap<Sprite, AnimationFrame[]>
                //  - take the animation frames and create xcursor image chunks
            this.generateCursor(cursor, variant);
        });

        variant.variants?.forEach(v => this.generateVariant(v, variant));
    }


    private generateCursor(cursor: Cursor, variant: Variant) {
        //const hasLeftHanded = cursor.sprites.some(sprite => sprite.flips);

        const animationFrameMap = new Map<Sprite, Frame[]>();
        cursor.sprites.forEach(sprite => {
            const svg = sprite.file !== undefined ? readFileSync(sprite.file, "utf8") : sprite.svg;
            const animator = new SvgAnimator(svg);
            if (sprite.animations) {
                animator.applyAnimations(sprite.animations);
            }
            animationFrameMap.set(sprite, animator.saveFrames());
        });

        const chunks: Chunk[] = cursor.sprites.map(async sprite => {
            
        });
    }

}


const cursorThemeJsonFile = "./exports/files/cursor-theme.json";

const json = readFileSync(cursorThemeJsonFile, "utf8");
const cursorTheme: CursorTheme = JSON.parse(json);

//const ajv = new Ajv();
//const validate = ajv.compile(cursorThemeSchema);

//if (!validate(cursorTheme)) {
//    console.log(validate.errors);
//}


const generator = new CursorThemeGenerator(cursorTheme, path.normalize("./generated"));
//generator.generate();




