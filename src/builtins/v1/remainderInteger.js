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
export const remainderInteger = {
    name: "remainderInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        makeArgSizesProdBelowDiagCost(
            params.get(129),
            params.get(128),
            params.get(127)
        ),
    memModel: (params) =>
        makeArgSizesDiffCost(params.get(132), params.get(130), params.get(131)),
    call: evalRemainderInteger
}

/**
 * @param {CekValue[]} args
 * @param {BuiltinContext} _ctx
 * @returns {CekValue}
 */
export function evalRemainderInteger(args, _ctx) {
    const [a, b] = asUplcValues(args)

    if (a?.kind != "int") {
        throw new Error(
            `expected an integer for the first argument of remainederInteger, got ${a?.toString()}`
        )
    }

    if (b?.kind != "int") {
        throw new Error(
            `expected an integer for the second argument of remainederInteger, got ${b?.toString()}`
        )
    }

    if (b.value === 0n) {
        throw new Error(`division by 0 in remainederInteger`)
    }

    return asCekValue(
        makeUplcInt(
            a.value % b.value
            //a.value -
            //  (a.value / b.value + (b.value < 0n ? 1n : 0n)) * b.value
        )
    )
}
