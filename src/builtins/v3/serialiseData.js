import { makeArgSizesFirstCost } from "../../costmodel/index.js"
import { serialiseData as serialiseDataV2 } from "../v2/serialiseData.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const serialiseData = {
    ...serialiseDataV2,
    cpuModel: (params) =>
        makeArgSizesFirstCost(params.get(152), params.get(151)),
    memModel: (params) =>
        makeArgSizesFirstCost(params.get(154), params.get(153))
}
