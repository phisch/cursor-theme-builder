import { JSONSchemaType } from "ajv"
import { Size } from "../../../models/animation/instruction/resize"

export const sizeSchema: JSONSchemaType<Size> = {
    type: "object",
    properties: {
        name: { type: "string", const: "size"},
        arguments: {
            type:"array",
            items: [
                { type: "number" }
            ],
            minItems: 1,
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
