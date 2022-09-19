import { Instruction } from "./animation/instruction"

export type Animation = {
    selector: string,
    instructions: Instruction[]
}