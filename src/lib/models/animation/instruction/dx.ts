import { type Static, Type } from '@sinclair/typebox';

type DX = Static<typeof DX>;
export const DX = Type.Object({
	name: Type.Literal('dx', {
		description: 'Shift the element in the x direction relative to its current position'
	}),
	args: Type.Object({
		x: Type.Number({ description: 'The distance to move the element along the x-axis.' })
	})
});
