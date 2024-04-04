import { type Static, Type } from '@sinclair/typebox';

type Size = Static<typeof Size>;
export const Size = Type.Object({
	name: Type.Literal('size', {
		description: 'Change the size of the element.'
	}),
	args: Type.Object({
		width: Type.Optional(
			Type.Number({
				description:
					'The width of the element. Omitting this will change the width proportionally to the height.'
			})
		),
		height: Type.Optional(
			Type.Number({
				description:
					'The height of the element. Omitting this will change the height proportionally to the width.'
			})
		)
	})
});
