import { ArgSizesConstCost } from "../../costmodel/index.js"
import { mkPairData as mkPairDataV1 } from "../v1/mkPairData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const mkPairData = {
    ...mkPairDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(112)),
    memModel: (params) => new ArgSizesConstCost(params.get(113))
}
