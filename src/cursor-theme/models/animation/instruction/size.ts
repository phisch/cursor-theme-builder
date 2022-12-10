import { Type, Static } from '@sinclair/typebox'

// TODO: implement (number, number) and (null, number)
type Size = Static<typeof Size>;
export const Size = Type.Object({
    name: Type.Literal("size"),
    arguments: Type.Object({
        size: Type.Number()
    })
});
