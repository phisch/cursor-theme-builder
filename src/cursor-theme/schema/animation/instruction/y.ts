import { JSONSchemaType } from "ajv"
import { Y } from "../../../models/animation/instruction/position"

export const ySchema: JSONSchemaType<Y> = {
    type: "object",
    properties: {
        name: { type: "string", const: "y" },
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
