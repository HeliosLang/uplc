import { ArgSizesConstCost } from "../../costmodel/index.js"
import { unConstrData as unConstrDataV1 } from "../v1/unConstrData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unConstrData = {
    ...unConstrDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(159)),
    memModel: (params) => new ArgSizesConstCost(params.get(160))
}
