import { SchnorrSecp256k1 } from "@helios-lang/crypto"
import {
    makeArgSizesConstCost,
    makeArgSizesThirdCost
} from "../../costmodel/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const verifySchnorrSecp256k1Signature = {
    name: "verifySchnorrSecp256k1Signature",
    forceCount: 0,
    nArgs: 3,
    cpuModel: (params) =>
        makeArgSizesThirdCost(params.get(173), params.get(172)),
    memModel: (params) => makeArgSizesConstCost(params.get(174)),
    call: (args, _ctx) => {
        const [publicKey, message, signature] = asUplcValues(args)

        if (publicKey?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of verifySchnorrSecp256k1Signature, got ${publicKey?.toString()}`
            )
        }

        if (message?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the second argument of verifySchnorrSecp256k1Signature, got ${message?.toString()}`
            )
        }

        if (signature?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the third argument of verifySchnorrSecp256k1Signature, got ${signature?.toString()}`
            )
        }

        if (publicKey.bytes.length != 32) {
            throw new Error(
                `expected a publicKey length of 32 in verifySchnorrSecp256k1Signature, got a publicKey of length ${publicKey.bytes.length}`
            )
        }

        if (signature.bytes.length != 64) {
            throw new Error(
                `expected a signature length of 64 in verifySchnorrSecp256k1Signature, got a signature of length ${publicKey.bytes.length}`
            )
        }

        const b = SchnorrSecp256k1.verify(
            signature.bytes,
            message.bytes,
            publicKey.bytes
        )

        return asCekValue(makeUplcBool(b))
    }
}
