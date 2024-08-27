import { ArgSizesFirstCost } from "../../costmodel/index.js"
import { encodeUtf8 as encodeUtf8V1 } from "../v1/encodeUtf8.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const encodeUtf8 = {
    ...encodeUtf8V1,
    cpuModel: (params) => new ArgSizesFirstCost(params.get(61), params.get(60)),
    memModel: (params) => new ArgSizesFirstCost(params.get(63), params.get(62))
}
