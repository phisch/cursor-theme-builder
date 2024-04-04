import { type Static, Type } from '@sinclair/typebox';

type DMove = Static<typeof DMove>;
export const DMove = Type.Object({
	name: Type.Literal('dmove', {
		description:
			'Shift the element in both the x and y directions relative to its current position.'
	}),
	args: Type.Object({
		x: Type.Number({ description: 'The distance to move the element along the x-axis.' }),
		y: Type.Number({ description: 'The distance to move the element along the y-axis.' })
	})
});
