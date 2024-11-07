import { makeArgSizesMaxCost } from "../../costmodel/index.js"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const subtractInteger = {
    name: "subtractInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesMaxCost(params.get(146), params.get(145)),
    memModel: (params) => makeArgSizesMaxCost(params.get(148), params.get(147)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected integer for first arg of subtractInteger, got ${a?.toString()}`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected integer for second arg of subtractInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(makeUplcInt(a.value - b.value))
    }
}
