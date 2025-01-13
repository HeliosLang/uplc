import {
    makeArgSizesConstCost,
    makeArgSizesMinCost
} from "../../costmodel/index.js"
import { equalsData as equalsDataV1 } from "../v1/equalsData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const equalsData = /* @__PURE__ */ (() => ({
    ...equalsDataV1,
    cpuModel: (params) => makeArgSizesMinCost(params.get(69), params.get(68)),
    memModel: (params) => makeArgSizesConstCost(params.get(70))
}))()
