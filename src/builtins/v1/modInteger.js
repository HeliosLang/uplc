import {
    makeArgSizesProdBelowDiagCost,
    makeArgSizesDiffCost
} from "../../costmodel/index.js"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin, BuiltinContext, CekValue } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const modInteger = {
    name: "modInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        makeArgSizesProdBelowDiagCost(
            params.get(111),
            params.get(110),
            params.get(109)
        ),
    memModel: (params) =>
        makeArgSizesDiffCost(params.get(114), params.get(112), params.get(113)),
    call: evalModInteger
}

/**
 * @param {CekValue[]} args
 * @param {BuiltinContext} _ctx
 * @returns {CekValue}
 */
export function evalModInteger(args, _ctx) {
    const [a, b] = asUplcValues(args)

    if (a?.kind != "int") {
        throw new Error(
            `expected an integer for the first argument of modInteger, got ${a?.toString()}`
        )
    }

    if (b?.kind != "int") {
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

    return asCekValue(makeUplcInt(m))
}
