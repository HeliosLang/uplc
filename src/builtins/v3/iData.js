import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { iData as iDataV1 } from "../v1/iData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const iData = /* @__PURE__ */ (() => ({
    ...iDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(82)),
    memModel: (params) => makeArgSizesConstCost(params.get(83))
}))()
