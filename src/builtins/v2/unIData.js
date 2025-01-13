import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { unIData as unIDataV1 } from "../v1/unIData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const unIData = /* @__PURE__ */ (() => ({
    ...unIDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(161)),
    memModel: (params) => makeArgSizesConstCost(params.get(162))
}))()
