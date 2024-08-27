import { ArgSizesConstCost } from "../../costmodel/index.js"
import { unIData as unIDataV1 } from "../v1/unIData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unIData = {
    ...unIDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(179)),
    memModel: (params) => new ArgSizesConstCost(params.get(180))
}
