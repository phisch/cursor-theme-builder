import { type Static, Type } from '@sinclair/typebox';

type Translate = Static<typeof Translate>;
export const Translate = Type.Object({
	name: Type.Literal('translate', {
		description: 'Reposition the element by translating it along the x and y axes.'
	}),
	args: Type.Object({
		x: Type.Number({ description: 'The distance to translate the element along the x-axis.' }),
		y: Type.Number({ description: 'The distance to translate the element along the y-axis.' })
	})
});
