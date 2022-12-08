import { JSONSchemaType } from "ajv";
import { Animation } from "../models/animation";
import { instructionSchema } from "./animation/instruction";

export const animationSchema: JSONSchemaType<Animation> = {
    type: "object",
    properties: {
        selector: {
            type: "string"
        },
        instructions: {
            type: "array",
            items: instructionSchema
        }
    },
    required: ["selector", "instructions"]
}

export const animationsSchema: JSONSchemaType<Animation[]> = {
    type: "array",
    items: animationSchema
}