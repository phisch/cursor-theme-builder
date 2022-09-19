import { JSONSchemaType } from "ajv"
import { Height } from "../../../models/animation/instruction/resize"

export const heightSchema: JSONSchemaType<Height> = {
    type: "object",
    properties: {
        name: { type: "string", const: "height" },
        arguments: {
            type:"array",
            items: [
                { type: "number" },
            ],
            minItems: 1,
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
