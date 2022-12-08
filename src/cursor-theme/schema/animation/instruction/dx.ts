import { JSONSchemaType } from "ajv"
import { DX } from "../../../models/animation/instruction/position"

export const dxSchema: JSONSchemaType<DX> = {
    type: "object",
    properties: {
        name: { type: "string", const: "dx" },
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
