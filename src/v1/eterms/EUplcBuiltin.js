import { BitReader, BitWriter } from "@helios-lang/codec-utils"
import {
    FlatReader,
    FlatWriter,
    decodeFlatSite,
    encodeFlatSite
} from "../../flat/index.js"
import { UplcBuiltin } from "../terms/UplcBuiltin.js"

/**
 * @typedef {import("./Site.js").Site} Site
 */

/**
 * @typedef {import("./EUplcTerm.js").EUplcTerm} EUplcTerm
 */

/**
 * @implements {EUplcTerm}
 */
export class EUplcBuiltin {
    /**
     * @readonly
     * @type {Site}
     */
    site

    /**
     * @private
     * @readonly
     * @type {UplcBuiltin}
     */
    term

    /**
     * @param {Site} site
     * @param {UplcBuiltin} term
     */
    constructor(site, term) {
        this.site = site
        this.term = term
    }

    /**
     * @param {FlatReader} r
     * @returns {EUplcBuiltin}
     */
    static fromFlat(r) {
        const term = UplcBuiltin.fromFlat(r)
        const site = r.readSite()
        return new EUplcBuiltin(site, term)
    }

    /**
     * @type {number}
     */
    get id() {
        return this.term.id
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        this.term.toFlat(w)
        w.writeSite(this.site)
    }
}
