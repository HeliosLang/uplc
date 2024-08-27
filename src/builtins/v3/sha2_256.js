import { ArgSizesConstCost, ArgSizesFirstCost } from "../../costmodel/index.js"
import { sha2_256 as sha2_256V1 } from "../v1/sha2_256.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const sha2_256 = {
    ...sha2_256V1,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(156), params.get(155)),
    memModel: (params) => new ArgSizesConstCost(params.get(157))
}
