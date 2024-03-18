import { FlatReader, FlatWriter } from "../../flat/index.js"
import { UplcDelay } from "../terms/index.js"

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
 * @template {EUplcTerm} TArg
 * @implements {EUplcTerm}
 */
export class EUplcDelay {
    /**
     * @readonly
     * @type {Site}
     */
    site

    /**
     * @private
     * @readonly
     * @type {UplcDelay<TArg>}
     */
    term

    /**
     * @param {Site} site
     * @param {UplcDelay<TArg>} term
     */
    constructor(site, term) {
        this.site = site
        this.term = term
    }

    /**
     * @template {EUplcTerm} TArg
     * @template {UplcValue} TValue
     * @param {FlatReader<TArg, TValue>} r
     * @returns {EUplcDelay<TArg>}
     */
    static fromFlat(r) {
        const term = UplcDelay.fromFlat(r)
        const site = r.readSite()
        return new EUplcDelay(site, term)
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
