import { JSONSchemaType } from "ajv"

export type DMove = {
    name: "dmove",
    arguments: [number, number]
}

export const dmoveSchema: JSONSchemaType<DMove> = {
    type: "object",
    properties: {
        name: { type: "string", const: "dmove"},
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
