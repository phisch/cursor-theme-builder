import { type Static, Type } from "@sinclair/typebox";
import { Animation } from "./animation/animation";

export function isSelector(hotSpot?: HotSpot): hotSpot is Selector {
	return typeof hotSpot === "string";
}

export function isCoordinates(hotSpot?: HotSpot): hotSpot is Coordinates {
	return typeof hotSpot === "object";
}

export type Selector = Static<typeof Selector>;
export const Selector = Type.String({
	title: "CSS selector",
	description: "Select an element whose center should be used as the hotspot.",
	examples: ["#hotspot"],
});

export type Coordinates = Static<typeof Coordinates>;
export const Coordinates = Type.Object({
	x: Type.Number(),
	y: Type.Number(),
});

export type HotSpot = Static<typeof HotSpot>;
export const HotSpot = Type.Union([Selector, Coordinates]);

export type Animations = Static<typeof Animations>;
export const Animations = Type.Array(Animation);

export type Sprite = Static<typeof Sprite>;
export const Sprite = Type.Object({
	file: Type.String(),
	flips: Type.Optional(Type.Array(Type.String())),
	animations: Type.Optional(Animations),
	hotSpot: Type.Optional(HotSpot),
});

export type Cursor = Static<typeof Cursor>;
export const Cursor = Type.Object({
	name: Type.String(),
	aliases: Type.Optional(Type.Array(Type.String())),
	sprites: Type.Array(Sprite),
});

export type Variant = Static<typeof Variant>;
export const Variant = Type.Recursive(
	(Variant) =>
		Type.Object({
			name: Type.String(),
			cursors: Type.Array(Cursor),
			variants: Type.Optional(Type.Array(Variant)),
		}),
	{ $id: "Variant" },
);

export type CursorTheme = Static<typeof CursorTheme>;
export const CursorTheme = Type.Object({
	name: Type.String(),
	description: Type.Optional(Type.String()),
	author: Type.Optional(Type.String()),
	variants: Type.Array(Variant),
});
