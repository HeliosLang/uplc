import { toInt } from "@helios-lang/codec-utils"
import { makeConstrArgFrame } from "../cek/ConstrArgFrame.js"

/**
 * @import { IntLike } from "@helios-lang/codec-utils"
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { CekContext, CekStack, CekStateChange, FlatWriter, UplcConst, UplcConstr, UplcTerm } from "../index.js"
 */

export const UPLC_CONSTR_TAG = 8

/**
 * @param {IntLike} tag
 * @param {UplcTerm[]} args
 * @param {Site | undefined} [site]
 * @returns {UplcConstr}
 */
export function makeUplcConstr(tag, args, site) {
    return new UplcConstrImpl(Number(toInt(tag)), args, site)
}

/**
 * @implements {UplcConstr}
 */
class UplcConstrImpl {
    /**
     * @readonly
     * @type {number}
     */
    tag

    /**
     * @readonly
     * @type {UplcTerm[]}
     */
    args

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Site | undefined}
     */
    site

    /**
     * @param {number} tag
     * @param {UplcTerm[]} args
     * @param {Site | undefined} site
     */
    constructor(tag, args, site = undefined) {
        this.tag = tag
        this.args = args
        this.site = site
    }

    /**
     * @type {UplcTerm[]}
     */
    get children() {
        return this.args
    }

    /**
     * @type {"constr"}
     */
    get kind() {
        return "constr"
    }

    /**
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrConstrCost()

        if (this.args.length == 0) {
            return {
                state: {
                    reducing: {
                        constr: {
                            tag: this.tag,
                            args: []
                        }
                    }
                }
            }
        } else {
            return {
                state: {
                    computing: {
                        term: this.args[0],
                        stack: stack
                    }
                },
                frames: [
                    makeConstrArgFrame(this.tag, [], this.args.slice(1), stack)
                ] // TODO create this frame type
            }
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_CONSTR_TAG)
        w.writeInt(BigInt(this.tag))
        w.writeList(this.args)
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(constr ${this.tag} ${this.args.map((a) => a.toString()).join(" ")})`
    }
}
