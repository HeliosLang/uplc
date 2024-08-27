import { ArgSizesFirstCost } from "../../costmodel/index.js"
import { serialiseData as serialiseDataV2 } from "../v2/serialiseData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const serialiseData = {
    ...serialiseDataV2,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(152), params.get(151)),
    memModel: (params) =>
        new ArgSizesFirstCost(params.get(154), params.get(153))
}
