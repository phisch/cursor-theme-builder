import { JSONSchemaType } from "ajv"
import { Center } from "../../../models/animation/instruction/position"

export const centerSchema: JSONSchemaType<Center> = {
    type: "object",
    properties: {
        name: { type: "string", const: "center"},
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
