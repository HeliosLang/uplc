import {
    makeArgSizesConstCost,
    makeArgSizesFirstCost
} from "../../costmodel/index.js"
import { sha2_256 as sha2_256V1 } from "../v1/sha2_256.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const sha2_256 = {
    ...sha2_256V1,
    cpuModel: (params) =>
        makeArgSizesFirstCost(params.get(138), params.get(137)),
    memModel: (params) => makeArgSizesConstCost(params.get(139))
}
