import { type Element, Matrix, Runner, SVG, Timeline } from "@svgdotjs/svg.js";
import type {
	Animation,
	AnimationInstruction,
} from "../models/animation/animation";

export type Frame = {
	svg: Element;
	duration: number;
	hotSpot?: { x: number; y: number };
};

export class SvgAnimator {
	private timeline = new Timeline();

	runners: Runner[] = [];
	animatedElements: Element[] = [];

	private fps = 25;

	constructor(
		private element: Element,
		animations?: Animation[],
	) {
		this.applyAnimations(this.element, animations);
	}

	animate(): Frame[] {
		if (this.animatedElements.length === 0) {
			return [{ svg: this.element, duration: 0 }];
		}
		const frames: Frame[] = [];
		const animationDuration = this.timeline.getEndTime();
		const frameCount = Math.ceil((animationDuration / 1000) * this.fps);

		for (let i = 0; i < frameCount; i++) {
			const frame_start = Math.floor((i / this.fps) * 1000);
			const frame_end = Math.min(
				Math.floor(((i + 1) / this.fps) * 1000),
				animationDuration,
			);
			const duration = frame_end - frame_start;
			this.timeline.time(frame_start);
			for (const element of this.animatedElements) {
				mergeTransforms.call(element);
			}
			frames.push({
				svg: SVG(this.element.svg()),
				duration,
			});
		}
		return frames;
	}

	private applyAnimations(element: Element, animations?: Animation[]) {
		for (const animation of animations ?? []) {
			this.applyAnimation(element, animation);
		}
	}

	private applyAnimation(element: Element, animation: Animation) {
		const affectedElement = element.find(animation.selector);
		const runners: Runner[] = [];
		for (const e of affectedElement) {
			if (!this.animatedElements.includes(e)) {
				this.animatedElements.push(e);
			}
			e.timeline(this.timeline);
			runners.push(...this.applyInstructions(e, animation.instructions));
		}
		this.runners.push(...runners);
	}

	private applyInstructions(
		element: Element,
		instructions: AnimationInstruction[],
	): Runner[] {
		const runners: Runner[] = [];
		let runner: Element | Runner = element;

		for (const { name, arguments: args } of instructions) {
			switch (name) {
				case "animate":
					runner = (runner as Element).animate(
						args.duration,
						args.delay,
						args.when,
					);
					break;
				case "rotate":
					runner = (runner as Element).rotate(args.degrees);
					break;
				case "dx":
					runner = (runner as Element).dx(args.x);
					break;
				case "dy":
					runner = (runner as Element).dy(args.y);
					break;
				case "ease":
					runner = (runner as Runner).ease(args.kind);
					break;
				default:
					throw new Error(`Unknown animation instruction: ${name}`);
			}

			if (runner instanceof Runner) {
				runners.push(runner);
			}
		}

		return runners;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const lmultiply = (last: any, curr: any): any => last.lmultiplyO(curr);
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getRunnerTransform = (runner: any): any => runner.transforms;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function mergeTransforms(this: any): void {
	const runners = this._transformationRunners.runners;
	const netTransform = runners
		.map(getRunnerTransform)
		.reduce(lmultiply, new Matrix());
	this.transform(netTransform);
	this._transformationRunners.merge();
	if (this._transformationRunners.length() === 1) {
		this._frameId = null;
	}
}
