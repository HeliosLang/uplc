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

export const UPLC_BUILTIN_TAG = 7

/**
 * Plutus-core builtin function ref term
 * @implements {UplcTerm}
 */
export class UplcBuiltin {
    /**
     * ID of the builtin
     * @readonly
     * @type {number}
     */
    id

    /**
     * @param {number} id
     */
    constructor(id) {
        this.index = id
    }

    /**
     * @param {FlatReader} reader
     * @returns {UplcBuiltin}
     */
    static fromFlat(reader) {
        let id = reader.readBits(7)
        return new UplcBuiltin(id)
    }

    /**
     * @returns {string}
     */
    toString() {
        if (typeof this.id == "string") {
            return `(builtin ${this.id})`
        } else {
            return `(builtin unknown${this.id.toString()})`
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_BUILTIN_TAG)
        w.writeBuiltinId(this.id)
    }

    /**
     * @param {CekValue[]} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrBuiltinCost()

        return {
            state: {
                reducing: {
                    builtin: {
                        id: this.id,
                        forceCount: 0,
                        args: []
                    }
                }
            }
        }
    }
}
