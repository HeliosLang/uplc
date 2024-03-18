import { FlatReader, FlatWriter } from "../../flat/index.js"
import { ForceFrame } from "../cek/index.js"

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

export const UPLC_FORCE_TAG = 5

/**
 * Plutus-core force term
 * @template {UplcTerm} TArg
 * @implements {UplcTerm}
 */
export class UplcForce {
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
     * @param {FlatReader<TArg>} r
     */
    static fromFlat(r) {
        const arg = r.readExpr()
        return new UplcForce(arg)
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(force ${this.arg.toString()})`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_FORCE_TAG)
        this.arg.toFlat(w)
    }

    /**
     *
     * @param {CekValue[]} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrForceCost()

        return {
            state: {
                computing: {
                    term: this.arg,
                    stack: stack
                }
            },
            frame: new ForceFrame()
        }
    }
}
