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
export const lessThanEqualsInteger = {
    name: "lessThanEqualsInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesMinCost(params.get(92), params.get(91)),
    memModel: (params) => makeArgSizesConstCost(params.get(93)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected an integer for the first argument of lessThanEqualsInteger, got ${a?.toString()}`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected an integer for the second argument of lessThanEqualsInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(makeUplcBool(a.value <= b.value))
    }
}
