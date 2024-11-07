import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { indexByteString as indexByteStringV1 } from "../v1/indexByteString.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const indexByteString = {
    ...indexByteStringV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(86)),
    memModel: (params) => makeArgSizesConstCost(params.get(87))
}
