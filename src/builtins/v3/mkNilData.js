import { ArgSizesConstCost } from "../../costmodel/index.js"
import { mkNilData as mkNilDataV1 } from "../v1/mkNilData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const mkNilData = {
    ...mkNilDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(108)),
    memModel: (params) => new ArgSizesConstCost(params.get(109))
}
