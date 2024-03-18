import { FlatReader, FlatWriter } from "../../flat/index.js"
import { UplcConst } from "../terms/index.js"

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * @typedef {import("./Site.js").Site} Site
 */

/**
 * @typedef {import("./EUplcTerm.js").EUplcTerm} EUplcTerm
 */

/**
 * @implements {EUplcTerm}
 */
export class EUplcConst {
    /**
     * @readonly
     * @type {Site}
     */
    site

    /**
     * @private
     * @readonly
     * @type {UplcConst}
     */
    term

    /**
     * @param {Site} site
     * @param {UplcConst} term
     */
    constructor(site, term) {
        this.site = site
        this.term = term
    }

    /**
     * @param {FlatReader} r
     * @returns {EUplcConst}
     */
    static fromFlat(r) {
        const term = UplcConst.fromFlat(r)
        const site = r.readSite()
        return new EUplcConst(site, term)
    }

    /**
     * @type {UplcValue}
     */
    get value() {
        return this.term.value
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
