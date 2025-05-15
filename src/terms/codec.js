import { expectDefined } from "@helios-lang/type-utils"
import { UPLC_BUILTIN_TAG, decodeUplcBuiltinFromFlat } from "./UplcBuiltin.js"
import { UPLC_APPLY_TAG, makeUplcApply } from "./UplcApply.js"
import { UPLC_CASE_TAG, makeUplcCase } from "./UplcCase.js"
import { UPLC_CONST_TAG, decodeUplcConstFromFlat } from "./UplcConst.js"
import { UPLC_CONSTR_TAG, makeUplcConstr } from "./UplcConstr.js"
import { UPLC_DELAY_TAG, makeUplcDelay } from "./UplcDelay.js"
import { UPLC_ERROR_TAG, makeUplcError } from "./UplcError.js"
import { UPLC_FORCE_TAG, makeUplcForce } from "./UplcForce.js"
import { UPLC_LAMBDA_TAG, makeUplcLambda } from "./UplcLambda.js"
import { UPLC_VAR_TAG, decodeUplcVarFromFlat } from "./UplcVar.js"

/**
 * @import { Builtin, FlatReader, FlatWriter, UplcTerm, UplcValue } from "../index.js"
 */

/**
 * Reads a single UplcTerm using a stack-based algorithm
 * @param {FlatReader} r
 * @param {Builtin[]} builtins
 * @returns {UplcTerm}
 */
/**
 * Reads a single UplcTerm
 * TODO: this leads to stack overflows, use a stack-based approach instead
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
     *   kind: "casearg"
     * } | {
     *   kind: "apply"
     *   fn: UplcTerm
     * } | {
     *   kind: "constr"
     *   tag: bigint
     *   args: UplcTerm[]
     * } | {
     *   kind: "case"
     *   arg: UplcTerm
     *   cases: UplcTerm[]
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
                case UPLC_APPLY_TAG:
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
                case UPLC_CONSTR_TAG:
                    collect.push({ kind: "constr", tag: r.readInt(), args: [] })
                    break
                case UPLC_CASE_TAG:
                    collect.push({ kind: "casearg" })
                    break
                default:
                    throw new Error("term tag " + tag.toString() + " unhandled")
            }
        } else {
            const c = expectDefined(collect.pop())

            switch (c.kind) {
                case "apply":
                    term = makeUplcApply({ fn: c.fn, arg: term })
                    break
                case "case":
                    {
                        const cases = c.cases.concat([term])
                        const nilOrCons = r.readBits(1)
                        if (nilOrCons == 0) {
                            term = makeUplcCase(c.arg, cases)
                        } else {
                            collect.push({ ...c, cases })
                            term = undefined
                        }
                    }
                    break
                case "casearg":
                    collect.push({ kind: "case", arg: term, cases: [] })
                    term = undefined
                    break
                case "applyfn":
                    collect.push({ kind: "apply", fn: term })
                    term = undefined
                    break
                case "constr":
                    {
                        const args = c.args.concat([term])
                        const nilOrCons = r.readBits(1)
                        if (nilOrCons == 0) {
                            term = makeUplcConstr(c.tag, args)
                        } else {
                            collect.push({ ...c, args })
                            term = undefined
                        }
                    }
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

/**
 * Non-recursive algorithm
 * @param {UplcTerm} term
 * @param {FlatWriter} w
 */
export function encodeTerm(term, w) {
    const terms = [term]

    let t = terms.pop()

    while (t) {
        switch (t.kind) {
            case "builtin":
                t.toFlat(w)
                break
            case "apply":
                w.writeTermTag(UPLC_APPLY_TAG)
                terms.push(t.arg)
                terms.push(t.fn)
                break
            case "const":
                t.toFlat(w)
                break
            case "delay":
                w.writeTermTag(UPLC_DELAY_TAG)
                terms.push(t.arg)
                break
            case "error":
                t.toFlat(w)
                break
            case "force":
                w.writeTermTag(UPLC_FORCE_TAG)
                terms.push(t.arg)
                break
            case "lambda":
                w.writeTermTag(UPLC_LAMBDA_TAG)
                terms.push(t.expr)
                break
            case "var":
                t.toFlat(w)
                break
        }

        t = terms.pop()
    }
}
