import { None } from "@helios-lang/type-utils"
import { FlatReader, FlatWriter } from "../flat/index.js"
import { ForceFrame } from "../cek/index.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../cek/index.js").CekContext} CekContext
 * @typedef {import("../cek/index.js").CekStack} CekStack
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 * @typedef {import("./UplcTerm.js").UplcForceI} UplcForceI
 */

export const UPLC_FORCE_TAG = 5

/**
 * Plutus-core force term
 * @template {UplcTerm} [TArg=UplcTerm]
 * @implements {UplcForceI}
 */
export class UplcForce {
    /**
     * @readonly
     * @type {TArg}
     */
    arg

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Option<Site>}
     */
    site

    /**
     * @param {TArg} arg
     * @param {Option<Site>} site
     */
    constructor(arg, site = None) {
        this.arg = arg
        this.site = site
    }

    /**
     * @template {UplcTerm} TArg
     * @param {FlatReader<TArg, UplcValue>} r
     */
    static fromFlat(r) {
        const arg = r.readExpr()
        return new UplcForce(arg)
    }

    /**
     * @type {UplcTerm[]}
     */
    get children() {
        return [this.arg]
    }

    /**
     * @type {"force"}
     */
    get kind() {
        return "force"
    }

    /**
     *
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrForceCost()

        return {
            state: {
                computing: {
                    term: this.arg,
                    stack: stack
                }
            },
            frame: new ForceFrame(stack, this.site)
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_FORCE_TAG)
        this.arg.toFlat(w)
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(force ${this.arg.toString()})`
    }
}
