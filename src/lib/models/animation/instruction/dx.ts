import { type Static, Type } from '@sinclair/typebox';

type DX = Static<typeof DX>;
export const DX = Type.Object({
	name: Type.Literal('dx', {
		description: 'shift the element in the x direction relative to its current position'
	}),
	arguments: Type.Object({
		x: Type.Number()
	})
});
