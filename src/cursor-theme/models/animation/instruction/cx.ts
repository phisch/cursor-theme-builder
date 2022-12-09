import { Type, Static } from '@sinclair/typebox'

type CX = Static<typeof CX>;
export const CX = Type.Object({
    name: Type.Literal("cx"),
    arguments: Type.Tuple([
        Type.Number()
    ])
});
