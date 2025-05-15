import { makeUplcApply } from "./UplcApply.js"
import { makeUplcConst } from "./UplcConst.js"

/**
 * @import { UplcApply, UplcBuiltin, UplcConst, UplcDelay, UplcError, UplcForce, UplcLambda, UplcVar, UplcTerm, UplcValue, UplcConstr, UplcCase } from "../index.js"
 */

/**
 * @param {UplcTerm} expr
 * @param {UplcValue[]} args
 * @returns {UplcTerm}
 */
export function apply(expr, args) {
    for (let arg of args) {
        expr = makeUplcApply({ fn: expr, arg: makeUplcConst({ value: arg }) })
    }

    return expr
}

/**
 * @param {UplcTerm} root
 * @param {{
 *   anyTerm?: (term: UplcTerm, index: number) => void
 *   builtinTerm?: (term: UplcBuiltin, index: number) => void
 *   applyTerm?: (term: UplcApply, index: number) => void
 *   caseTerm?: (term: UplcCase, index: number) => void
 *   constTerm?: (term: UplcConst, index: number) => void
 *   constrTerm?: (term: UplcConstr, index: number) => void
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
        // in <=v0.7.* of this library, `UplcApply` was called `UplcCall` instead, and its `kind` was `"call"` instead of `"apply"`
        // here we convert "call" terms into "apply" terms before continuing
        if (/** @type {any} */ (term.kind) == "call") {
            // map the call term to apply, and call

            term = makeUplcApply({
                fn: /** @type {any} */ (term).fn,
                arg: /** @type {any} */ (term).arg,
                site: /** @type {any} */ (term).site
            })
        }

        if (callbacks.anyTerm) {
            callbacks.anyTerm(term, index)
        }

        switch (term.kind) {
            case "apply":
                if (callbacks.applyTerm) {
                    callbacks.applyTerm(term, index)
                }
                break
            case "builtin":
                if (callbacks.builtinTerm) {
                    callbacks.builtinTerm(term, index)
                }
                break
            case "case":
                if (callbacks.caseTerm) {
                    callbacks.caseTerm(term, index)
                }
                break
            case "const":
                if (callbacks.constTerm) {
                    callbacks.constTerm(term, index)
                }
                break
            case "constr":
                if (callbacks.constrTerm) {
                    callbacks.constrTerm(term, index)
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
