import { JSONSchemaType } from "ajv"

export type Flip = {
    name: "flip"
    arguments: ["x" | "y" | "both"]
}

export const flipSchema: JSONSchemaType<Flip> = {
    type: "object",
    properties: {
        name: { type: "string", const: "flip" },
        arguments: {
            type: "array",
            items: [
                { type: "string", enum: ["x", "y", "both"] },
            ],
            minItems: 1,
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
