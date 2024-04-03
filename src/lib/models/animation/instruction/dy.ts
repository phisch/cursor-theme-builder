import { type Static, Type } from '@sinclair/typebox';

type Dy = Static<typeof Dy>;
export const Dy = Type.Object({
	name: Type.Literal('dy', {
		description: 'shift the element in the y direction relative to its current position'
	}),
	arguments: Type.Object({
		y: Type.Number()
	})
});
