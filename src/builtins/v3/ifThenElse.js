import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { ifThenElse as ifThenElseV1 } from "../v1/ifThenElse.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const ifThenElse = {
    ...ifThenElseV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(84)),
    memModel: (params) => makeArgSizesConstCost(params.get(85))
}
