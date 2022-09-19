import { JSONSchemaType } from "ajv"

export type CX = {
    name: "cx"
    arguments: [number]
}

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
