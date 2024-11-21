import {
    makeArgSizesQuadXYCost,
    makeArgSizesSecondCost
} from "../../costmodel/index.js"
import { remainderInteger as remainderIntegerV1 } from "../v1/remainderInteger.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const remainderInteger = {
    ...remainderIntegerV1,
    cpuModel: (params) =>
        makeArgSizesQuadXYCost(params.get(141), params.get(148), {
            c00: params.get(142),
            c01: params.get(143),
            c02: params.get(144),
            c10: params.get(145),
            c11: params.get(146),
            c20: params.get(147)
        }),
    memModel: (params) =>
        makeArgSizesSecondCost(params.get(150), params.get(149))
}
