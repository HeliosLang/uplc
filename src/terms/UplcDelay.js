/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekFrame,
 *   CekEnv,
 *   CekState,
 *   FlatReader,
 *   FlatWriter,
 *   UplcDelay,
 *   UplcTerm
 * } from "../index.js"
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
     * @param {CekFrame[]} frames
     * @param {CekEnv} env
     * @param {CekContext} ctx
     * @returns {CekState}
     */
    compute(frames, env, ctx) {
        ctx.cost.incrDelayCost()

        return {
            kind: "reducing",
            value: {
                kind: "delay",
                term: this.arg,
                env: env,
                name: this.site?.description
            },
            frames
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
