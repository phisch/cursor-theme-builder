export type Height = {
    name: "height"
    arguments: [number]
}

// TODO: support ellipses (which take 2 arguments)
export type Radius = {
    name: "radius"
    arguments: [number]
}

// TODO: implement (number, number) and (null, number)
export type Size = {
    name: "size",
    arguments: [number]
}

export type Width = {
    name: "width"
    arguments: [number]
}

export type ResizeInstruction = Height | Radius | Size | Width
