import { makeForceFrame } from "../cek/index.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekStack,
 *   CekStateChange,
 *   FlatReader,
 *   FlatWriter,
 *   UplcForce,
 *   UplcTerm
 * } from "src/index.js"
 */

export const UPLC_FORCE_TAG = 5

/**
 * @param {{arg: UplcTerm, site?: Site}} props
 * @returns {UplcForce}
 */
export function makeUplcForce(props) {
    return new UplcForceImpl(props.arg, props.site)
}

/**
 * @param {FlatReader} r
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
            frame: makeForceFrame(stack, this.site)
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
