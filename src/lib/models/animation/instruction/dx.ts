import { type Static, Type } from '@sinclair/typebox';

type DX = Static<typeof DX>;
export const DX = Type.Object({
	name: Type.Literal('dx'),
	arguments: Type.Object({
		x: Type.Number()
	})
});
