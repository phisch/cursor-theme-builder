import { Type, Static } from '@sinclair/typebox'

// TODO: support specific rotation point (3 arguments)
type Rotate = Static<typeof Rotate>;
export const Rotate = Type.Object({
    name: Type.Literal("rotate"),
    arguments: Type.Tuple([
        Type.Number()
    ])
});
