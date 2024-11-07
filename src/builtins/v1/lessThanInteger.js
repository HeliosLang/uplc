import {
    makeArgSizesConstCost,
    makeArgSizesMinCost
} from "../../costmodel/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const lessThanInteger = {
    name: "lessThanInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesMinCost(params.get(95), params.get(94)),
    memModel: (params) => makeArgSizesConstCost(params.get(96)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected an integer for the first argument of lessThanInteger, got ${a?.toString()}`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected an integer for the second argument of lessThanInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(makeUplcBool(a.value < b.value))
    }
}
