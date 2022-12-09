import { Type, Static } from '@sinclair/typebox'

type Width = Static<typeof Width>;
export const Width = Type.Object({
    name: Type.Literal("width"),
    arguments: Type.Tuple([
        Type.Number()
    ])
});
