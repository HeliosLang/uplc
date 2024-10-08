import { UPLC_BUILTIN_TAG, UplcBuiltin } from "./UplcBuiltin.js"
import { UPLC_CALL_TAG, UplcCall } from "./UplcCall.js"
import { UPLC_CONST_TAG, UplcConst } from "./UplcConst.js"
import { UPLC_DELAY_TAG, UplcDelay } from "./UplcDelay.js"
import { UplcError, UPLC_ERROR_TAG } from "./UplcError.js"
import { UPLC_FORCE_TAG, UplcForce } from "./UplcForce.js"
import { UPLC_LAMBDA_TAG, UplcLambda } from "./UplcLambda.js"
import { UPLC_VAR_TAG, UplcVar } from "./UplcVar.js"

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("../flat/index.js").FlatReaderI<TExpr, TValue>} FlatReaderI
 */

/**
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * Reads a single UplcTerm
 * @template {UplcTerm} TExpr
 * @param {FlatReaderI<TExpr, UplcValue>} r
 * @param {Builtin[]} builtins
 * @returns {UplcTerm}
 */
export function decodeTerm(r, builtins) {
    const tag = r.readTag()

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
            return UplcBuiltin.fromFlat(r, builtins)
        default:
            throw new Error("term tag " + tag.toString() + " unhandled")
    }
}
