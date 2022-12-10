import { Type, Static } from '@sinclair/typebox'

type Height = Static<typeof Height>;
export const Height = Type.Object({
    name: Type.Literal("height"),
    arguments: Type.Object({
        height: Type.Number()
    })
});
