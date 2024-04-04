import { type Static, Type } from '@sinclair/typebox';

type Move = Static<typeof Move>;
export const Move = Type.Object({
	name: Type.Literal('move', {
		description: 'Move the element by its upper-left corner to the specified coordinates.'
	}),
	args: Type.Object({
		x: Type.Number({ description: 'The x-coordinate to move the element to.' }),
		y: Type.Number({ description: 'The y-coordinate to move the element to.' })
	})
});
