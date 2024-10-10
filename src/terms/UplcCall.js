import { None } from "@helios-lang/type-utils"
import { PreCallFrame } from "../cek/index.js"

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
 * @typedef {import("./UplcTerm.js").UplcCallI} UplcCallI
 */

export const UPLC_CALL_TAG = 3

/**
 * Plutus-core function application term (i.e. function call)
 * @template {UplcTerm} [TFn=UplcTerm]
 * @template {UplcTerm} [TArg=UplcTerm]
 * @implements {UplcCallI}
 */
export class UplcCall {
    /**
     * @readonly
     * @type {TFn}
     */
    fn

    /**
     * @readonly
     * @type {TArg}
     */
    arg

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Option<Site>}
     */
    site

    /**
     * @param {TFn} fn
     * @param {TArg} arg
     * @param {Option<Site>} site
     */
    constructor(fn, arg, site = None) {
        this.fn = fn
        this.arg = arg
        this.site = site
    }

    /**
     * @template {UplcTerm} T
     * @param {FlatReaderI<T, UplcValue>} r
     * @returns {UplcCall<T, T>}
     */
    static fromFlat(r) {
        return new UplcCall(r.readExpr(), r.readExpr())
    }

    /**
     * Usefull when creating a Uplc AST directly
     * @param {UplcTerm} fn
     * @param {UplcTerm[]} args
     * @param {Option<Site>} site
     * @returns {UplcCall<UplcTerm, UplcTerm>}
     */
    static multi(fn, args, site = None) {
        let expr = new UplcCall(fn, args[0], site)

        args.slice(1).forEach((arg) => {
            expr = new UplcCall(expr, arg, site)
        })

        return expr
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
     * @param {FlatWriterI} w
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
