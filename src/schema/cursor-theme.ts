import { JSONSchemaType } from "ajv"
import { Animation, animationSchema } from "./animations"

export type Sprite = {
    file: string,
    flips?: string[],
    animations?: Animation[]
}
const spriteSchema: JSONSchemaType<Sprite> = {
    type: "object",
    properties: {
        file: { type: "string" },
        flips: { type: "array", items: { type: "string" }, nullable: true },
        animations: {
            type: "array",
            items: animationSchema,
            nullable: true
        }
    },
    required: ["file"]
}

export type Cursor = {
    name: string,
    aliases?: string[],
    sprites: Sprite[]
}
const cursorSchema: JSONSchemaType<Cursor> = {
    type: "object",
    properties: {
        name: { type: "string" },
        aliases: {
            type: "array",
            items: { type: "string" },
            nullable: true
        },
        sprites: {
            type: "array",
            items: spriteSchema
        }
    },
    required: ["name", "sprites"]
}

export type Variant = {
    name: string,
    cursors: Cursor[],
    variants?: Variant[]
}
// casting the items $ref as any is necessary because of a limitation ajv,
// it **is** linked correctly though!
const variantSchema: JSONSchemaType<Variant> = {
    type: "object",
    properties: {
        name: { type: "string" },
        cursors: {
            type: "array",
            items: cursorSchema
        },
        variants: {
            type: "array",
            items: ({ $ref: "#/properties/variants/items" }) as any,
            nullable: true
        }
    },
    required: ["name", "cursors"]
}

export type CursorTheme = {
    name: string,
    description?: string,
    author?: string,
    variants: Variant[]
}

export const cursorThemeSchema: JSONSchemaType<CursorTheme> = {
    type: "object",
    properties: {
        name: { type: "string" },
        description: { type: "string", nullable: true },
        author: { type: "string", nullable: true },
        variants: {
            type: "array",
            items: variantSchema
        }
    },
    required: ["name", "variants"]
}
