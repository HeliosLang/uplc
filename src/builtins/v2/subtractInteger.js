import { makeArgSizesMaxCost } from "../../costmodel/index.js"
import { subtractInteger as subtractIntegerV1 } from "../v1/subtractInteger.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const subtractInteger = {
    ...subtractIntegerV1,
    cpuModel: (params) => makeArgSizesMaxCost(params.get(150), params.get(149)),
    memModel: (params) => makeArgSizesMaxCost(params.get(152), params.get(151))
}
