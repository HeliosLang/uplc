import { SchnorrSecp256k1 } from "@helios-lang/crypto"
import { ArgSizesConstCost, ArgSizesThirdCost } from "../costmodel/index.js"
import { UplcBool, UplcByteArray } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const verifySchnorrSecp256k1Signature = {
    name: "verifySchnorrSecp256k1Signature",
    forceCount: 0,
    nArgs: 3,
    CpuModel: ArgSizesThirdCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const [publicKey, message, signature] = asUplcValues(args)

        if (!(publicKey instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the first argument of verifySchnorrSecp256k1Signature, got ${publicKey?.toString()}`
            )
        }

        if (!(message instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the second argument of verifySchnorrSecp256k1Signature, got ${message?.toString()}`
            )
        }

        if (!(signature instanceof UplcByteArray)) {
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

        return asCekValue(new UplcBool(b))
    }
}
