import { JSONSchemaType } from "ajv"
import { DY } from "../../../models/animation/instruction/position"

export const dySchema: JSONSchemaType<DY> = {
    type: "object",
    properties: {
        name: { type: "string", const: "dy" },
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
