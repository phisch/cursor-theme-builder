import { Type, Static } from '@sinclair/typebox'

type Translate = Static<typeof Translate>;
export const Translate = Type.Object({
    name: Type.Literal("translate"),
    arguments: Type.Tuple([
        Type.Number(),
        Type.Number()
    ])
});
