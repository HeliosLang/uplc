import { ArgSizesProdCost, ArgSizesDiffCost } from "../../costmodel/index.js"
import { UplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../../cek/CekValue.js").CekValue} CekValue
 * @typedef {import("../Builtin.js").Builtin} Builtin
 * @typedef {import("../BuiltinContext.js").BuiltinContext} BuiltinContext
 */

/**
 * @type {Builtin}
 */
export const quotientInteger = {
    name: "quotientInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesProdCost(params.get(123), params.get(122), params.get(121)),
    memModel: (params) =>
        new ArgSizesDiffCost(params.get(126), params.get(124), params.get(125)),
    call: evalQuotientInteger
}

/**
 * @param {CekValue[]} args
 * @param {BuiltinContext} ctx
 * @returns {CekValue}
 */
export function evalQuotientInteger(args, ctx) {
    const [a, b] = asUplcValues(args)

    if (a?.kind != "int") {
        throw new Error(
            `expected an integer for the first argument of quotientInteger, got ${a?.toString()}`
        )
    }

    if (b?.kind != "int") {
        throw new Error(
            `expected an integer for the second argument of quotientInteger, got ${b?.toString()}`
        )
    }

    if (b.value === 0n) {
        throw new Error(`division by 0 in quotientInteger`)
    }

    return asCekValue(new UplcInt(a.value / b.value))
}
