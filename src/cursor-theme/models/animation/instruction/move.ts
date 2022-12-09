import { Type, Static } from '@sinclair/typebox'

type Move = Static<typeof Move>;
export const Move = Type.Object({
    name: Type.Literal("move"),
    arguments: Type.Tuple([
        Type.Number(),
        Type.Number()
    ])
});
