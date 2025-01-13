import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { listData as listDataV1 } from "../v1/listData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const listData = /* @__PURE__ */ (() => ({
    ...listDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(102)),
    memModel: (params) => makeArgSizesConstCost(params.get(103))
}))()
