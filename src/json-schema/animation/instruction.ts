import { JSONSchemaType } from "ajv";
import { Instruction } from "../../models/animation/instruction";
import { animateSchema } from "./instruction/animate";
import { centerSchema } from "./instruction/center";
import { cxSchema } from "./instruction/cx";
import { cySchema } from "./instruction/cy";
import { dmoveSchema } from "./instruction/dmove";
import { dxSchema } from "./instruction/dx";
import { dySchema } from "./instruction/dy";
import { flipSchema } from "./instruction/flip";
import { heightSchema } from "./instruction/height";
import { moveSchema } from "./instruction/move";
import { radiusSchema } from "./instruction/radius";
import { rotateSchema } from "./instruction/rotate";
import { scaleSchema } from "./instruction/scale";
import { sizeSchema } from "./instruction/size";
import { skewSchema } from "./instruction/skew";
import { translateSchema } from "./instruction/translate";
import { widthSchema } from "./instruction/width";
import { xSchema } from "./instruction/x";
import { ySchema } from "./instruction/y";

export const instructionSchema: JSONSchemaType<Instruction> = {
    oneOf: [
        animateSchema,
        centerSchema,
        cxSchema,
        cySchema,
        dmoveSchema,
        dxSchema,
        dySchema,
        moveSchema,
        xSchema,
        ySchema,
        heightSchema,
        radiusSchema,
        sizeSchema,
        widthSchema,
        flipSchema,
        rotateSchema,
        scaleSchema,
        skewSchema,
        translateSchema
    ]
}