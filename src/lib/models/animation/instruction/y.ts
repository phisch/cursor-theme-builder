import { type Static, Type } from '@sinclair/typebox';

type Y = Static<typeof Y>;
export const Y = Type.Object({
	name: Type.Literal('y', {
		description: 'Move the element by its upper-left corner to the specified y-coordinate.'
	}),
	args: Type.Object({
		y: Type.Number({ description: 'The y-coordinate to move the element to.' })
	})
});
