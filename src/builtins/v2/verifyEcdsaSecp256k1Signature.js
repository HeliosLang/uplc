import { ECDSASecp256k1 } from "@helios-lang/crypto"
import { ArgSizesConstCost } from "../../costmodel/index.js"
import { UplcBool, UplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const verifyEcdsaSecp256k1Signature = {
    name: "verifyEcdsaSecp256k1Signature",
    forceCount: 0,
    nArgs: 3,
    cpuModel: (params) => new ArgSizesConstCost(params.get(167)),
    memModel: (params) => new ArgSizesConstCost(params.get(168)),
    call: (args, ctx) => {
        const [publicKey, message, signature] = asUplcValues(args)

        if (publicKey?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of verifyEcdsaSecp256k1Signature, got ${publicKey?.toString()}`
            )
        }

        if (message?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the second argument of verifyEcdsaSecp256k1Signature, got ${message?.toString()}`
            )
        }

        if (signature?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the third argument of verifyEcdsaSecp256k1Signature, got ${signature?.toString()}`
            )
        }

        if (publicKey.bytes.length != 33) {
            throw new Error(
                `expected a publicKey length of 32 in verifyEcdsaSecp256k1Signature, got a publicKey of length ${publicKey.bytes.length}`
            )
        }

        if (message.bytes.length != 32) {
            throw new Error(
                `expected a message length of 32 in verifyEcdsaSecp256k1Signature, got a message of length ${message.bytes.length}`
            )
        }

        if (signature.bytes.length != 64) {
            throw new Error(
                `expected a signature length of 64 in verifyEcdsaSecp256k1Signature, got a signature of length ${publicKey.bytes.length}`
            )
        }

        const b = ECDSASecp256k1.verify(
            signature.bytes,
            message.bytes,
            publicKey.bytes
        )

        return asCekValue(new UplcBool(b))
    }
}
