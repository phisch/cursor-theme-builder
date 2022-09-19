import { JSONSchemaType } from "ajv"

export type Y = {
    name: "y"
    arguments: [number]
}

export const ySchema: JSONSchemaType<Y> = {
    type: "object",
    properties: {
        name: { type: "string", const: "y" },
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
