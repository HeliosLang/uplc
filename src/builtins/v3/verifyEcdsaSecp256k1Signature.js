import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { verifyEcdsaSecp256k1Signature as verifyEcdsaSecp256k1SignatureV2 } from "../v2/verifyEcdsaSecp256k1Signature.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const verifyEcdsaSecp256k1Signature = {
    ...verifyEcdsaSecp256k1SignatureV2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(185)),
    memModel: (params) => makeArgSizesConstCost(params.get(186))
}
