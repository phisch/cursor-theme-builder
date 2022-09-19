import { JSONSchemaType } from "ajv"
import { Scale } from "../../../models/animation/instruction/transform"

export const scaleSchema: JSONSchemaType<Scale> = {
    type: "object",
    properties: {
        name: { type: "string", const: "scale"},
        arguments: {
            type:"array",
            items: [
                { type: "number"},
            ],
            minItems: 1,
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
