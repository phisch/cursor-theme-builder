import { type Static, Type } from '@sinclair/typebox';

type Height = Static<typeof Height>;
export const Height = Type.Object({
	name: Type.Literal('height', {
		description: 'Set the height of the element.'
	}),
	args: Type.Object({
		height: Type.Number({ description: 'Height to set the element to.' })
	})
});
