import { Type, Static } from '@sinclair/typebox'

type Center = Static<typeof Center>;
export const Center = Type.Object({
    name: Type.Literal("center"),
    arguments: Type.Object({
        x: Type.Number(),
        y: Type.Number()
    })
});
