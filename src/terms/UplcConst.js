import { None } from "@helios-lang/type-utils"
import { UplcInt } from "../values/index.js"
import { FlatReader, FlatWriter } from "../flat/index.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../cek/index.js").CekContext} CekContext
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("../values/index.js").UplcValue} UplcValue
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
     * @readonly
     * @type {Option<Site>}
     */
    site

    /**
     * @param {UplcValue} value
     * @param {Option<Site>} site
     */
    constructor(value, site = None) {
        this.value = value
        this.site = site

        if (value instanceof UplcInt && !value.signed) {
            throw new Error("UplcConst(UplcInt) must be signed")
        }
    }

    /**
     * @param {FlatReader<UplcTerm, UplcValue>} r
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
        return `(con ${this.value.type.toString()} ${this.value.toString()})`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_CONST_TAG)
        w.writeTypeBits(this.value.type.typeBits)
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
