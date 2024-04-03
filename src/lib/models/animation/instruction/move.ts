import { type Static, Type } from '@sinclair/typebox';

type Move = Static<typeof Move>;
export const Move = Type.Object({
	name: Type.Literal('move', {
		description: 'move the element by its upper-left corner to the specified coordinates'
	}),
	arguments: Type.Object({
		x: Type.Number(),
		y: Type.Number()
	})
});
