import { ArgSizesConstCost } from "../../costmodel/index.js"
import { UplcString } from "../../values/UplcString.js"
import { asUplcValue } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const trace = {
    name: "trace",
    forceCount: 1,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(151)),
    memModel: (params) => new ArgSizesConstCost(params.get(152)),
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
