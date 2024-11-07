import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { tailList as tailListV1 } from "../v1/tailList.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const tailList = {
    ...tailListV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(171)),
    memModel: (params) => makeArgSizesConstCost(params.get(172))
}
