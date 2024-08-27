import { ArgSizesConstCost } from "../../costmodel/index.js"
import { indexByteString as indexByteStringV1 } from "../v1/indexByteString.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const indexByteString = {
    ...indexByteStringV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(86)),
    memModel: (params) => new ArgSizesConstCost(params.get(87))
}
