import { None } from "@helios-lang/type-utils"
import { ForceFrame } from "../cek/index.js"

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("../flat/index.js").FlatReader<TExpr, TValue>} FlatReader
 */

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../cek/index.js").CekContext} CekContext
 * @typedef {import("../cek/index.js").CekStack} CekStack
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("../flat/index.js").FlatWriter} FlatWriter
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 * @typedef {import("./UplcTerm.js").UplcForce} UplcForce
 */

export const UPLC_FORCE_TAG = 5

/**
 * @param {{arg: UplcTerm, site?: Option<Site>}} props
 * @returns {UplcForce}
 */
export function makeUplcForce(props) {
    return new UplcForceImpl(props.arg, props.site)
}

/**
 * @template {UplcTerm} TArg
 * @param {FlatReader<UplcTerm, UplcValue>} r
 * @returns {UplcForce}
 */
export function decodeUplcForceFromFlat(r) {
    const arg = r.readExpr()
    return makeUplcForce({ arg })
}

/**
 * Plutus-core force term
 * @implements {UplcForce}
 */
class UplcForceImpl {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    arg

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Option<Site>}
     */
    site

    /**
     * @param {UplcTerm} arg
     * @param {Option<Site>} site
     */
    constructor(arg, site = None) {
        this.arg = arg
        this.site = site
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
