/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekFrame,
 *   CekEnv,
 *   CekState,
 *   FlatReader,
 *   FlatWriter,
 *   UplcTerm,
 *   UplcVar
 * } from "../index.js"
 */

export const UPLC_VAR_TAG = 0

/**
 * @param {{
 *   index: number
 *   name?: string
 *   site?: Site
 * }} props
 * @returns {UplcVar}
 */
export function makeUplcVar(props) {
    return new UplcVarImpl(props.index, props.name, props.site)
}

/**
 * @param {FlatReader} r
 * @returns {UplcVar}
 */
export function decodeUplcVarFromFlat(r) {
    const index = r.readInt()
    return makeUplcVar({ index: Number(index) })
}

/**
 * @implements {UplcVar}
 */
class UplcVarImpl {
    /**
     * @readonly
     * @type {number}
     */
    index

    /**
     * Only used for debugging
     * @readonly
     * @type {string | undefined}
     */
    name

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Site | undefined}
     */
    site

    /**
     * @param {number} index
     * @param {string | undefined} name
     * @param {Site | undefined} site
     */
    constructor(index, name = undefined, site = undefined) {
        this.index = index
        this.name = name
        this.site = site
    }

    /**
     * @type {UplcTerm[]}
     */
    get children() {
        return []
    }

    /**
     * @type {"var"}
     */
    get kind() {
        return "var"
    }

    /**
     * @param {CekFrame[]} frames
     * @param {CekEnv} env
     * @param {CekContext} ctx
     * @returns {CekState}
     */
    compute(frames, env, ctx) {
        ctx.cost.incrVarCost()

        const i = env.values.length - this.index
        const v = env.values[i]

        if (!v) {
            return {
                kind: "error",
                message: `var ${this.index} out of stack range (stack has ${env.values.length} values)${this.name ? `, '${this.name}'` : ""}`,
                env: env
            }
        } else {
            return {
                kind: "reducing",
                value: v,
                frames
            }
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_VAR_TAG)
        w.writeInt(BigInt(this.index))
    }

    /**
     * @returns {string}
     */
    toString() {
        if (this.name) {
            return this.name
        } else {
            return `x${this.index}`
        }
    }
}
