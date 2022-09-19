import { JSONSchemaType } from "ajv"

// TODO: implement x and y (2 arguments) scaling and scale center point (3 arguments)
export type Scale = {
    name: "scale",
    arguments: [number]
}

export const scaleSchema: JSONSchemaType<Scale> = {
    type: "object",
    properties: {
        name: { type: "string", const: "scale"},
        arguments: {
            type:"array",
            items: [
                { type: "number"},
            ],
            minItems: 1,
            additionalItems: false
        }
    },
    required: ["name", "arguments"]
}
