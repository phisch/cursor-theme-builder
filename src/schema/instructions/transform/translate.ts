import { JSONSchemaType } from "ajv"

export type Translate = {
    name: "translate",
    arguments: [number, number]
}

export const translateSchema: JSONSchemaType<Translate> = {
    type: "object",
    properties: {
        name: { type: "string", const: "translate"},
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
