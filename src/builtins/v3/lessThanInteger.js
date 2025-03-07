import {
    makeArgSizesConstCost,
    makeArgSizesMinCost
} from "../../costmodel/index.js"
import { lessThanInteger as lessThanIntegerV1 } from "../v1/lessThanInteger.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const lessThanInteger = /* @__PURE__ */ (() => ({
    ...lessThanIntegerV1,
    cpuModel: (params) => makeArgSizesMinCost(params.get(100), params.get(99)),
    memModel: (params) => makeArgSizesConstCost(params.get(101))
}))()
