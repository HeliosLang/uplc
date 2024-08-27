import { ArgSizesMaxCost } from "../../costmodel/index.js"
import { subtractInteger as subtractIntegerV1 } from "../v1/subtractInteger.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const subtractInteger = {
    ...subtractIntegerV1,
    cpuModel: (params) => new ArgSizesMaxCost(params.get(150), params.get(149)),
    memModel: (params) => new ArgSizesMaxCost(params.get(152), params.get(151))
}
