import {
    makeArgSizesConstCost,
    makeArgSizesSecondCost
} from "../../costmodel/index.js"
import { verifyEd25519Signature as verifyEd25519SignatureV1 } from "../v1/verifyEd25519Signature.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const verifyEd25519Signature = /* @__PURE__ */ (() => ({
    ...verifyEd25519SignatureV1,
    cpuModel: (params) =>
        makeArgSizesSecondCost(params.get(170), params.get(169)),
    memModel: (params) => makeArgSizesConstCost(params.get(171))
}))()
