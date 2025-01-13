import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { unConstrData as unConstrDataV1 } from "../v1/unConstrData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const unConstrData = /* @__PURE__ */ (() => ({
    ...unConstrDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(177)),
    memModel: (params) => makeArgSizesConstCost(params.get(178))
}))()
