import { ArgSizesConstCost } from "../../costmodel/index.js"
import { iData as iDataV1 } from "../v1/iData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const iData = {
    ...iDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(82)),
    memModel: (params) => new ArgSizesConstCost(params.get(83))
}
