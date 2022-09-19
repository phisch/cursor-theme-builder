import { Animation } from "./animation"

export type Sprite = {
    file: string,
    flips?: string[],
    animations?: Animation[]
}

export type Cursor = {
    name: string,
    aliases?: string[],
    sprites: Sprite[]
}

export type Variant = {
    name: string,
    cursors: Cursor[],
    variants?: Variant[]
}

export type CursorTheme = {
    name: string,
    description?: string,
    author?: string,
    variants: Variant[]
}
