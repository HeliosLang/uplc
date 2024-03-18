import { FlatWriter } from "../../flat/index.js"
import { UplcError } from "../terms/index.js"

/**
 * @typedef {import("./Site.js").Site} Site
 */

/**
 * @typedef {import("./EUplcTerm.js").EUplcTerm} EUplcTerm
 */

/**
 * @implements {EUplcTerm}
 */
export class EUplcError {
    /**
     * @readonly
     * @type {Site}
     */
    site

    /**
     * @private
     * @readonly
     * @type {UplcError}
     */
    term

    /**
     * @readonly
     * @type {string}
     */
    message

    /**
     * @param {Site} site
     * @param {UplcError} term
     * @param {string} message
     */
    constructor(site, term, message = "") {
        this.site = site
        this.term = term
        this.message = message
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.term.toString()
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        this.term.toFlat(w)
        w.writeSite(this.site)
    }
}
