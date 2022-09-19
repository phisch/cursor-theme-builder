import { JSONSchemaType } from "ajv"

export type Move = {
    name: "move",
    arguments: [number, number]
}

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
