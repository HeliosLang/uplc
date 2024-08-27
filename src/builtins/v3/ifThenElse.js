import { ArgSizesConstCost } from "../../costmodel/index.js"
import { ifThenElse as ifThenElseV1 } from "../v1/ifThenElse.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const ifThenElse = {
    ...ifThenElseV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(84)),
    memModel: (params) => new ArgSizesConstCost(params.get(85))
}
