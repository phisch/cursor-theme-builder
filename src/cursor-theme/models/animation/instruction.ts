import { AnimateInstruction } from "./instruction/animate";
import { PositionInstruction } from "./instruction/position";
import { ResizeInstruction } from "./instruction/resize";
import { TransformInstruction } from "./instruction/transform";

export type Instruction = AnimateInstruction | PositionInstruction | ResizeInstruction | TransformInstruction