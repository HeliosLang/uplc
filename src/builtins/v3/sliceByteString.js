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
        new ArgSizesThirdCost(params.get(162), params.get(161)),
    memModel: (params) =>
        new ArgSizesThirdCost(params.get(164), params.get(163))
}
