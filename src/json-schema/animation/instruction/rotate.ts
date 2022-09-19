import { JSONSchemaType } from "ajv"
import { Rotate } from "../../../models/animation/instruction/transform"

export const rotateSchema: JSONSchemaType<Rotate> = {
    type: "object",
    properties: {
        name: { type: "string", const: "rotate" },
        arguments: {
            type: "array",
            items: [
                { type: "number" },
            ],
            minItems: 1,
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
