import { None } from "@helios-lang/type-utils"
import { PreCallFrame } from "../cek/index.js"

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("../flat/index.js").FlatReader<TExpr, TValue>} FlatReader
 */

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../cek/index.js").CekContext} CekContext
 * @typedef {import("../cek/index.js").CekStack} CekStack
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("../flat/index.js").FlatWriter} FlatWriter
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcTerm.js").UplcCall} UplcCall
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

export const UPLC_CALL_TAG = 3

/**
 * @param {{
 *   fn: UplcTerm
 *   arg: UplcTerm
 *   site?: Option<Site>
 * } | {
 *   fn: UplcTerm
 *   args: UplcTerm[]
 *   site?: Option<Site>
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
 * @param {FlatReader<UplcTerm, UplcValue>} r
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
     * @type {Option<Site>}
     */
    site

    /**
     * @param {UplcTerm} fn
     * @param {UplcTerm} arg
     * @param {Option<Site>} site
     */
    constructor(fn, arg, site = None) {
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
            frame: new PreCallFrame(this.arg, stack, this.site)
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
