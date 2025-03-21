import { makeArgSizesThirdCost } from "../../costmodel/index.js"
import { sliceByteString as sliceByteStringV1 } from "../v1/sliceByteString.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const sliceByteString = /* @__PURE__ */ (() => ({
    ...sliceByteStringV1,
    cpuModel: (params) =>
        makeArgSizesThirdCost(params.get(162), params.get(161)),
    memModel: (params) =>
        makeArgSizesThirdCost(params.get(164), params.get(163))
}))()
