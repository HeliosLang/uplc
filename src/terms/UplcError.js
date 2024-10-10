import { None } from "@helios-lang/type-utils"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../cek/index.js").CekContext} CekContext
 * @typedef {import("../cek/index.js").CekStack} CekStack
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("../flat/index.js").FlatWriterI} FlatWriterI
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 * @typedef {import("./UplcTerm.js").UplcErrorI} UplcErrorI
 */

export const UPLC_ERROR_TAG = 6

/**
 * Plutus-core error term
 * @implements {UplcErrorI}
 */
export class UplcError {
    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Option<Site>}
     */
    site

    /**
     * @param {Option<Site>} site
     */
    constructor(site = None) {
        this.site = site
    }

    /**
     * @type {UplcTerm[]}
     */
    get children() {
        return []
    }

    /**
     * @type {"error"}
     */
    get kind() {
        return "error"
    }

    /**
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        return {
            state: {
                error: {
                    message: ctx.popLastMessage() ?? "",
                    stack: stack
                }
            }
        }
    }

    /**
     * @param {FlatWriterI} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_ERROR_TAG)
    }

    /**
     * @returns {string}
     */
    toString() {
        return "(error)"
    }
}
