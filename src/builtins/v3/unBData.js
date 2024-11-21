import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { unBData as unBDataV1 } from "../v1/unBData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const unBData = {
    ...unBDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(175)),
    memModel: (params) => makeArgSizesConstCost(params.get(176))
}
