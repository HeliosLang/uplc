import {
    makeArgSizesConstCost,
    makeArgSizesMinCost
} from "../../costmodel/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const equalsData = {
    name: "equalsData",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesMinCost(params.get(64), params.get(63)),
    memModel: (params) => makeArgSizesConstCost(params.get(65)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "data") {
            throw new Error(
                `expected an data as first argument of equalsData, got ${a?.toString()}`
            )
        }

        if (b?.kind != "data") {
            throw new Error(
                `expected an data as second argument of equalsData, got ${b?.toString()}`
            )
        }

        return asCekValue(makeUplcBool(a.value.isEqual(b.value)))
    }
}
