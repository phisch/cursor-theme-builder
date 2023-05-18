import { readFileSync, writeFileSync } from "fs";
import { SvgAnimator } from "./animator/svg-animator";
import { Animation } from "./cursor-theme/models/animation/animation";

import { registerWindow } from "@svgdotjs/svg.js";
// @ts-ignore, https://github.com/svgdotjs/svgdom/issues/69
import { createSVGWindow } from "svgdom";
import { Chunk, CommentSubtype, encode } from "./x11/xcursor";
import sharp from "sharp";


const window = createSVGWindow();
registerWindow(window, window.document);


const sprite = readFileSync("./exports/files/dark/progress_32.svg", "utf8");

const animation: Animation = {
    selector: "#spinner",
    instructions: [
        {
            name: "animate",
            arguments: {
                duration: 1540,
                delay: 0,
                when: "now"
            }
        },
        {
            name: "rotate",
            arguments: {
                degrees: 360
            }
        }
    ]
};

const animator = new SvgAnimator(sprite);
animator.applyAnimations([animation]);
const frames = animator.saveFrames();





/*
const chunks = (await Promise.all(
    frames.map(async frame => {
        const sharpImage = sharp(Buffer.from(frame.svg));
        const meta = await sharpImage.metadata();
        return [
            {
                type: CommentSubtype.Other,
                string: "Hello world, motherfucker! UTF-8: works!! (╯°□°）╯︵ ┻━┻",
            } as Chunk,
            {
                width: meta.width,
                height: meta.height,
                delay: frame.duration,
                xhot: 0,
                yhot: 0,
                pixels: await sharpImage.raw().toBuffer()
            } as Chunk
        ]
    })
)).flat();
writeFileSync("cursors/left_ptr", encode(chunks));
*/

