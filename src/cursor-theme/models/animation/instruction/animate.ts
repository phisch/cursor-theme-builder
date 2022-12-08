export type Animate = {
    name: "animate",
    arguments: [number, number, "now" | "absolute" | "relative" | "last"]
}

export type AnimateInstruction = Animate;