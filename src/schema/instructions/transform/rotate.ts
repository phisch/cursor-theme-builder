import { JSONSchemaType } from "ajv"

// TODO: support specific rotation point (3 arguments)
export type Rotate = {
    name: "rotate"
    arguments: [number]
}

export const rotateSchema: JSONSchemaType<Rotate> = {
    type: "object",
    properties: {
        name: { type: "string", const: "rotate" },
        arguments: {
            type: "array",
            items: [
                { type: "number" },
            ],
            minItems: 1,
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
