import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { mkNilPairData as mkNilPairDataV1 } from "../v1/mkNilPairData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const mkNilPairData = /* @__PURE__ */ (() => ({
    ...mkNilPairDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(110)),
    memModel: (params) => makeArgSizesConstCost(params.get(111))
}))()
