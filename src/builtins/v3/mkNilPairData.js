import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { mkNilPairData as mkNilPairDataV1 } from "../v1/mkNilPairData.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const mkNilPairData = {
    ...mkNilPairDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(110)),
    memModel: (params) => makeArgSizesConstCost(params.get(111))
}
