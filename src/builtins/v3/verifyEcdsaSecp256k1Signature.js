import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { verifyEcdsaSecp256k1Signature as verifyEcdsaSecp256k1SignatureV2 } from "../v2/verifyEcdsaSecp256k1Signature.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const verifyEcdsaSecp256k1Signature = /* @__PURE__ */ (() => ({
    ...verifyEcdsaSecp256k1SignatureV2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(185)),
    memModel: (params) => makeArgSizesConstCost(params.get(186))
}))()
