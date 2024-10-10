import { ArgSizesConstCost } from "../../costmodel/index.js"
import { trace as traceV1 } from "../v1/trace.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const trace = {
    ...traceV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(155)),
    memModel: (params) => new ArgSizesConstCost(params.get(156))
}
