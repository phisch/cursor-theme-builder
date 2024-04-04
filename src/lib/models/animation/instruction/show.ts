import { Type, type Static } from '@sinclair/typebox';

type Show = Static<typeof Show>;
export const Show = Type.Object({
	name: Type.Literal('show', {
		description: 'Show the element.',
		args: Type.Optional(Type.Null())
	})
});
