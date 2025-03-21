import {
    makeArgSizesDiffCost,
    makeArgSizesQuadXYCost
} from "../../costmodel/index.js"
import { quotientInteger as quotientIntegerV1 } from "../v1/quotientInteger.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const quotientInteger = /* @__PURE__ */ (() => ({
    ...quotientIntegerV1,
    cpuModel: (params) =>
        makeArgSizesQuadXYCost(params.get(130), params.get(137), {
            c00: params.get(131),
            c01: params.get(132),
            c02: params.get(133),
            c10: params.get(134),
            c11: params.get(135),
            c20: params.get(136)
        }),
    memModel: (params) =>
        makeArgSizesDiffCost(params.get(140), params.get(138), params.get(139))
}))()
