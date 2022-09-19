import { JSONSchemaType } from "ajv"
import { Flip } from "../../../models/animation/instruction/transform"

export const flipSchema: JSONSchemaType<Flip> = {
    type: "object",
    properties: {
        name: { type: "string", const: "flip" },
        arguments: {
            type: "array",
            items: [
                { type: "string", enum: ["x", "y", "both"] },
            ],
            minItems: 1,
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
