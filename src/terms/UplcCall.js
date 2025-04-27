import { makeLeftApplicationToTermFrame } from "../cek/index.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekStack,
 *   CekStateChange,
 *   FlatReader,
 *   FlatWriter,
 *   UplcCall,
 *   UplcTerm
 * } from "../index.js"
 */

export const UPLC_CALL_TAG = 3

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
 * @returns {UplcCall}
 */
export function makeUplcCall(props) {
    if ("arg" in props) {
        return new UplcCallImpl(props.fn, props.arg, props.site)
    } else {
        const site = props.site
        let expr = new UplcCallImpl(props.fn, props.args[0], site)

        props.args.slice(1).forEach((arg) => {
            expr = new UplcCallImpl(expr, arg, site)
        })

        return expr
    }
}

/**
 * @param {FlatReader} r
 * @returns {UplcCall}
 */
export function decodeUplcCallFromFlat(r) {
    return makeUplcCall({ fn: r.readExpr(), arg: r.readExpr() })
}

/**
 * Plutus-core function application term (i.e. function call)
 * @implements {UplcCall}
 */
class UplcCallImpl {
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
     * @type {"call"}
     */
    get kind() {
        return "call"
    }

    /**
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrCallCost()

        return {
            state: {
                computing: {
                    term: this.fn,
                    stack: stack
                }
            },
            frames: [makeLeftApplicationToTermFrame(this.arg, stack, this.site)]
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_CALL_TAG)
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
