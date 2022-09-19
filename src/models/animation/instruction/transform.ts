export type Flip = {
    name: "flip"
    arguments: ["x" | "y" | "both"]
}

// TODO: support specific rotation point (3 arguments)
export type Rotate = {
    name: "rotate"
    arguments: [number]
}

// TODO: implement x and y (2 arguments) scaling and scale center point (3 arguments)
export type Scale = {
    name: "scale",
    arguments: [number]
}

export type Skew = {
    name: "skew",
    arguments: [number, number]
}

export type Translate = {
    name: "translate",
    arguments: [number, number]
}

export type TransformInstruction = Flip | Rotate | Scale | Skew | Translate
