import { FlatWriter } from "../../flat/index.js"

/**
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 */

/**
 * @typedef {import("../cek/index.js").CekValue} CekValue
 */

/**
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
     * @param {string} message
     */
    constructor(message = "") {
        this.message = message
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
     * @param {CekValue[]} stack
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
