/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekStack,
 *   CekStateChange,
 *   FlatWriter,
 *   UplcError,
 *   UplcTerm
 * } from "../index.js"
 */

export const UPLC_ERROR_TAG = 6

/**
 * @param {{site?: Site}} props
 * @returns {UplcError}
 */
export function makeUplcError(props = {}) {
    return new UplcErrorImpl(props.site)
}

/**
 * Plutus-core error term
 * @implements {UplcError}
 */
class UplcErrorImpl {
    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Site | undefined}
     */
    site

    /**
     * @param {Site | undefined} site
     */
    constructor(site = undefined) {
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
     * @param {FlatWriter} w
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
