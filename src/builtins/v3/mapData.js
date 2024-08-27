import { ArgSizesConstCost } from "../../costmodel/index.js"
import { mapData as mapDataV1 } from "../v1/mapData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const mapData = {
    ...mapDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(104)),
    memModel: (params) => new ArgSizesConstCost(params.get(105))
}
