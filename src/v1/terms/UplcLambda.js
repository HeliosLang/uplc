import { FlatReader, FlatWriter } from "../../flat/index.js"

/**
 * @typedef {import("../cek/index.js").CekContext} CekContext
 */

/**
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 */

/**
 * @typedef {import("../cek/index.js").CekValue} CekValue
 */

/**
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

export const UPLC_LAMBDA_TAG = 2

/**
 * Plutus-core lambda term, a function that takes a signle argument
 * @template {UplcTerm} TExpr
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
     * @type {string}
     */
    argName

    /**
     * @param {TExpr} expr
     * @param {string} argName
     */
    constructor(expr, argName = "") {
        this.expr = expr
        this.argName = argName
    }

    /**
     * @template {UplcTerm} TExpr
     * @param {FlatReader<TExpr>} r
     * @returns {UplcLambda<TExpr>}
     */
    static fromFlat(r) {
        const expr = r.readExpr()
        return new UplcLambda(expr)
    }

    /**
     * Returns string with unicode lambda symbol
     * @returns {string}
     */
    toString() {
        return `(\u039b${
            this.argName !== null ? " " + this.argName + " ->" : ""
        } ${this.expr.toString()})`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_LAMBDA_TAG)
        this.expr.toFlat(w)
    }

    /**
     * @param {CekValue[]} stack
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
                        stack: stack
                    }
                }
            }
        }
    }
}
