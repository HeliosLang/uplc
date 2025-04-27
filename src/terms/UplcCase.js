import { makeCaseScrutineeFrame } from "../cek/CaseScrutineeFrame.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { CekContext, CekStack, CekStateChange, FlatWriter, UplcCase, UplcTerm } from "../index.js"
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
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrCaseCost()

        return {
            state: {
                computing: {
                    term: this.arg,
                    stack: stack
                }
            },
            frames: [makeCaseScrutineeFrame(this.cases, stack)]
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
