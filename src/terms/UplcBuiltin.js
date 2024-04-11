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
     * Optional source-map site
     * @readonly
     * @type {Option<Site>}
     */
    site

    /**
     * @param {number | bigint} id
     * @param {Option<Site>} site
     */
    constructor(id, site = None) {
        this.id = Number(id)
        this.site = site
    }

    /**
     * @param {FlatReader<UplcTerm, UplcValue>} reader
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
        return `(builtin ${this.id.toString()})`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_BUILTIN_TAG)
        w.writeBuiltinId(this.id)
    }

    /**
     * @param {CekStack} stack
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
