import { type Element, Matrix, Runner, SVG, Timeline, Circle, Ellipse } from '@svgdotjs/svg.js';
import type { Animation, AnimationInstruction, AnimationList } from '../models/animation/animation';
import { getEasingFunction } from './ease';
import { isCircleRadius, isEllipseRadius } from '$lib/models/animation/instruction/radius';
import { isDualAxisScale, isSingleFactorScale } from '$lib/models/animation/instruction/scale';

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
		animations?: AnimationList
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

		for (const func of instructions) {
			switch (func.name) {
				case 'animate':
					runner = (runner as Element).animate(func.args.duration, func.args.delay, func.args.when);
					if (func.args.ease) {
						runner = (runner as Runner).ease(getEasingFunction(func.args.ease));
					}
					break;
				case 'center':
					runner = (runner as Element).center(func.args.x, func.args.y);
					break;
				case 'cx':
					runner = (runner as Element).cx(func.args.x);
					break;
				case 'cy':
					runner = (runner as Element).cy(func.args.y);
					break;
				case 'dmove':
					runner = (runner as Element).dmove(func.args.x, func.args.y);
					break;
				case 'dx':
					runner = (runner as Element).dx(func.args.x);
					break;
				case 'dy':
					runner = (runner as Element).dy(func.args.y);
					break;
				case 'flip':
					runner = (runner as Element).flip(func.args.axis, func.args.offset);
					break;
				case 'height':
					runner = (runner as Element).height(func.args.height);
					break;
				case 'hide':
					runner = (runner as Element).hide();
					break;
				case 'move':
					runner = (runner as Element).move(func.args.x, func.args.y);
					break;
				case 'radius':
					if (isCircleRadius(func)) {
						runner = (runner as Circle).radius(func.args.radius);
					} else if (isEllipseRadius(func)) {
						runner = (runner as Ellipse).radius(func.args.rx, func.args.ry);
					}
					break;
				case 'width':
					runner = (runner as Element).width(func.args.width);
					break;
				case 'rotate':
					runner = (runner as Element).rotate(func.args.degrees, func.args.cx, func.args.cy);
					break;
				case 'scale':
					if (isSingleFactorScale(func)) {
						runner = (runner as Element).scale(func.args.factor);
					} else if (isDualAxisScale(func)) {
						runner = (runner as Element).scale(func.args.x, func.args.y);
					}
					break;
				case 'show':
					runner = (runner as Element).show();
					break;
				case 'size':
					if (!func.args.width && !func.args.height) {
						console.warn('Size instruction requires at least one of width or height to be set.');
						continue;
					}
					runner = (runner as Element).size(func.args.width, func.args.height);
					break;
				case 'skew':
					runner = (runner as Element).skew(func.args.x, func.args.y, func.args.cx, func.args.cy);
					break;
				case 'translate':
					runner = (runner as Element).translate(func.args.x, func.args.y);
					break;
				case 'x':
					runner = (runner as Element).x(func.args.x);
					break;
				case 'y':
					runner = (runner as Element).y(func.args.y);
					break;
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
