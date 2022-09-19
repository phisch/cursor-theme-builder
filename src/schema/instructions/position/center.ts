import { JSONSchemaType } from "ajv"

export type Center = {
    name: "center",
    arguments: [number, number]
}

export const centerSchema: JSONSchemaType<Center> = {
    type: "object",
    properties: {
        name: { type: "string", const: "center"},
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
