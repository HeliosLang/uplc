import { UPLC_BUILTIN_TAG, decodeUplcBuiltinFromFlat } from "./UplcBuiltin.js"
import { UPLC_APPLY_TAG, decodeUplcApplyFromFlat } from "./UplcApply.js"
import { decodeUplcCaseFromFlat, UPLC_CASE_TAG } from "./UplcCase.js"
import { UPLC_CONST_TAG, decodeUplcConstFromFlat } from "./UplcConst.js"
import { decodeUplcConstrFromFlat, UPLC_CONSTR_TAG } from "./UplcConstr.js"
import { UPLC_DELAY_TAG, decodeUplcDelayFromFlat } from "./UplcDelay.js"
import { UPLC_ERROR_TAG, makeUplcError } from "./UplcError.js"
import { UPLC_FORCE_TAG, decodeUplcForceFromFlat } from "./UplcForce.js"
import { UPLC_LAMBDA_TAG, decodeUplcLambdaFromFlat } from "./UplcLambda.js"
import { UPLC_VAR_TAG, decodeUplcVarFromFlat } from "./UplcVar.js"

/**
 * @import { Builtin, FlatReader, UplcTerm, UplcValue } from "../index.js"
 */

/**
 * Reads a single UplcTerm
 * @param {FlatReader} r
 * @param {Builtin[]} builtins
 * @returns {UplcTerm}
 */
export function decodeTerm(r, builtins) {
    const tag = r.readTag()

    switch (tag) {
        case UPLC_VAR_TAG:
            return decodeUplcVarFromFlat(r)
        case UPLC_DELAY_TAG:
            return decodeUplcDelayFromFlat(r)
        case UPLC_LAMBDA_TAG:
            return decodeUplcLambdaFromFlat(r)
        case UPLC_APPLY_TAG:
            return decodeUplcApplyFromFlat(r) // aka function application
        case UPLC_CONST_TAG:
            return decodeUplcConstFromFlat(r)
        case UPLC_FORCE_TAG:
            return decodeUplcForceFromFlat(r)
        case UPLC_ERROR_TAG:
            return makeUplcError()
        case UPLC_BUILTIN_TAG:
            return decodeUplcBuiltinFromFlat(r, builtins)
        case UPLC_CONSTR_TAG:
            return decodeUplcConstrFromFlat(r)
        case UPLC_CASE_TAG:
            return decodeUplcCaseFromFlat(r)
        default:
            throw new Error("term tag " + tag.toString() + " unhandled")
    }
}
