import { readFileSync, writeFileSync } from "fs";
import { SvgAnimator } from "./animator/svg-animator";
import { Animation } from "./cursor-theme/models/animation/animation";

import { registerWindow } from "@svgdotjs/svg.js";
// @ts-ignore, https://github.com/svgdotjs/svgdom/issues/69
import { createSVGWindow } from "svgdom";

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


for (const [index, frame] of frames.entries()) {
    writeFileSync(`./frames/frame_${index}.svg`, frame.svg);
}