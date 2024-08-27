import { ArgSizesConstCost, ArgSizesThirdCost } from "../../costmodel/index.js"
import { verifyEd25519Signature as verifyEd25519SignatureV1 } from "../v1/verifyEd25519Signature.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const verifyEd25519Signature = {
    ...verifyEd25519SignatureV1,
    cpuModel: (params) =>
        new ArgSizesThirdCost(params.get(170), params.get(169)),
    memModel: (params) => new ArgSizesConstCost(params.get(171))
}
