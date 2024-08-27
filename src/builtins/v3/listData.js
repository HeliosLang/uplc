import { ArgSizesConstCost } from "../../costmodel/index.js"
import { listData as listDataV1 } from "../v1/listData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const listData = {
    ...listDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(102)),
    memModel: (params) => new ArgSizesConstCost(params.get(103))
}
