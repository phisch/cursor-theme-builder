import { Type, Static } from '@sinclair/typebox'

type DX = Static<typeof DX>;
export const DX = Type.Object({
    name: Type.Literal("dx"),
    arguments: Type.Tuple([
        Type.Number()
    ])
});
