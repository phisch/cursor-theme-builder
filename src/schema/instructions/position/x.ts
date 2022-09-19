import { JSONSchemaType } from "ajv"

export type X = {
    name: "x"
    arguments: [number]
}

export const xSchema: JSONSchemaType<X> = {
    type: "object",
    properties: {
        name: { type: "string", const: "x" },
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
