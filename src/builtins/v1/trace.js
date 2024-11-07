import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { asUplcValue } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const trace = {
    name: "trace",
    forceCount: 1,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(151)),
    memModel: (params) => makeArgSizesConstCost(params.get(152)),
    call: (args, ctx) => {
        const message = asUplcValue(args[0])

        if (message?.kind != "string") {
            throw new Error(
                `expected a string as first argument of trace, got ${message?.toString()}`
            )
        }

        ctx.print(message.value)

        return args[1]
    }
}
