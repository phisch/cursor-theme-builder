import { JSONSchemaType } from "ajv"

export type CY = {
    name: "cy"
    arguments: [number]
}

export const cySchema: JSONSchemaType<CY> = {
    type: "object",
    properties: {
        name: { type: "string", const: "cy" },
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
