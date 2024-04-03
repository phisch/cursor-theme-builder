import { type Static, Type } from '@sinclair/typebox';

type DMove = Static<typeof DMove>;
export const DMove = Type.Object({
	name: Type.Literal('dmove', {
		description: 'shift the element in both the x and y directions relative to its current position'
	}),
	arguments: Type.Object({
		x: Type.Number(),
		y: Type.Number()
	})
});
