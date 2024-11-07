import { makeUplcCall } from "./UplcCall.js"
import { makeUplcConst } from "./UplcConst.js"

/**
 * @import { UplcBuiltin, UplcCall, UplcConst, UplcDelay, UplcError, UplcForce, UplcLambda, UplcVar, UplcTerm, UplcValue } from "src/index.js"
 */

/**
 * @param {UplcTerm} expr
 * @param {UplcValue[]} args
 * @returns {UplcTerm}
 */
export function apply(expr, args) {
    for (let arg of args) {
        expr = makeUplcCall({ fn: expr, arg: makeUplcConst({ value: arg }) })
    }

    return expr
}

/**
 * @param {UplcTerm} root
 * @param {{
 *   anyTerm?: (term: UplcTerm, index: number) => void
 *   builtinTerm?: (term: UplcBuiltin, index: number) => void
 *   callTerm?: (term: UplcCall, index: number) => void
 *   constTerm?: (term: UplcConst, index: number) => void
 *   delayTerm?: (term: UplcDelay, index: number) => void
 *   errorTerm?: (term: UplcError, index: number) => void
 *   forceTerm?: (term: UplcForce, index: number) => void
 *   lambdaTerm?: (term: UplcLambda, index: number) => void
 *   varTerm?: (term: UplcVar, index: number) => void
 * }} callbacks
 */
export function traverse(root, callbacks) {
    let terms = [root]

    let term = terms.pop()

    // root term index 0
    // the first child, if it exists, of root has index 1
    // the first grand-child, if it exists of root has index 2
    let index = 0

    while (term) {
        if (callbacks.anyTerm) {
            callbacks.anyTerm(term, index)
        }

        switch (term.kind) {
            case "builtin":
                if (callbacks.builtinTerm) {
                    callbacks.builtinTerm(term, index)
                }
                break
            case "call":
                if (callbacks.callTerm) {
                    callbacks.callTerm(term, index)
                }
                break
            case "const":
                if (callbacks.constTerm) {
                    callbacks.constTerm(term, index)
                }
                break
            case "delay":
                if (callbacks.delayTerm) {
                    callbacks.delayTerm(term, index)
                }
                break
            case "error":
                if (callbacks.errorTerm) {
                    callbacks.errorTerm(term, index)
                }
                break
            case "force":
                if (callbacks.forceTerm) {
                    callbacks.forceTerm(term, index)
                }
                break
            case "lambda":
                if (callbacks.lambdaTerm) {
                    callbacks.lambdaTerm(term, index)
                }
                break
            case "var":
                if (callbacks.varTerm) {
                    callbacks.varTerm(term, index)
                }
                break
            default:
                throw new Error(
                    `unexpected UplcTerm kind "${/** @type {any} */ (term).kind}"`
                )
        }

        // add the children
        terms = terms.concat(term.children.slice().reverse())

        term = terms.pop()

        index++
    }
}
