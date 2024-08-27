import { ArgSizesConstCost, ArgSizesFirstCost } from "../../costmodel/index.js"
import { sha3_256 as sha3_256V1 } from "../v1/sha3_256.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const sha3_256 = {
    ...sha3_256V1,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(141), params.get(140)),
    memModel: (params) => new ArgSizesConstCost(params.get(142))
}
