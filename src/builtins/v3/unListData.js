import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { unListData as unListDataV1 } from "../v1/unListData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const unListData = {
    ...unListDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(181)),
    memModel: (params) => makeArgSizesConstCost(params.get(182))
}
