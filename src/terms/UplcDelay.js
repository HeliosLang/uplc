/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekStack,
 *   CekStateChange,
 *   FlatReader,
 *   FlatWriter,
 *   UplcDelay,
 *   UplcTerm
 * } from "src/index.js"
 */

export const UPLC_DELAY_TAG = 1

/**
 *
 * @param {{
 *   arg: UplcTerm
 *   site?: Site
 * }} props
 * @returns {UplcDelay}
 */
export function makeUplcDelay(props) {
    return new UplcDelayImpl(props.arg, props.site)
}

/**
 * @param {FlatReader} r
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
     * @type {Site | undefined}
     */
    site

    /**
     * @param {UplcTerm} arg
     * @param {Site | undefined} site
     */
    constructor(arg, site = undefined) {
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
