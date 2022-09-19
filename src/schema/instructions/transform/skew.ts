import { JSONSchemaType } from "ajv"

export type Skew = {
    name: "skew",
    arguments: [number, number]
}

export const skewSchema: JSONSchemaType<Skew> = {
    type: "object",
    properties: {
        name: { type: "string", const: "skew"},
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
