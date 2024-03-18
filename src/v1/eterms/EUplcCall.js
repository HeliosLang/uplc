import { FlatReader, FlatWriter } from "../../flat/index.js"
import { UplcCall } from "../terms/index.js"

/**
 * @typedef {import("./Site.js").Site} Site
 */

/**
 * @typedef {import("./EUplcTerm.js").EUplcTerm} EUplcTerm
 */

/**
 * @template {EUplcTerm} TFn
 * @template {EUplcTerm} TArg
 * @implements {EUplcTerm}
 */
export class EUplcCall {
    /**
     * @readonly
     * @type {Site}
     */
    site

    /**
     * @private
     * @readonly
     * @type {UplcCall<TFn, TArg>}
     */

    /**
     * @param {Site} site
     * @param {UplcCall<TFn, TArg>} term
     */
    constructor(site, term) {
        this.site = site
        this.term = term
    }

    /**
     * @type {TFn}
     */
    get fn() {
        return this.term.fn
    }

    /**
     * @type {TArg}
     */
    get arg() {
        return this.term.arg
    }

    /**
     * @param {FlatReader} r
     */
    static fromFlat(r) {
        const term = UplcCall.fromFlat(r)
        const site = r.readSite()
        return new EUplcCall(site, term)
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
