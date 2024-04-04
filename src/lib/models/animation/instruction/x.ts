import { type Static, Type } from '@sinclair/typebox';

type X = Static<typeof X>;
export const X = Type.Object({
	name: Type.Literal('x', {
		description: 'Move the element by its upper-left corner to the specified x-coordinate.'
	}),
	args: Type.Object({
		x: Type.Number({ description: 'The x-coordinate to move the element to.' })
	})
});
