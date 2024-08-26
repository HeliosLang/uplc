import { ArgSizesDiffCost, ArgSizesQuadXYCost } from "../costmodel/index.js"
import { evalQuotientInteger } from "./quotientInteger.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const quotientIntegerV3 = {
    name: "quotientInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesQuadXYCost(params.get(130), params.get(137), {
            c00: params.get(131),
            c01: params.get(132),
            c02: params.get(133),
            c10: params.get(134),
            c11: params.get(135),
            c20: params.get(136)
        }),
    memModel: (params) =>
        new ArgSizesDiffCost(params.get(140), params.get(138), params.get(139)),
    call: evalQuotientInteger
}
