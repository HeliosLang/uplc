import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { mkNilData as mkNilDataV1 } from "../v1/mkNilData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const mkNilData = {
    ...mkNilDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(108)),
    memModel: (params) => makeArgSizesConstCost(params.get(109))
}
