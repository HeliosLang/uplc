import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { indexByteString as indexByteStringV1 } from "../v1/indexByteString.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const indexByteString = /* @__PURE__ */ (() => ({
    ...indexByteStringV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(86)),
    memModel: (params) => makeArgSizesConstCost(params.get(87))
}))()
