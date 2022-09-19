export type Center = {
    name: "center",
    arguments: [number, number]
}

export type CX = {
    name: "cx"
    arguments: [number]
}

export type CY = {
    name: "cy"
    arguments: [number]
}

export type DMove = {
    name: "dmove",
    arguments: [number, number]
}

export type DX = {
    name: "dx"
    arguments: [number]
}

export type DY = {
    name: "dy"
    arguments: [number]
}

export type Move = {
    name: "move",
    arguments: [number, number]
}

export type X = {
    name: "x"
    arguments: [number]
}

export type Y = {
    name: "y"
    arguments: [number]
}

export type PositionInstruction = Center | CX | CY | DMove | DX | DY | Move | X | Y
