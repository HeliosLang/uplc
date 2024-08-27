import { ArgSizesConstCost, ArgSizesMinCost } from "../../costmodel/index.js"
import { equalsData as equalsDataV1 } from "../v1/equalsData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const equalsData = {
    ...equalsDataV1,
    cpuModel: (params) => new ArgSizesMinCost(params.get(69), params.get(68)),
    memModel: (params) => new ArgSizesConstCost(params.get(70))
}
