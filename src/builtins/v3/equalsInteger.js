import { ArgSizesConstCost, ArgSizesMinCost } from "../../costmodel/index.js"
import { equalsInteger as equalsIntegerV1 } from "../v1/equalsInteger.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const equalsInteger = {
    ...equalsIntegerV1,
    cpuModel: (params) => new ArgSizesMinCost(params.get(72), params.get(71)),
    memModel: (params) => new ArgSizesConstCost(params.get(73))
}
