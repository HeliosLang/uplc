import { ArgSizesConstCost } from "../../costmodel/index.js"
import { unListData as unListDataV1 } from "../v1/unListData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unListData = {
    ...unListDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(181)),
    memModel: (params) => new ArgSizesConstCost(params.get(182))
}
