import { None } from "@helios-lang/type-utils"
import { FlatReader, FlatWriter } from "../flat/index.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../cek/index.js").CekContext} CekContext
 * @typedef {import("../cek/index.js").CekStack} CekStack
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

export const UPLC_LAMBDA_TAG = 2

/**
 * Plutus-core lambda term, a function that takes a signle argument
 * @template {UplcTerm} [TExpr=UplcTerm]
 * @implements {UplcTerm}
 */
export class UplcLambda {
    /**
     * @readonly
     * @type {TExpr}
     */
    expr

    /**
     * @readonly
     * @type {Option<string>}
     */
    argName

    /**
     * Optional source-map site
     * @readonly
     * @type {Option<Site>}
     */
    site

    /**
     * @param {TExpr} expr
     * @param {Option<string>} argName
     * @param {Option<Site>} site
     */
    constructor(expr, argName = None, site = None) {
        this.expr = expr
        this.argName = argName
        this.site = site
    }

    /**
     * @template {UplcTerm} TExpr
     * @param {FlatReader<TExpr, UplcValue>} r
     * @returns {UplcLambda<TExpr>}
     */
    static fromFlat(r) {
        const expr = r.readExpr()
        return new UplcLambda(expr)
    }

    /**
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrLambdaCost()

        return {
            state: {
                reducing: {
                    lambda: {
                        term: this.expr,
                        argName: this.argName ?? undefined,
                        stack: stack
                    }
                }
            }
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_LAMBDA_TAG)
        this.expr.toFlat(w)
    }

    /**
     * Returns string with unicode lambda symbol
     * @returns {string}
     */
    toString() {
        return `(lam ${
            this.argName ? `${this.argName} ` : ""
        }${this.expr.toString()})`
    }
}
