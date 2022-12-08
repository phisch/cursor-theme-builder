import { JSONSchemaType } from "ajv"
import { Radius } from "../../../models/animation/instruction/resize"

export const radiusSchema: JSONSchemaType<Radius> = {
    type: "object",
    properties: {
        name: { type: "string", const: "radius" },
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
