import { type Element, Matrix, Runner, SVG, Timeline, Circle } from '@svgdotjs/svg.js';
import type { Animation, AnimationInstruction } from '../models/animation/animation';
import type { Animations } from '$lib/models/cursor-theme';
import { getEasingFunction } from './ease';
import { isRadiiArguments, isRadiusArguments } from '$lib/models/animation/instruction/radius';
import {
	isDualAxisScaleArguments,
	isSingleFactorScaleArguments
} from '$lib/models/animation/instruction/scale';

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
		animations?: Animations
	) {
		this.applyAnimations(animations);
	}

	private resetAnimations() {
		this.runners.every((runner) => {
			runner.reset();
		});

		for (const runner of this.runners) {
			runner.reset();
		}
		this.runners = [];

		this.timeline.finish();
		this.timeline = new Timeline();
	}

	applyAnimations(animations?: Animation[]) {
		this.resetAnimations();
		for (const animation of animations ?? []) {
			this.applyAnimation(this.element, animation);
		}
	}

	private applyAnimation(element: Element, animation: Animation) {
		try {
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
		} catch (e: unknown) {
			if (e instanceof Error) {
				console.warn(`Selector '${animation.selector}' is not valid, can't apply animation on it.`);
				console.warn(e.message);
			}
		}
	}

	loop() {
		for (const runner of this.runners) {
			runner.loop();
		}
	}

	private applyInstructions(element: Element, instructions: AnimationInstruction[]): Runner[] {
		const runners: Runner[] = [];
		let runner: Element | Runner = element;

		for (const { name, arguments: args } of instructions) {
			switch (name) {
				case 'animate':
					runner = (runner as Element).animate(args.duration, args.delay, 'absolute');
					if (args.ease) {
						runner = (runner as Runner).ease(getEasingFunction(args.ease));
					}
					break;
				case 'center':
					runner = (runner as Element).center(args.x, args.y);
					break;
				case 'cx':
					runner = (runner as Element).cx(args.x);
					break;
				case 'cy':
					runner = (runner as Element).cy(args.y);
					break;
				case 'dmove':
					runner = (runner as Element).dmove(args.x, args.y);
					break;
				case 'dx':
					runner = (runner as Element).dx(args.x);
					break;
				case 'dy':
					runner = (runner as Element).dy(args.y);
					break;
				case 'flip':
					runner = (runner as Element).flip(args.axis, args.offset);
					break;
				case 'height':
					runner = (runner as Element).height(args.height);
					break;
				case 'move':
					runner = (runner as Element).move(args.x, args.y);
					break;
				case 'radius':
					if (isRadiusArguments(args)) {
						runner = (runner as Circle).radius(args.radius);
					} else if (isRadiiArguments(args)) {
						runner = (runner as Circle).radius(args.rx, args.ry);
					}
					break;
				case 'width':
					runner = (runner as Element).width(args.width);
					break;
				case 'rotate':
					runner = (runner as Element).rotate(args.degrees, args.cx, args.cy);
					break;
				case 'scale':
					if (isSingleFactorScaleArguments(args)) {
						runner = (runner as Element).scale(args.factor);
					} else if (isDualAxisScaleArguments(args)) {
						runner = (runner as Element).scale(args.x, args.y);
					}
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

	getAnimationFrames(): Frame[] {
		if (this.animatedElements.length === 0) {
			return [{ svg: this.element, duration: 0 }];
		}
		const frames: Frame[] = [];
		const animationDuration = this.timeline.getEndTime();
		const frameCount = Math.ceil((animationDuration / 1000) * this.fps);

		for (let i = 0; i < frameCount; i++) {
			const frame_start = Math.floor((i / this.fps) * 1000);
			const frame_end = Math.min(Math.floor(((i + 1) / this.fps) * 1000), animationDuration);
			const duration = frame_end - frame_start;
			this.timeline.time(frame_start);
			for (const element of this.animatedElements) {
				mergeTransforms.call(element);
			}
			frames.push({
				svg: SVG(this.element.svg()),
				duration
			});
		}
		return frames;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const lmultiply = (last: any, curr: any): any => last.lmultiplyO(curr);
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getRunnerTransform = (runner: any): any => runner.transforms;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function mergeTransforms(this: any): void {
	const runners = this._transformationRunners.runners;
	const netTransform = runners.map(getRunnerTransform).reduce(lmultiply, new Matrix());
	this.transform(netTransform);
	this._transformationRunners.merge();
	if (this._transformationRunners.length() === 1) {
		this._frameId = null;
	}
}
