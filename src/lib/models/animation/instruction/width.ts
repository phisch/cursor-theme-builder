import { type Static, Type } from '@sinclair/typebox';

type Width = Static<typeof Width>;
export const Width = Type.Object({
	name: Type.Literal('width', {
		description: 'Set the width of the element.'
	}),
	args: Type.Object({
		width: Type.Number({ description: 'The width of the element.' })
	})
});
