import {
    encodeIntBE,
    encodeIntLE32,
    padBytes,
    prepadBytes
} from "@helios-lang/codec-utils"
import {
    ArgSizesLiteralYOrLinearZCost,
    ArgSizesQuadZCost
} from "../../costmodel/index.js"
import { UplcBool, UplcByteArray, UplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const integerToByteString = {
    name: "integerToByteString",
    forceCount: 0,
    nArgs: 3,
    cpuModel: (params) =>
        new ArgSizesQuadZCost({
            c0: params.get(241),
            c1: params.get(242),
            c2: params.get(243)
        }),
    memModel: (params) =>
        new ArgSizesLiteralYOrLinearZCost(params.get(245), params.get(244)),
    call: (args, ctx) => {
        const [a, b, c] = asUplcValues(args)

        if (a?.kind != "bool") {
            throw new Error(
                `expected UplcBool for first arg of integerToByteString`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected UplcInt for second arg of integerToByteString`
            )
        }

        if (c?.kind != "int") {
            throw new Error(
                `expected UplcInt for third arg of integerToByteString`
            )
        }

        const w = Number(b.value)

        if (w < 0 || w >= 8192) {
            throw new Error(
                `second arg of integerToByteString out of range, expected w >= 0 && w < 8192 `
            )
        }

        if (c.value < 0) {
            throw new Error(
                `third arg of integerToByteString is negative (got ${c.value})`
            )
        }

        let bytes = encodeIntBE(c.value)

        encodeIntLE32
        if (a.value) {
            // big endian
            if (w != 0 && bytes.length != w) {
                if (bytes.length > w) {
                    throw new Error(
                        `result of integerToByteString doesn't fit in ${w} bytes (need at least ${bytes.length} bytes)`
                    )
                } else {
                    bytes = prepadBytes(bytes, w)
                }
            }
        } else {
            // little endian
            bytes.reverse()

            if (w != 0 && bytes.length != w) {
                if (bytes.length > w) {
                    throw new Error(
                        `result of integerToByteString doesn't fit in ${w} bytes (need at least ${bytes.length} bytes)`
                    )
                } else {
                    bytes = padBytes(bytes, w)
                }
            }
        }

        return asCekValue(new UplcByteArray(bytes))
    }
}
