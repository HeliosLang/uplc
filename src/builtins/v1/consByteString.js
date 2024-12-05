import {
    makeArgSizesSecondCost,
    makeArgSizesSumCost
} from "../../costmodel/index.js"
import { makeUplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const consByteString = {
    name: "consByteString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        makeArgSizesSecondCost(params.get(40), params.get(39)),
    memModel: (params) => makeArgSizesSumCost(params.get(42), params.get(41)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected an integer for the first argument of consByteString, got ${a?.toString()}`
            )
        }

        if (b?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the second argument of consByteString, got ${b?.toString()}`
            )
        }

        return asCekValue(
            makeUplcByteArray([Number(a.value % 256n)].concat(b.bytes))
        )
    }
}
