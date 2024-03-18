import { FlatReader, FlatWriter } from "../../flat/index.js"
import { PreCallFrame } from "../cek/index.js"

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

export const UPLC_CALL_TAG = 3

/**
 * Plutus-core function application term (i.e. function call)
 * @template {UplcTerm} TFn
 * @template {UplcTerm} TArg
 * @implements {UplcTerm}
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
     * @param {TFn} fn
     * @param {TArg} arg
     */
    constructor(fn, arg) {
        this.fn = fn
        this.arg = arg
    }

    /**
     * @template {UplcTerm} T
     * @param {FlatReader<T>} r
     * @returns {UplcCall<T, T>}
     */
    static fromFlat(r) {
        return new UplcCall(r.readExpr(), r.readExpr())
    }

    /**
     * @returns {string}
     */
    toString() {
        return `[${this.fn.toString()} ${this.arg.toString()}]`
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
     * @param {CekValue[]} stack
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
            frame: new PreCallFrame(this.arg, stack)
        }
    }
}
