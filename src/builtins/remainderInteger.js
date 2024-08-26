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
export const remainderInteger = {
    name: "remainderInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesProdCost(params.get(143), params.get(142), params.get(141)),
    memModel: (params) =>
        new ArgSizesDiffCost(params.get(150), params.get(148), params.get(149)),
    call: evalRemainderInteger
}

/**
 * @param {CekValue[]} args
 * @param {BuiltinContext} ctx
 * @returns {CekValue}
 */
export function evalRemainderInteger(args, ctx) {
    const [a, b] = asUplcValues(args)

    if (!(a instanceof UplcInt)) {
        throw new Error(
            `expected an integer for the first argument of remainederInteger, got ${a?.toString()}`
        )
    }

    if (!(b instanceof UplcInt)) {
        throw new Error(
            `expected an integer for the second argument of remainederInteger, got ${b?.toString()}`
        )
    }

    if (b.value === 0n) {
        throw new Error(`division by 0 in remainederInteger`)
    }

    return asCekValue(
        new UplcInt(
            a.value % b.value
            //a.value -
            //  (a.value / b.value + (b.value < 0n ? 1n : 0n)) * b.value
        )
    )
}
