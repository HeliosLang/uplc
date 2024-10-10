import { None } from "@helios-lang/type-utils"

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("../flat/index.js").FlatReaderI<TExpr, TValue>} FlatReaderI
 */

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../cek/index.js").CekContext} CekContext
 * @typedef {import("../cek/index.js").CekStack} CekStack
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("../flat/index.js").FlatWriterI} FlatWriterI
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 * @typedef {import("./UplcTerm.js").UplcLambdaI} UplcLambdaI
 */

export const UPLC_LAMBDA_TAG = 2

/**
 * Plutus-core lambda term, a function that takes a signle argument
 * @template {UplcTerm} [TExpr=UplcTerm]
 * @implements {UplcLambdaI}
 */
export class UplcLambda {
    /**
     * @readonly
     * @type {TExpr}
     */
    expr

    /**
     * Mutable so that SourceMap application is easier
     * @readwrite
     * @type {Option<string>}
     */
    argName

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
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
     * @param {FlatReaderI<TExpr, UplcValue>} r
     * @returns {UplcLambda<TExpr>}
     */
    static fromFlat(r) {
        const expr = r.readExpr()
        return new UplcLambda(expr)
    }

    /**
     * @type {UplcTerm[]}
     */
    get children() {
        return [this.expr]
    }

    /**
     * @type {"lambda"}
     */
    get kind() {
        return "lambda"
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
                    name: this.site?.alias,
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
     * @param {FlatWriterI} w
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
