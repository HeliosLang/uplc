import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { headList as headListV1 } from "../v1/headList.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const headList = {
    ...headListV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(80)),
    memModel: (params) => makeArgSizesConstCost(params.get(81))
}
