import { makeArgSizesFirstCost } from "../../costmodel/index.js"
import { encodeUtf8 as encodeUtf8V1 } from "../v1/encodeUtf8.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const encodeUtf8 = {
    ...encodeUtf8V1,
    cpuModel: (params) => makeArgSizesFirstCost(params.get(61), params.get(60)),
    memModel: (params) => makeArgSizesFirstCost(params.get(63), params.get(62))
}
