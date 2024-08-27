import { ArgSizesThirdCost } from "../../costmodel/index.js"
import { sliceByteString as sliceByteStringV1 } from "../v1/sliceByteString.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const sliceByteString = {
    ...sliceByteStringV1,
    cpuModel: (params) =>
        new ArgSizesThirdCost(params.get(144), params.get(143)),
    memModel: (params) =>
        new ArgSizesThirdCost(params.get(146), params.get(145))
}
