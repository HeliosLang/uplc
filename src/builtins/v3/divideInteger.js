import { ArgSizesDiffCost, ArgSizesQuadXYCost } from "../../costmodel/index.js"
import { divideInteger as divideIntegerV1 } from "../v1/divideInteger.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const divideInteger = {
    ...divideIntegerV1,
    cpuModel: (params) =>
        new ArgSizesQuadXYCost(params.get(49), params.get(56), {
            c00: params.get(50),
            c01: params.get(51),
            c02: params.get(52),
            c10: params.get(53),
            c11: params.get(54),
            c20: params.get(55)
        }),
    memModel: (params) =>
        new ArgSizesDiffCost(params.get(59), params.get(57), params.get(58))
}
