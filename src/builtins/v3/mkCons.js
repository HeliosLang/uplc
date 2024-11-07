import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { mkCons as mkConsV1 } from "../v1/mkCons.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * Prepends an item
 * @type {Builtin}
 */
export const mkCons = {
    ...mkConsV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(106)),
    memModel: (params) => makeArgSizesConstCost(params.get(107))
}
