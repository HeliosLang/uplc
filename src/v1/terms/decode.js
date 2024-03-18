import { FlatReader } from "../../flat/index.js"
import { UPLC_BUILTIN_TAG, UplcBuiltin } from "./UplcBuiltin.js"
import { UPLC_CALL_TAG, UplcCall } from "./UplcCall.js"
import { UPLC_CONST_TAG, UplcConst } from "./UplcConst.js"
import { UPLC_DELAY_TAG, UplcDelay } from "./UplcDelay.js"
import { UplcError, UPLC_ERROR_TAG } from "./UplcError.js"
import { UPLC_FORCE_TAG, UplcForce } from "./UplcForce.js"
import { UPLC_LAMBDA_TAG, UplcLambda } from "./UplcLambda.js"
import { UPLC_VAR_TAG, UplcVar } from "./UplcVar.js"

/**
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

/**
 * Reads a single UplcTerm
 * @template {UplcTerm} TExpr
 * @param {FlatReader<TExpr>} r
 * @returns {UplcTerm}
 */
export function decodeTerm(r) {
    const tag = r.readBits(4)

    switch (tag) {
        case UPLC_VAR_TAG:
            return UplcVar.fromFlat(r)
        case UPLC_DELAY_TAG:
            return UplcDelay.fromFlat(r)
        case UPLC_LAMBDA_TAG:
            return UplcLambda.fromFlat(r)
        case UPLC_CALL_TAG:
            return UplcCall.fromFlat(r) // aka function application
        case UPLC_CONST_TAG:
            return UplcConst.fromFlat(r)
        case UPLC_FORCE_TAG:
            return UplcForce.fromFlat(r)
        case UPLC_ERROR_TAG:
            return new UplcError()
        case UPLC_BUILTIN_TAG:
            return UplcBuiltin.fromFlat(r)
        default:
            throw new Error("term tag " + tag.toString() + " unhandled")
    }
}
