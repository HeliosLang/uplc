import {
    makeArgSizesConstCost,
    makeArgSizesDiagCost
} from "../../costmodel/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const equalsString = {
    name: "equalsString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        makeArgSizesDiagCost(params.get(71), params.get(70), params.get(69)),
    memModel: (params) => makeArgSizesConstCost(params.get(72)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "string") {
            throw new Error(
                `expected a string for the first argument of equalsString, got ${a?.toString()}`
            )
        }

        if (b?.kind != "string") {
            throw new Error(
                `expected a string for the second argument of equalsString, got ${b?.toString()}`
            )
        }

        return asCekValue(makeUplcBool(a.value == b.value))
    }
}
