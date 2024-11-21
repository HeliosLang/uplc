import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 * @__PURE__
 */
export const indexByteString = {
    name: "indexByteString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(81)),
    memModel: (params) => makeArgSizesConstCost(params.get(82)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of indexByteString, got ${a?.toString()}`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected an integer for the second argument of indexByteString, got ${b?.toString()}`
            )
        }

        const bytes = a.bytes
        const i = Number(b.value)

        if (i < 0 || i >= bytes.length) {
            throw new Error("index out of range")
        }

        return asCekValue(makeUplcInt(BigInt(bytes[i])))
    }
}
