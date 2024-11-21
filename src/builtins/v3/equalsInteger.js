import {
    makeArgSizesConstCost,
    makeArgSizesMinCost
} from "../../costmodel/index.js"
import { equalsInteger as equalsIntegerV1 } from "../v1/equalsInteger.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const equalsInteger = {
    ...equalsIntegerV1,
    cpuModel: (params) => makeArgSizesMinCost(params.get(72), params.get(71)),
    memModel: (params) => makeArgSizesConstCost(params.get(73))
}
