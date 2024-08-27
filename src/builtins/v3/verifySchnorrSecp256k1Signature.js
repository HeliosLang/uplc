import { ArgSizesConstCost, ArgSizesThirdCost } from "../../costmodel/index.js"
import { verifySchnorrSecp256k1Signature as verifySchnorrSecp256k1SignatureV2 } from "../v2/verifySchnorrSecp256k1Signature.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const verifySchnorrSecp256k1Signature = {
    ...verifySchnorrSecp256k1SignatureV2,
    cpuModel: (params) =>
        new ArgSizesThirdCost(params.get(191), params.get(190)),
    memModel: (params) => new ArgSizesConstCost(params.get(192))
}
