import { ArgSizesConstCost } from "../../costmodel/index.js"
import { mkCons as mkConsV1 } from "../v1/mkCons.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * Prepends an item
 * @type {Builtin}
 */
export const mkCons = {
    ...mkConsV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(106)),
    memModel: (params) => new ArgSizesConstCost(params.get(107))
}
