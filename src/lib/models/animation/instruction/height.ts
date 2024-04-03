import { type Static, Type } from '@sinclair/typebox';

type Height = Static<typeof Height>;
export const Height = Type.Object({
	name: Type.Literal('height', {
		description: 'set the height of the element'
	}),
	arguments: Type.Object({
		height: Type.Number()
	})
});
