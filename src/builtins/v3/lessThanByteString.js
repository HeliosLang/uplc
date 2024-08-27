import { ArgSizesConstCost, ArgSizesMinCost } from "../../costmodel/index.js"
import { lessThanByteString as lessThanByteStringV1 } from "../v1/lessThanByteString.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lessThanByteString = {
    ...lessThanByteStringV1,
    cpuModel: (params) => new ArgSizesMinCost(params.get(91), params.get(90)),
    memModel: (params) => new ArgSizesConstCost(params.get(92))
}
