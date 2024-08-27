import { ArgSizesConstCost } from "../../costmodel/index.js"
import { tailList as tailListV1 } from "../v1/tailList.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const tailList = {
    ...tailListV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(153)),
    memModel: (params) => new ArgSizesConstCost(params.get(154))
}
