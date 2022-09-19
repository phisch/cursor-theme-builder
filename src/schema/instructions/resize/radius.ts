import { JSONSchemaType } from "ajv"

// TODO: support ellipses (which take 2 arguments)
export type Radius = {
    name: "radius"
    arguments: [number]
}

export const radiusSchema: JSONSchemaType<Radius> = {
    type: "object",
    properties: {
        name: { type: "string", const: "radius" },
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
