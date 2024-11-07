import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { trace as traceV1 } from "../v1/trace.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const trace = {
    ...traceV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(155)),
    memModel: (params) => makeArgSizesConstCost(params.get(156))
}
