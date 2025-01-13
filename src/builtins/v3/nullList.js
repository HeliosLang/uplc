import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { nullList as nullListV1 } from "../v1/nullList.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const nullList = /* @__PURE__ */ (() => ({
    ...nullListV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(128)),
    memModel: (params) => makeArgSizesConstCost(params.get(129))
}))()
