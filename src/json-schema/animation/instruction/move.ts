import { JSONSchemaType } from "ajv"
import { Move } from "../../../models/animation/instruction/position"

export const moveSchema: JSONSchemaType<Move> = {
    type: "object",
    properties: {
        name: { type: "string", const: "move"},
        arguments: {
            type:"array",
            items: [
                { type: "number"},
                { type: "number"},
            ],
            minItems: 2,
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
