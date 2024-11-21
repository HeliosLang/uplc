import { makeArgSizesThirdCost } from "../../costmodel/index.js"
import { sliceByteString as sliceByteStringV1 } from "../v1/sliceByteString.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const sliceByteString = {
    ...sliceByteStringV1,
    cpuModel: (params) =>
        makeArgSizesThirdCost(params.get(144), params.get(143)),
    memModel: (params) =>
        makeArgSizesThirdCost(params.get(146), params.get(145))
}
