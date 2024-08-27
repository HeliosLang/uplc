import { ArgSizesConstCost } from "../../costmodel/index.js"
import { nullList as nullListV1 } from "../v1/nullList.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const nullList = {
    ...nullListV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(128)),
    memModel: (params) => new ArgSizesConstCost(params.get(129))
}
