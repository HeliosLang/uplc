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
 * @typedef {import("./UplcTerm.js").UplcVar} UplcVar
 */

export const UPLC_VAR_TAG = 0

/**
 * @param {{
 *   index: number
 *   name?: Option<string>
 *   site?: Option<Site>
 * }} props
 * @returns {UplcVar}
 */
export function makeUplcVar(props) {
    return new UplcVarImpl(props.index, props.name, props.site)
}

/**
 * @param {FlatReader<UplcTerm, any>} r
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
     * @type {Option<string>}
     */
    name

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Option<Site>}
     */
    site

    /**
     * @param {number} index
     * @param {Option<string>} name
     * @param {Option<Site>} site
     */
    constructor(index, name = None, site = None) {
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
