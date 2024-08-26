import { ArgSizesConstCost } from "../costmodel/index.js"
import { UplcByteArray, UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const indexByteString = {
    name: "indexByteString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(86)),
    memModel: (params) => new ArgSizesConstCost(params.get(87)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the first argument of indexByteString, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the second argument of indexByteString, got ${b?.toString()}`
            )
        }

        const bytes = a.bytes
        const i = Number(b.value)

        if (i < 0 || i >= bytes.length) {
            throw new Error("index out of range")
        }

        return asCekValue(new UplcInt(BigInt(bytes[i])))
    }
}
