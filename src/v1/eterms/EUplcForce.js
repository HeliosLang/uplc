import { FlatReader, FlatWriter } from "../../flat/index.js"
import { UplcForce } from "../terms/index.js"

/**
 * @typedef {import("./Site.js").Site} Site
 */

/**
 * @typedef {import("./EUplcTerm.js").EUplcTerm} EUplcTerm
 */

/**
 * @template {EUplcTerm} TArg
 * @implements {EUplcTerm}
 */
export class EUplcForce {
    /**
     * @readonly
     * @type {Site}
     */
    site

    /**
     * @private
     * @readonly
     * @type {UplcForce<TArg>}
     */
    term

    /**
     * @param {Site} site
     * @param {UplcForce<TArg>} term
     */
    constructor(site, term) {
        this.site = site
        this.term = term
    }

    /**
     * @template {EUplcTerm} TArg
     * @param {FlatReader<TArg>} r
     * @returns {EUplcForce<TArg>}
     */
    static fromFlat(r) {
        const term = UplcForce.fromFlat(r)
        const site = r.readSite()
        return new EUplcForce(site, term)
    }

    /**
     * @type {TArg}
     */
    get arg() {
        return this.term.arg
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
