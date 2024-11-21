import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { unMapData as unMapDataV1 } from "../v1/unMapData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const unMapData = {
    ...unMapDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(165)),
    memModel: (params) => makeArgSizesConstCost(params.get(166))
}
