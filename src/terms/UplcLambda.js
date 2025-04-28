/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekFrame,
 *   CekEnv,
 *   CekState,
 *   FlatReader,
 *   FlatWriter,
 *   UplcLambda,
 *   UplcTerm
 * } from "../index.js"
 */

export const UPLC_LAMBDA_TAG = 2

/**
 * @param {{body: UplcTerm, argName?: string, site?: Site}} props
 * @returns {UplcLambda}
 */
export function makeUplcLambda(props) {
    return new UplcLambdaImpl(props.body, props.argName, props.site)
}

/**
 * @param {FlatReader} r
 * @returns {UplcLambda}
 */
export function decodeUplcLambdaFromFlat(r) {
    const expr = r.readExpr()
    return makeUplcLambda({ body: expr })
}

/**
 * Plutus-core lambda term, a function that takes a signle argument
 * @implements {UplcLambda}
 */
class UplcLambdaImpl {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    expr

    /**
     * Mutable so that SourceMap application is easier
     * @readwrite
     * @type {string | undefined}
     */
    argName

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Site | undefined}
     */
    site

    /**
     * @param {UplcTerm} expr
     * @param {string | undefined} argName
     * @param {Site | undefined} site
     */
    constructor(expr, argName = undefined, site = undefined) {
        this.expr = expr
        this.argName = argName
        this.site = site
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
     * @param {CekFrame[]} frames
     * @param {CekEnv} env
     * @param {CekContext} ctx
     * @returns {CekState}
     */
    compute(frames, env, ctx) {
        ctx.cost.incrLambdaCost()

        return {
            kind: "reducing",
            value: {
                kind: "lambda",
                body: this.expr,
                env: env,
                argName: this.argName ?? undefined,
                name: this.site?.description
            },
            frames
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
