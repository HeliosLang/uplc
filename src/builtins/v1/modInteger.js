import { ArgSizesProdCost, ArgSizesDiffCost } from "../../costmodel/index.js"
import { UplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../../cek/types.js").CekValue} CekValue
 * @typedef {import("../Builtin.js").Builtin} Builtin
 * @typedef {import("../BuiltinContext.js").BuiltinContext} BuiltinContext
 */

/**
 * @type {Builtin}
 */
export const modInteger = {
    name: "modInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesProdCost(params.get(111), params.get(110), params.get(109)),
    memModel: (params) =>
        new ArgSizesDiffCost(params.get(114), params.get(112), params.get(113)),
    call: evalModInteger
}

/**
 * @param {CekValue[]} args
 * @param {BuiltinContext} ctx
 * @returns {CekValue}
 */
export function evalModInteger(args, ctx) {
    const [a, b] = asUplcValues(args)

    if (!(a instanceof UplcInt)) {
        throw new Error(
            `expected an integer for the first argument of modInteger, got ${a?.toString()}`
        )
    }

    if (!(b instanceof UplcInt)) {
        throw new Error(
            `expected an integer for the second argument of modInteger, got ${b?.toString()}`
        )
    }

    if (b.value === 0n) {
        throw new Error(`division by 0 in modInteger`)
    }

    let m = a.value % b.value

    // the result must have the same sign as b
    if (b.value > 0 && m < 0) {
        m += b.value
    } else if (b.value < 0 && m > 0) {
        m += b.value
    }

    return asCekValue(new UplcInt(m))
}
