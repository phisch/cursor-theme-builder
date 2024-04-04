import { type Static, Type } from '@sinclair/typebox';

type CY = Static<typeof CY>;
export const CY = Type.Object({
	name: Type.Literal('cy', {
		description: 'Move the element by its center in the y direction only.'
	}),
	args: Type.Object({
		y: Type.Number({ description: 'The y-coordinate to move the element to.' })
	})
});
