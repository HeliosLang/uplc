import { ArgSizesConstCost, ArgSizesDiagCost } from "../../costmodel/index.js"
import { equalsString as equalsStringV1 } from "../v1/equalsString.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const equalsString = {
    ...equalsStringV1,
    cpuModel: (params) =>
        new ArgSizesDiagCost(params.get(76), params.get(75), params.get(74)),
    memModel: (params) => new ArgSizesConstCost(params.get(77))
}
