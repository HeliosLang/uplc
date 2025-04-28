import { makeCekLeftApplyToTermFrame } from "../cek/index.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekFrame,
 *   CekEnv,
 *   CekState,
 *   FlatReader,
 *   FlatWriter,
 *   UplcApply,
 *   UplcTerm
 * } from "../index.js"
 */

export const UPLC_APPLY_TAG = 3

/**
 * @param {{
 *   fn: UplcTerm
 *   arg: UplcTerm
 *   site?: Site
 * } | {
 *   fn: UplcTerm
 *   args: UplcTerm[]
 *   site?: Site
 * }} props
 * @returns {UplcApply}
 */
export function makeUplcApply(props) {
    if ("arg" in props) {
        return new UplcApplyImpl(props.fn, props.arg, props.site)
    } else {
        const site = props.site
        let expr = new UplcApplyImpl(props.fn, props.args[0], site)

        props.args.slice(1).forEach((arg) => {
            expr = new UplcApplyImpl(expr, arg, site)
        })

        return expr
    }
}

/**
 * @param {FlatReader} r
 * @returns {UplcApply}
 */
export function decodeUplcApplyFromFlat(r) {
    return makeUplcApply({ fn: r.readExpr(), arg: r.readExpr() })
}

/**
 * Plutus-core function application term (i.e. function call)
 * @implements {UplcApply}
 */
class UplcApplyImpl {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    fn

    /**
     * @readonly
     * @type {UplcTerm}
     */
    arg

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Site | undefined}
     */
    site

    /**
     * @param {UplcTerm} fn
     * @param {UplcTerm} arg
     * @param {Site | undefined} site
     */
    constructor(fn, arg, site = undefined) {
        this.fn = fn
        this.arg = arg
        this.site = site
    }

    /**
     * @type {UplcTerm[]}
     */
    get children() {
        return [this.fn, this.arg]
    }

    /**
     * @type {"apply"}
     */
    get kind() {
        return "apply"
    }

    /**
     * @param {CekFrame[]} frames
     * @param {CekEnv} env
     * @param {CekContext} ctx
     * @returns {CekState}
     */
    compute(frames, env, ctx) {
        ctx.cost.incrCallCost()

        return {
            kind: "computing",
            term: this.fn,
            env: env,
            frames: frames.concat([
                makeCekLeftApplyToTermFrame(this.arg, env, this.site)
            ])
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_APPLY_TAG)
        this.fn.toFlat(w)
        this.arg.toFlat(w)
    }

    /**
     * @returns {string}
     */
    toString() {
        return `[${this.fn.toString()} ${this.arg.toString()}]`
    }
}
