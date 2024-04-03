import { type Static, Type } from '@sinclair/typebox';

export type Ease = Static<typeof Ease>;
export const Ease = Type.Union(
	[
		Type.Literal('in-sine'),
		Type.Literal('out-sine'),
		Type.Literal('in-out-sine'),
		Type.Literal('in-quad'),
		Type.Literal('out-quad'),
		Type.Literal('in-out-quad'),
		Type.Literal('in-cubic'),
		Type.Literal('out-cubic'),
		Type.Literal('in-out-cubic'),
		Type.Literal('in-quart'),
		Type.Literal('out-quart'),
		Type.Literal('in-out-quart'),
		Type.Literal('in-quint'),
		Type.Literal('out-quint'),
		Type.Literal('in-out-quint'),
		Type.Literal('in-expo'),
		Type.Literal('out-expo'),
		Type.Literal('in-out-expo'),
		Type.Literal('in-circ'),
		Type.Literal('out-circ'),
		Type.Literal('in-out-circ'),
		Type.Literal('in-back'),
		Type.Literal('out-back'),
		Type.Literal('in-out-back'),
		Type.Literal('in-elastic'),
		Type.Literal('out-elastic'),
		Type.Literal('in-out-elastic'),
		Type.Literal('in-bounce'),
		Type.Literal('out-bounce'),
		Type.Literal('in-out-bounce')
	],
	{
		description: 'which easing function to use for the animation'
	}
);

type Animate = Static<typeof Animate>;
export const Animate = Type.Object({
	name: Type.Literal('animate'),
	arguments: Type.Object({
		duration: Type.Number({
			description: 'duration of the animation in milliseconds'
		}),
		delay: Type.Optional(
			Type.Number({
				description: 'delay in milliseconds before this animation should start'
			})
		),
		when: Type.Optional(
			Type.Union([
				Type.Literal('absolute', {
					description: 'animation starts at an absolute time on the timeline'
				}),
				Type.Literal('after', {
					description: 'animation starts after the previous animation ends'
				})
			])
		),
		ease: Type.Optional(Ease)
	})
});
