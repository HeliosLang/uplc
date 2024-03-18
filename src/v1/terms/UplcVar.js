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
 * @typedef {import("../eterms/Site.js").Site} Site
 */

/**
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

export const UPLC_VAR_TAG = 0

/**
 * @implements {UplcTerm}
 */
export class UplcVar {
    /**
     * @readonly
     * @type {number}
     */
    index

    /**
     * @param {number} index
     */
    constructor(index) {
        this.index = index
    }

    /**
     * @param {FlatReader} r
     * @returns {UplcVar}
     */
    static fromFlat(r) {
        const index = r.readInt()
        return new UplcVar(Number(index))
    }

    /**
     * @returns {string}
     */
    toString() {
        return `x${this.index}`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_VAR_TAG)
        w.writeInt(BigInt(this.index))
    }

    /**
     * @param {CekValue[]} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrVarCost()

        return {
            state: {
                reducing: stack[stack.length - this.index]
            }
        }
    }
}
