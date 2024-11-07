import {
    makeArgSizesSecondCost,
    makeArgSizesQuadXYCost
} from "../../costmodel/index.js"
import { modInteger as modIntegerV1 } from "../v1/modInteger.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const modInteger = {
    ...modIntegerV1,
    cpuModel: (params) =>
        makeArgSizesQuadXYCost(params.get(114), params.get(121), {
            c00: params.get(115),
            c01: params.get(116),
            c02: params.get(117),
            c10: params.get(118),
            c11: params.get(119),
            c20: params.get(120)
        }),
    memModel: (params) =>
        makeArgSizesSecondCost(params.get(123), params.get(122))
}
