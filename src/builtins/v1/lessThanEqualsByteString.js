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
 * @__PURE__
 */
export const lessThanEqualsByteString = {
    name: "lessThanEqualsByteString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesMinCost(params.get(89), params.get(88)),
    memModel: (params) => makeArgSizesConstCost(params.get(90)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of lessThanEqualsByteString, got ${a?.toString()}`
            )
        }

        if (b?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the second argument of lessThanEqualsByteString, got ${b?.toString()}`
            )
        }

        return asCekValue(
            makeUplcBool(compareByteArrayData(a.bytes, b.bytes) <= 0)
        )
    }
}
