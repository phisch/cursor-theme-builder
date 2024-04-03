import { type Static, Type } from '@sinclair/typebox';

type CX = Static<typeof CX>;
export const CX = Type.Object({
	name: Type.Literal('cx', {
		description: 'move the element by its center in the x direction only'
	}),
	arguments: Type.Object({
		x: Type.Number()
	})
});
