/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekStack,
 *   CekStateChange,
 *   FlatReader,
 *   FlatWriter,
 *   UplcTerm,
 *   UplcValue,
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
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrVarCost()

        const i = stack.values.length - this.index
        const v = stack.values[i]

        if (!v) {
            throw new Error(
                `${i} ${this.index} out of stack range (stack has ${stack.values.length} values)`
            )
        }

        return {
            state: {
                reducing: v
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
