import { type Static, Type } from '@sinclair/typebox';

type CY = Static<typeof CY>;
export const CY = Type.Object({
	name: Type.Literal('cy', {
		description: 'move the element by its center in the y direction only'
	}),
	arguments: Type.Object({
		y: Type.Number()
	})
});
