import {
    makeArgSizesConstCost,
    makeArgSizesFirstCost
} from "../../costmodel/index.js"
import { sha3_256 as sha3_256V1 } from "../v1/sha3_256.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const sha3_256 = /* @__PURE__ */ (() => ({
    ...sha3_256V1,
    cpuModel: (params) =>
        makeArgSizesFirstCost(params.get(159), params.get(158)),
    memModel: (params) => makeArgSizesConstCost(params.get(160))
}))()
