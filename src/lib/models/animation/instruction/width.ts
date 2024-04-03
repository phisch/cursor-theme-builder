import { type Static, Type } from '@sinclair/typebox';

type Width = Static<typeof Width>;
export const Width = Type.Object({
	name: Type.Literal('width', {
		description: 'set the width of the element'
	}),
	arguments: Type.Object({
		width: Type.Number()
	})
});
