import { ArgSizesConstCost } from "../../costmodel/index.js"
import { unBData as unBDataV1 } from "../v1/unBData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unBData = {
    ...unBDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(175)),
    memModel: (params) => new ArgSizesConstCost(params.get(176))
}
