import { FlatReader, FlatWriter } from "../../flat/index.js"
import { UplcLambda } from "../terms/index.js"

/**
 * @typedef {import("./Site.js").Site} Site
 */

/**
 * @typedef {import("./EUplcTerm.js").EUplcTerm} EUplcTerm
 */

/**
 * @template {EUplcTerm} TExpr
 * @implements {EUplcTerm}
 */
export class EUplcLambda {
    /**
     * @readonly
     * @type {Site}
     */
    site

    /**
     * @private
     * @readonly
     * @type {UplcLambda<TExpr>}
     */
    term

    /**
     * @param {Site} site
     * @param {UplcLambda<TExpr>} term
     */
    constructor(site, term) {
        this.site = site
        this.term = term
    }

    /**
     * @template {EUplcTerm} TExpr
     * @param {FlatReader<TExpr>} r
     * @returns {EUplcLambda<TExpr>}
     */
    static fromFlat(r) {
        const term = UplcLambda.fromFlat(r)
        const site = r.readSite()
        return new EUplcLambda(site, term)
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
