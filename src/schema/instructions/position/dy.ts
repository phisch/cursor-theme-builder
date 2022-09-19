import { JSONSchemaType } from "ajv"

export type DY = {
    name: "dy"
    arguments: [number]
}

export const dySchema: JSONSchemaType<DY> = {
    type: "object",
    properties: {
        name: { type: "string", const: "dy" },
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
