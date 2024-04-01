import { type Static, Type } from '@sinclair/typebox';

type Dy = Static<typeof Dy>;
export const Dy = Type.Object({
	name: Type.Literal('dy'),
	arguments: Type.Object({
		y: Type.Number()
	})
});
