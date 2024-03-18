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
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

export const UPLC_DELAY_TAG = 1

/**
 * @template {UplcTerm} TArg
 * @implements {UplcTerm}
 */
export class UplcDelay {
    /**
     * @readonly
     * @type {TArg}
     */
    arg

    /**
     * @param {TArg} arg
     */
    constructor(arg) {
        this.arg = arg
    }

    /**
     * @template {UplcTerm} TArg
     * @template {UplcValue} TValue
     * @param {FlatReader<TArg, TValue>} r
     * @returns {UplcDelay<TArg>}
     */
    static fromFlat(r) {
        const arg = r.readExpr()
        return new UplcDelay(arg)
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(delay ${this.arg.toString()})`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_DELAY_TAG)
        this.arg.toFlat(w)
    }

    /**
     * @param {CekValue[]} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrDelayCost()

        return {
            state: {
                reducing: {
                    delay: {
                        term: this.arg,
                        stack: stack
                    }
                }
            }
        }
    }
}
