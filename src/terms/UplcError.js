import { None } from "@helios-lang/type-utils"
import { FlatWriter } from "../flat/index.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../cek/index.js").CekStack} CekStack
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

export const UPLC_ERROR_TAG = 6

/**
 * Plutus-core error term
 * @implements {UplcTerm}
 */
export class UplcError {
    /**
     * Only used for debugging and doesn't actually appear in the final program
     * TODO: should we move this to EUplc?
     * @readonly
     * @type {string}
     */
    message

    /**
     * Optional source-map site
     * @readonly
     * @type {Option<Site>}
     */
    site

    /**
     * @param {string} message
     * @param {Option<Site>} site
     */
    constructor(message = "", site = None) {
        this.message = message
        this.site = site
    }

    /**
     * @returns {string}
     */
    toString() {
        return "(error)"
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_ERROR_TAG)
    }

    /**
     * @param {CekStack} stack
     * @returns {CekStateChange}
     */
    compute(stack) {
        return {
            state: {
                error: {
                    message: this.message
                }
            }
        }
    }
}
