import { ArgSizesProdCost, ArgSizesDiffCost } from "../costmodel/index.js"
import { UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("../cek/types.js").CekValue} CekValue
 * @typedef {import("./Builtin.js").Builtin} Builtin
 * @typedef {import("./BuiltinContext.js").BuiltinContext} BuiltinContext
 */

/**
 * @type {Builtin}
 */
export const quotientInteger = {
    name: "quotientInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesProdCost(params.get(132), params.get(131), params.get(130)),
    memModel: (params) =>
        new ArgSizesDiffCost(params.get(140), params.get(138), params.get(139)),
    call: evalQuotientInteger
}

/**
 * @param {CekValue[]} args
 * @param {BuiltinContext} ctx
 * @returns {CekValue}
 */
export function evalQuotientInteger(args, ctx) {
    const [a, b] = asUplcValues(args)

    if (!(a instanceof UplcInt)) {
        throw new Error(
            `expected an integer for the first argument of quotientInteger, got ${a?.toString()}`
        )
    }

    if (!(b instanceof UplcInt)) {
        throw new Error(
            `expected an integer for the second argument of quotientInteger, got ${b?.toString()}`
        )
    }

    if (b.value === 0n) {
        throw new Error(`division by 0 in quotientInteger`)
    }

    return asCekValue(new UplcInt(a.value / b.value))
}
