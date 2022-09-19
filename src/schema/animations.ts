import { JSONSchemaType } from "ajv"
import { Animate, animateSchema } from "./instructions/animate"
import { Center, centerSchema } from "./instructions/position/center"
import { CX, cxSchema } from "./instructions/position/cx"
import { CY, cySchema } from "./instructions/position/cy"
import { DMove, dmoveSchema } from "./instructions/position/dmove"
import { DX, dxSchema } from "./instructions/position/dx"
import { DY, dySchema } from "./instructions/position/dy"
import { Move, moveSchema } from "./instructions/position/move"
import { X, xSchema } from "./instructions/position/x"
import { Y, ySchema } from "./instructions/position/y"
import { Height, heightSchema } from "./instructions/resize/height"
import { Radius, radiusSchema } from "./instructions/resize/radius"
import { Size, sizeSchema } from "./instructions/resize/size"
import { Width, widthSchema } from "./instructions/resize/width"
import { Flip, flipSchema } from "./instructions/transform/flip"
import { Rotate, rotateSchema } from "./instructions/transform/rotate"
import { Scale, scaleSchema } from "./instructions/transform/scale"
import { Skew, skewSchema } from "./instructions/transform/skew"
import { Translate, translateSchema } from "./instructions/transform/translate"

type PositionInstruction = Center | CX | CY | DMove | DX | DY | Move | X | Y
type ResizeInstruction = Height | Radius | Size | Width
type TransformInstruction = Flip | Rotate | Scale | Skew | Translate

type Instruction = Animate | PositionInstruction | ResizeInstruction | TransformInstruction

type Animation = {
    selector: string,
    instructions: Instruction[]
}

type Animations = Animation[]
export const animationsSchema: JSONSchemaType<Animations> = {
    type: "array",
    items: {
        type: "object",
        properties: {
            selector: {
                type: "string"
            },
            instructions: {
                type: "array",
                items: {
                    oneOf: [
                        animateSchema,
                        centerSchema,
                        cxSchema,
                        cySchema,
                        dmoveSchema,
                        dxSchema,
                        dySchema,
                        moveSchema,
                        xSchema,
                        ySchema,
                        heightSchema,
                        radiusSchema,
                        sizeSchema,
                        widthSchema,
                        flipSchema,
                        rotateSchema,
                        scaleSchema,
                        skewSchema,
                        translateSchema
                    ]
                }
            }
        },
        required: ["selector", "instructions"]
    },
    minItems: 1
}
