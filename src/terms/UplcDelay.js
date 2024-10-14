import { None } from "@helios-lang/type-utils"

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
 * @typedef {import("./UplcTerm.js").UplcDelay} UplcDelay
 */

export const UPLC_DELAY_TAG = 1

/**
 *
 * @param {{
 *   arg: UplcTerm
 *   site?: Option<Site>
 * }} props
 * @returns {UplcDelay}
 */
export function makeUplcDelay(props) {
    return new UplcDelayImpl(props.arg, props.site)
}

/**
 * @param {FlatReader<UplcTerm, any>} r
 * @returns {UplcDelay}
 */
export function decodeUplcDelayFromFlat(r) {
    const arg = r.readExpr()
    return makeUplcDelay({ arg })
}

/**
 * @implements {UplcDelay}
 */
class UplcDelayImpl {
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
     * @type {"delay"}
     */
    get kind() {
        return "delay"
    }

    /**
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrDelayCost()

        return {
            state: {
                reducing: {
                    name: this.site?.alias,
                    delay: {
                        term: this.arg,
                        stack: stack
                    }
                }
            }
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_DELAY_TAG)
        this.arg.toFlat(w)
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(delay ${this.arg.toString()})`
    }
}
