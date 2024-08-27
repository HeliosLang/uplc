import { ArgSizesConstCost, ArgSizesMinCost } from "../../costmodel/index.js"
import { lessThanEqualsInteger as lessThanEqualsIntegerV1 } from "../v1/lessThanEqualsInteger.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lessThanEqualsInteger = {
    ...lessThanEqualsIntegerV1,
    cpuModel: (params) => new ArgSizesMinCost(params.get(97), params.get(96)),
    memModel: (params) => new ArgSizesConstCost(params.get(98))
}
