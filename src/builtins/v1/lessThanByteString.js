import {
    makeArgSizesConstCost,
    makeArgSizesMinCost
} from "../../costmodel/index.js"
import { compareByteArrayData } from "../../data/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const lessThanByteString = {
    name: "lessThanByteString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesMinCost(params.get(86), params.get(85)),
    memModel: (params) => makeArgSizesConstCost(params.get(87)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of lessThanByteString, got ${a?.toString()}`
            )
        }

        if (b?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the second argument of lessThanByteString, got ${b?.toString()}`
            )
        }

        return asCekValue(
            makeUplcBool(compareByteArrayData(a.bytes, b.bytes) == -1)
        )
    }
}
