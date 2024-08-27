import { ArgSizesConstCost, ArgSizesDiagCost } from "../../costmodel/index.js"
import { equalsByteString as equalsByteStringV1 } from "../v1/equalsByteString.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const equalsByteString = {
    ...equalsByteStringV1,
    cpuModel: (params) =>
        new ArgSizesDiagCost(params.get(66), params.get(65), params.get(64)),
    memModel: (params) => new ArgSizesConstCost(params.get(67))
}
