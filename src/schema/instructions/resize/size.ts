import { JSONSchemaType } from "ajv"

export type Size = {
    name: "size",
    arguments: [number | null, number] | [number]
}

export const sizeSchema: JSONSchemaType<Size> = {
    type: "object",
    properties: {
        name: { type: "string", const: "size"},
        arguments: {
            type:"array",
            oneOf: [
                {
                    items: [
                        { type: "number" }
                    ],
                    minItems: 1,
                },
                {
                    items: [
                        { type: "number", nullable: true },
                        { type: "number" }
                    ],
                    minItems: 2
                }
            ],
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
