import { ArgSizesConstCost } from "../../costmodel/index.js"
import { headList as headListV1 } from "../v1/headList.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const headList = {
    ...headListV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(80)),
    memModel: (params) => new ArgSizesConstCost(params.get(81))
}
