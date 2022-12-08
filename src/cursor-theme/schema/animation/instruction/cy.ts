import { JSONSchemaType } from "ajv"
import { CY } from "../../../models/animation/instruction/position"

export const cySchema: JSONSchemaType<CY> = {
    type: "object",
    properties: {
        name: { type: "string", const: "cy" },
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
