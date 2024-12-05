import { makeArgSizesSumCost } from "../../costmodel/index.js"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const multiplyInteger = {
    name: "multiplyInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesSumCost(params.get(116), params.get(115)),
    memModel: (params) => makeArgSizesSumCost(params.get(118), params.get(117)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected an integer for the first argument of multiplyInteger, got ${a?.toString()}`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected an integer for the second argument of multiplyInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(makeUplcInt(a.value * b.value))
    }
}
