import { Type, Static } from '@sinclair/typebox'

type Y = Static<typeof Y>;
export const Y = Type.Object({
    name: Type.Literal("y"),
    arguments: Type.Tuple([
        Type.Number()
    ])
});
