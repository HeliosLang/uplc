import {
    makeArgSizesDiffCost,
    makeArgSizesQuadXYCost
} from "../../costmodel/index.js"
import { divideInteger as divideIntegerV1 } from "../v1/divideInteger.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const divideInteger = {
    ...divideIntegerV1,
    cpuModel: (params) =>
        makeArgSizesQuadXYCost(params.get(49), params.get(56), {
            c00: params.get(50),
            c01: params.get(51),
            c02: params.get(52),
            c10: params.get(53),
            c11: params.get(54),
            c20: params.get(55)
        }),
    memModel: (params) =>
        makeArgSizesDiffCost(params.get(59), params.get(57), params.get(58))
}
