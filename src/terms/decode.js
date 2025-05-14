import { expectDefined } from "@helios-lang/type-utils"
import { UPLC_BUILTIN_TAG, decodeUplcBuiltinFromFlat } from "./UplcBuiltin.js"
import { UPLC_CALL_TAG, makeUplcCall } from "./UplcCall.js"
import { UPLC_CONST_TAG, decodeUplcConstFromFlat } from "./UplcConst.js"
import { UPLC_DELAY_TAG, makeUplcDelay } from "./UplcDelay.js"
import { UPLC_ERROR_TAG, makeUplcError } from "./UplcError.js"
import { UPLC_FORCE_TAG, makeUplcForce } from "./UplcForce.js"
import { UPLC_LAMBDA_TAG, makeUplcLambda } from "./UplcLambda.js"
import { UPLC_VAR_TAG, decodeUplcVarFromFlat } from "./UplcVar.js"

/**
 * @import { Builtin, FlatReader, UplcTerm, UplcValue } from "../index.js"
 */

/**
 * Reads a single UplcTerm using a stack-based algorithm
 * @param {FlatReader} r
 * @param {Builtin[]} builtins
 * @returns {UplcTerm}
 */
export function decodeTerm(r, builtins) {
    /**
     * Undefined -> decoding
     * Defined -> collecting
     * @type {UplcTerm | undefined}
     */
    let term = undefined

    /**
     * @type {({
     *   kind: "delay"
     * } | {
     *   kind: "lambda"
     * } | {
     *   kind: "applyfn"
     * } | {
     *   kind: "force"
     * } | {
     *   kind: "apply"
     *   fn: UplcTerm
     * })[]}
     */
    const collect = []

    while (!term || collect.length > 0) {
        if (!term) {
            const tag = r.readTag()

            switch (tag) {
                case UPLC_VAR_TAG:
                    term = decodeUplcVarFromFlat(r)
                    break
                case UPLC_DELAY_TAG:
                    collect.push({ kind: "delay" })
                    break
                case UPLC_LAMBDA_TAG:
                    collect.push({ kind: "lambda" })
                    break
                case UPLC_CALL_TAG:
                    collect.push({ kind: "applyfn" })
                    break
                case UPLC_CONST_TAG:
                    term = decodeUplcConstFromFlat(r)
                    break
                case UPLC_FORCE_TAG:
                    collect.push({ kind: "force" })
                    break
                case UPLC_ERROR_TAG:
                    term = makeUplcError()
                    break
                case UPLC_BUILTIN_TAG:
                    term = decodeUplcBuiltinFromFlat(r, builtins)
                    break
                default:
                    throw new Error("term tag " + tag.toString() + " unhandled")
            }
        } else {
            const c = expectDefined(collect.pop())

            switch (c.kind) {
                case "apply":
                    term = makeUplcCall({ fn: c.fn, arg: term })
                    break
                case "applyfn":
                    collect.push({ kind: "apply", fn: term })
                    term = undefined
                    break
                case "delay":
                    term = makeUplcDelay({ arg: term })
                    break
                case "force":
                    term = makeUplcForce({ arg: term })
                    break
                case "lambda":
                    term = makeUplcLambda({ body: term })
                    break
            }
        }
    }

    return expectDefined(term, "term decoding failed")
}
