import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { tailList as tailListV1 } from "../v1/tailList.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const tailList = /* @__PURE__ */ (() => ({
    ...tailListV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(153)),
    memModel: (params) => makeArgSizesConstCost(params.get(154))
}))()
