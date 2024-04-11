import { None } from "@helios-lang/type-utils"
import { FlatReader, FlatWriter } from "../flat/index.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../cek/index.js").CekContext} CekContext
 * @typedef {import("../cek/index.js").CekStack} CekStack
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("../values/index.js").UplcValue} UplcValue
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
     * @readonly
     * @type {Option<string>}
     */
    name

    /**
     * Optional source-map site
     * @readonly
     * @type {Option<Site>}
     */
    site

    /**
     * @param {number} index
     * @param {Option<string>} name
     * @param {Option<Site>} site
     */
    constructor(index, name = None, site = None) {
        this.index = index
        this.name = name
        this.site = site
    }

    /**
     * @param {FlatReader<UplcTerm, UplcValue>} r
     * @returns {UplcVar}
     */
    static fromFlat(r) {
        const index = r.readInt()
        return new UplcVar(Number(index))
    }

    /**
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrVarCost()

        const i = stack.values.length - this.index
        const v = stack.values[i]

        if (!v) {
            throw new Error(
                `${i} ${this.index} out of range in stack ${JSON.stringify(
                    stack
                )}`
            )
        }

        return {
            state: {
                reducing: v
            }
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_VAR_TAG)
        w.writeInt(BigInt(this.index))
    }

    /**
     * @returns {string}
     */
    toString() {
        if (this.name) {
            return this.name
        } else {
            return `x${this.index}`
        }
    }
}
