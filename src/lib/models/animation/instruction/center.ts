import { type Static, Type } from '@sinclair/typebox';

type Center = Static<typeof Center>;
export const Center = Type.Object({
	name: Type.Literal('center', {
		description: 'move the element by its center to the specified coordinates'
	}),
	arguments: Type.Object({
		x: Type.Number(),
		y: Type.Number()
	})
});
