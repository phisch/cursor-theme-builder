import { JSONSchemaType } from "ajv"

export type Width = {
    name: "width"
    arguments: [number]
}

export const widthSchema: JSONSchemaType<Width> = {
    type: "object",
    properties: {
        name: { type: "string", const: "width" },
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
