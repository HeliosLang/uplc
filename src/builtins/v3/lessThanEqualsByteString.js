import { ArgSizesConstCost, ArgSizesMinCost } from "../../costmodel/index.js"
import { lessThanEqualsByteString as lessThanEqualsByteStringV1 } from "../v1/lessThanEqualsByteString.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lessThanEqualsByteString = {
    ...lessThanEqualsByteStringV1,
    cpuModel: (params) => new ArgSizesMinCost(params.get(94), params.get(93)),
    memModel: (params) => new ArgSizesConstCost(params.get(95))
}
