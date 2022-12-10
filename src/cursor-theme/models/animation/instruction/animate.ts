import { Type, Static } from '@sinclair/typebox'

type Animate = Static<typeof Animate>;
export const Animate = Type.Object({
    name: Type.Literal("animate"),
    arguments: Type.Object({
        duration: Type.Number(),
        delay: Type.Number(),
        when: Type.Union([
            Type.Literal("now"),
            Type.Literal("absolute"),
            Type.Literal("relative"),
            Type.Literal("last")
        ])
    })
});
