import { type Static, Type } from '@sinclair/typebox';

type Hide = Static<typeof Hide>;
export const Hide = Type.Object({
	name: Type.Literal('hide', {
		description: 'Hide the element.',
		args: Type.Optional(Type.Null())
	})
});
