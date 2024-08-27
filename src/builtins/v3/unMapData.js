import { ArgSizesConstCost } from "../../costmodel/index.js"
import { unMapData as unMapDataV1 } from "../v1/unMapData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unMapData = {
    ...unMapDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(183)),
    memModel: (params) => new ArgSizesConstCost(params.get(184))
}
