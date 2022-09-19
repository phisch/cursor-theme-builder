import { JSONSchemaType } from "ajv"

export type DX = {
    name: "dx"
    arguments: [number]
}

export const dxSchema: JSONSchemaType<DX> = {
    type: "object",
    properties: {
        name: { type: "string", const: "dx" },
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
