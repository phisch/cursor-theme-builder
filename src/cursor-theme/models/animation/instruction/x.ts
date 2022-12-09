import { Type, Static } from '@sinclair/typebox'

type X = Static<typeof X>;
export const X = Type.Object({
    name: Type.Literal("x"),
    arguments: Type.Tuple([
        Type.Number()
    ])
});
