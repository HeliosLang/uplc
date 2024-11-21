import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { mkPairData as mkPairDataV1 } from "../v1/mkPairData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const mkPairData = {
    ...mkPairDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(112)),
    memModel: (params) => makeArgSizesConstCost(params.get(113))
}
