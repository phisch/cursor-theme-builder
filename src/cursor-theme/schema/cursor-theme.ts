import { JSONSchemaType } from "ajv"
import { Cursor, CursorTheme, FileSprite, EmbeddedSprite, Sprite, Variant } from "../models/cursor-theme"
import { animationSchema } from "./animation"

const fileSpriteSchema: JSONSchemaType<FileSprite> = {
    type: "object",
    properties: {
        path: { type: "string" },
        flips: { type: "array", items: { type: "string" }, nullable: true },
        animations: {
            type: "array",
            items: animationSchema,
            nullable: true
        }
    },
    required: ["path"]
}

const embeddedSpriteSchema: JSONSchemaType<EmbeddedSprite> = {
    type: "object",
    properties: {
        svg: { type: "string" },
        flips: { type: "array", items: { type: "string" }, nullable: true },
        animations: {
            type: "array",
            items: animationSchema,
            nullable: true
        }
    },
    required: ["svg"]
}

const spriteSchema: JSONSchemaType<Sprite> = {
    oneOf: [
        fileSpriteSchema,
        embeddedSpriteSchema
    ],
    
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

// casting the items $ref as any is necessary because of a limitation ajv,
// it **is** linked correctly though!
const variantSchema: JSONSchemaType<Variant> = {
    type: "object",
    properties: {
        name: {
            type: "string",
            examples: ["light", "dark", "colorful", "animated"],
            description: "The name of this cursor theme variant."
        },
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

export const cursorThemeSchema: JSONSchemaType<CursorTheme> = {
    type: "object",
    properties: {
        name: { type: "string" },
        description: { type: "string", nullable: true },
        author: {
            type: "string",
            nullable: true,
            description: "The name of the author of this theme."
        },
        variants: {
            type: "array",
            items: variantSchema
        }
    },
    required: ["name", "variants"]
}
