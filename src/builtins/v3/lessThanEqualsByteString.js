import {
    makeArgSizesConstCost,
    makeArgSizesMinCost
} from "../../costmodel/index.js"
import { lessThanEqualsByteString as lessThanEqualsByteStringV1 } from "../v1/lessThanEqualsByteString.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const lessThanEqualsByteString = {
    ...lessThanEqualsByteStringV1,
    cpuModel: (params) => makeArgSizesMinCost(params.get(94), params.get(93)),
    memModel: (params) => makeArgSizesConstCost(params.get(95))
}
