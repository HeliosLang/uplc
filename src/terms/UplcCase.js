import { makeCekCaseScrutineeFrame } from "../cek/index.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekFrame,
 *   CekEnv,
 *   CekState,
 *   FlatReader,
 *   FlatWriter,
 *   UplcCase,
 *   UplcTerm
 * } from "../index.js"
 */

export const UPLC_CASE_TAG = 9

/**
 * @param {UplcTerm} arg
 * @param {UplcTerm[]} cases
 * @param {Site | undefined} site
 * @returns {UplcCase}
 */
export function makeUplcCase(arg, cases, site = undefined) {
    return new UplcCaseImpl(arg, cases, site)
}

/**
 * @param {FlatReader} r
 * @returns {UplcCase}
 */
export function decodeUplcCaseFromFlat(r) {
    const arg = r.readExpr()
    const cases = r.readList((r) => r.readExpr())

    return makeUplcCase(arg, cases)
}

/**
 * @implements {UplcCase}
 */
class UplcCaseImpl {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    arg

    /**
     * @readonly
     * @type {UplcTerm[]}
     */
    cases

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Site | undefined}
     */
    site

    /**
     *
     * @param {UplcTerm} arg
     * @param {UplcTerm[]} cases
     * @param {Site | undefined} site
     */
    constructor(arg, cases, site = undefined) {
        this.arg = arg
        this.cases = cases
        this.site = site
    }

    /**
     * @type {UplcTerm[]}
     */
    get children() {
        return [this.arg].concat(this.cases)
    }

    /**
     * @type {"case"}
     */
    get kind() {
        return "case"
    }

    /**
     * @param {CekFrame[]} frames
     * @param {CekEnv} env
     * @param {CekContext} ctx
     * @returns {CekState}
     */
    compute(frames, env, ctx) {
        ctx.cost.incrCaseCost()

        return {
            kind: "computing",
            term: this.arg,
            env: env,
            frames: frames.concat([makeCekCaseScrutineeFrame(this.cases, env)])
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_CASE_TAG)
        this.arg.toFlat(w)
        w.writeList(this.cases)
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(case (${this.arg.toString()}) ${this.cases.map((c) => `(${c.toString()})`).join(" ")})`
    }
}
