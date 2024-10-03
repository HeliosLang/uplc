import { UplcCall } from "./UplcCall.js"
import { UplcConst } from "./UplcConst.js"

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 * @typedef {import("./UplcTerm.js").UplcBuiltinI} UplcBuiltinI
 * @typedef {import("./UplcTerm.js").UplcCallI} UplcCallI
 * @typedef {import("./UplcTerm.js").UplcConstI} UplcConstI
 * @typedef {import("./UplcTerm.js").UplcDelayI} UplcDelayI
 * @typedef {import("./UplcTerm.js").UplcErrorI} UplcErrorI
 * @typedef {import("./UplcTerm.js").UplcForceI} UplcForceI
 * @typedef {import("./UplcTerm.js").UplcLambdaI} UplcLambdaI
 * @typedef {import("./UplcTerm.js").UplcVarI} UplcVarI
 */

/**
 * @param {UplcTerm} expr
 * @param {UplcValue[]} args
 * @returns {UplcTerm}
 */
export function apply(expr, args) {
    for (let arg of args) {
        expr = new UplcCall(expr, new UplcConst(arg))
    }

    return expr
}

/**
 * @param {UplcTerm} root
 * @param {{
 *   anyTerm?: (term: UplcTerm, index: number) => void
 *   builtinTerm?: (term: UplcBuiltinI, index: number) => void
 *   callTerm?: (term: UplcCallI, index: number) => void
 *   constTerm?: (term: UplcConstI, index: number) => void
 *   delayTerm?: (term: UplcDelayI, index: number) => void
 *   errorTerm?: (term: UplcErrorI, index: number) => void
 *   forceTerm?: (term: UplcForceI, index: number) => void
 *   lambdaTerm?: (term: UplcLambdaI, index: number) => void
 *   varTerm?: (term: UplcVarI, index: number) => void
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
