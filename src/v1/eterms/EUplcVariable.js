import { FlatReader, FlatWriter } from "../../flat/index.js"
import { UplcVar } from "../terms/index.js"

/**
 * @typedef {import("./Site.js").Site} Site
 */

/**
 * @typedef {import("./EUplcTerm.js").EUplcTerm} EUplcTerm
 */

/**
 * @implements {EUplcTerm}
 */
export class EUplcVariable {
    /**
     * @readonly
     * @type {Site}
     */
    site

    /**
     * @private
     * @readonly
     * @type {UplcVar}
     */
    term

    /**
     * @param {Site} site
     * @param {UplcVar} term
     */
    constructor(site, term) {
        this.site = site
        this.term = term
    }

    /**
     * @param {FlatReader} r
     * @returns {EUplcVariable}
     */
    static fromFlat(r) {
        const term = UplcVar.fromFlat(r)
        const site = r.readSite()
        return new EUplcVariable(site, term)
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        this.term.toFlat(w)
        w.writeSite(this.site)
    }
}
