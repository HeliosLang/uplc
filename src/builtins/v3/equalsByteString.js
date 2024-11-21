import {
    makeArgSizesConstCost,
    makeArgSizesDiagCost
} from "../../costmodel/index.js"
import { equalsByteString as equalsByteStringV1 } from "../v1/equalsByteString.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const equalsByteString = {
    ...equalsByteStringV1,
    cpuModel: (params) =>
        makeArgSizesDiagCost(params.get(66), params.get(65), params.get(64)),
    memModel: (params) => makeArgSizesConstCost(params.get(67))
}
