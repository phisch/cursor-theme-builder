import { type Static, Type } from '@sinclair/typebox';

type CX = Static<typeof CX>;
export const CX = Type.Object({
	name: Type.Literal('cx', {
		description: 'Move the element by its center in the x direction only.'
	}),
	args: Type.Object({
		x: Type.Number({ description: 'The x-coordinate to move the element to.' })
	})
});
