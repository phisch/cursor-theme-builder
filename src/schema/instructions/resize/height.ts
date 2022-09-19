import { JSONSchemaType } from "ajv"

export type Height = {
    name: "height"
    arguments: [number]
}

export const heightSchema: JSONSchemaType<Height> = {
    type: "object",
    properties: {
        name: { type: "string", const: "height" },
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
