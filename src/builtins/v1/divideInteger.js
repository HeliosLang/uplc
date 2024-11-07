import {
    makeArgSizesProdCost,
    makeArgSizesDiffCost
} from "../../costmodel/index.js"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin, BuiltinContext, CekValue } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const divideInteger = {
    name: "divideInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        makeArgSizesProdCost(params.get(51), params.get(50), params.get(49)),
    memModel: (params) =>
        makeArgSizesDiffCost(params.get(54), params.get(52), params.get(53)),
    call: evalDivideInteger
}

/**
 *
 * @param {CekValue[]} args
 * @param {BuiltinContext} _ctx
 * @returns {CekValue}
 */
export function evalDivideInteger(args, _ctx) {
    const [a, b] = asUplcValues(args)

    if (a?.kind != "int") {
        throw new Error(
            `expected an integer for the first argument of divideInteger, got ${a?.toString()}`
        )
    }

    if (b?.kind != "int") {
        throw new Error(
            `expected an integer for the second argument of divideInteger, got ${b?.toString()}`
        )
    }

    if (b.value === 0n) {
        throw new Error(`division by 0`)
    }

    const x = a.value
    const y = b.value

    return asCekValue(
        makeUplcInt(x / y - (x % y != 0n && x < 0n != y < 0n ? 1n : 0n))
    )
}
