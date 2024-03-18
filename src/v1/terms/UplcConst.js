import { UplcInt } from "../values/index.js"
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

export const UPLC_CONST_TAG = 4

/**
 * Plutus-core const term (i.e. a literal in conventional sense)
 * @implements {UplcTerm}
 */
export class UplcConst {
    /**
     * @readonly
     * @type {UplcValue}
     */
    value

    /**
     * @param {UplcValue} value
     */
    constructor(value) {
        this.value = value

        if (value instanceof UplcInt && !value.signed) {
            throw new Error("UplcConst(UplcInt) must be signed")
        }
    }

    /**
     * @param {FlatReader} r
     * @returns {UplcConst}
     */
    static fromFlat(r) {
        const value = r.readValue()
        return new UplcConst(value)
    }

    /**
     * @type {number}
     */
    get flatSize() {
        return 4 + this.value.flatSize
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.value.toString()
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_CONST_TAG)
        w.writeTypeBits(this.value.typeBits)
        this.value.toFlat(w)
    }

    /**
     *
     * @param {CekValue[]} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrConstCost()

        return {
            state: {
                reducing: {
                    value: this.value
                }
            }
        }
    }
}
