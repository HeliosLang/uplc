import { ArgSizesConstCost } from "../../costmodel/index.js"
import { verifyEcdsaSecp256k1Signature as verifyEcdsaSecp256k1SignatureV2 } from "../v2/verifyEcdsaSecp256k1Signature.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const verifyEcdsaSecp256k1Signature = {
    ...verifyEcdsaSecp256k1SignatureV2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(185)),
    memModel: (params) => new ArgSizesConstCost(params.get(186))
}
