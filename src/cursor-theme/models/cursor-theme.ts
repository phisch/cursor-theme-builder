import { Type, Static } from '@sinclair/typebox'
import { IntersectAllOf } from '../../typebox/intersect-all-of';
import { UnionOneOf } from '../../typebox/union-one-of';
import { Animation } from './animation/animation';


export type HotSpotSelector = Static<typeof HotSpotSelector>;
export const HotSpotSelector = Type.String(
    {
        title: "CSS selector",
        description: "Select an element whose center should be used as the hotspot.",
        examples: ["#hotspot"]
    }
);

export type HotSpot = Static<typeof HotSpot>;
export const HotSpot = Type.Object({
    x: Type.Number(),
    y: Type.Number()
});

export type Sprite = Static<typeof Sprite>;
export const Sprite = IntersectAllOf([
    UnionOneOf([
        Type.Object({ file: Type.String(), svg: Type.Optional(Type.Never()) }),
        Type.Object({ svg: Type.String(), file: Type.Optional(Type.Never()) })
    ]),
    Type.Object({
        flips: Type.Optional(Type.Array(Type.String())),
        animations: Type.Optional(Type.Array(Animation)),
        hotSpot: Type.Optional(
            Type.Union([
                HotSpot,
                HotSpotSelector
            ])
        )
    })
]);

export type Cursor = Static<typeof Cursor>;
export const Cursor = Type.Object({
    name: Type.String(),
    aliases: Type.Optional(Type.Array(Type.String())),
    sprites: Type.Array(Sprite)
});

export type Variant = Static<typeof Variant>
export const Variant = Type.Recursive(Variant => Type.Object({
    name: Type.String(),
    cursors: Type.Array(Cursor),
    variants: Type.Optional(Type.Array(Variant))
}), { $id: 'Variant' });

export type CursorTheme = Static<typeof CursorTheme>
export const CursorTheme = Type.Object({
    name: Type.String(),
    description: Type.Optional(Type.String()),
    author: Type.Optional(Type.String()),
    variants: Type.Array(Variant)
});