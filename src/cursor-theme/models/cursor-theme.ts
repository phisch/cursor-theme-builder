import { Animation } from "./animation"

export type CursorTheme = {
    name: string,
    description?: string,
    author?: string,
    variants: Variant[]
}

export type Variant = {
    name: string,
    cursors: Cursor[],
    variants?: Variant[]
}

export type Cursor = {
    name: string,
    aliases?: string[],
    sprites: Sprite[]
}

export type EmbeddedSprite = {
    svg: string,
    flips?: string[],
    animations?: Animation[]
}

export type FileSprite = {
    path: string,
    flips?: string[],
    animations?: Animation[]
}

export type Sprite = EmbeddedSprite | FileSprite