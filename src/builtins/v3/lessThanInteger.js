import { ArgSizesConstCost, ArgSizesMinCost } from "../../costmodel/index.js"
import { lessThanInteger as lessThanIntegerV1 } from "../v1/lessThanInteger.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lessThanInteger = {
    ...lessThanIntegerV1,
    cpuModel: (params) => new ArgSizesMinCost(params.get(100), params.get(99)),
    memModel: (params) => new ArgSizesConstCost(params.get(101))
}
