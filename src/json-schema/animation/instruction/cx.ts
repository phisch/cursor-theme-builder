import { JSONSchemaType } from "ajv"
import { CX } from "../../../models/animation/instruction/position"

export const cxSchema: JSONSchemaType<CX> = {
    type: "object",
    properties: {
        name: { type: "string", const: "cx" },
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
