import { JSONSchemaType } from "ajv"

// TODO: implement (number, number) and (null, number)
export type Size = {
    name: "size",
    arguments: [number]
}

export const sizeSchema: JSONSchemaType<Size> = {
    type: "object",
    properties: {
        name: { type: "string", const: "size"},
        arguments: {
            type:"array",
            items: [
                { type: "number" }
            ],
            minItems: 1,
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
