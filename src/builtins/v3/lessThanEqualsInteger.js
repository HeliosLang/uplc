import {
    makeArgSizesConstCost,
    makeArgSizesMinCost
} from "../../costmodel/index.js"
import { lessThanEqualsInteger as lessThanEqualsIntegerV1 } from "../v1/lessThanEqualsInteger.js"

/**
 * @import { Builtin } from "../../index.js"
 */
/**
 * @type {Builtin}
 */
export const lessThanEqualsInteger = /* @__PURE__ */ (() => ({
    ...lessThanEqualsIntegerV1,
    cpuModel: (params) => makeArgSizesMinCost(params.get(97), params.get(96)),
    memModel: (params) => makeArgSizesConstCost(params.get(98))
}))()
