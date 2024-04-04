import { type Static, Type } from '@sinclair/typebox';

type Skew = Static<typeof Skew>;
export const Skew = Type.Object({
	name: Type.Literal('skew'),
	args: Type.Object({
		x: Type.Optional(Type.Number({ description: 'Skew degrees along the x-axis.' })),
		y: Type.Optional(Type.Number({ description: 'Skew degrees along the y-axis.' })),
		cx: Type.Optional(Type.Number({ description: 'The x-coordinate of the center of the skew.' })),
		cy: Type.Optional(Type.Number({ description: 'The y-coordinate of the center of the skew.' }))
	})
});
