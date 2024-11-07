import {
    makeArgSizesConstCost,
    makeArgSizesThirdCost
} from "../../costmodel/index.js"
import { verifySchnorrSecp256k1Signature as verifySchnorrSecp256k1SignatureV2 } from "../v2/verifySchnorrSecp256k1Signature.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const verifySchnorrSecp256k1Signature = {
    ...verifySchnorrSecp256k1SignatureV2,
    cpuModel: (params) =>
        makeArgSizesThirdCost(params.get(191), params.get(190)),
    memModel: (params) => makeArgSizesConstCost(params.get(192))
}
