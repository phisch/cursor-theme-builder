import { type Static, Type } from '@sinclair/typebox';

type Center = Static<typeof Center>;
export const Center = Type.Object({
	name: Type.Literal('center', {
		description: 'Move the element by its center to the specified coordinates.'
	}),
	args: Type.Object({
		x: Type.Number({ description: 'The x-coordinate to move the element to.' }),
		y: Type.Number({ description: 'The y-coordinate to move the element to.' })
	})
});
