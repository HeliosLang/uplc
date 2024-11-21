import { toInt } from "@helios-lang/codec-utils"
import { expectDefined } from "@helios-lang/type-utils"

/**
 * @import { IntLike } from "@helios-lang/codec-utils"
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   Builtin,
 *   CekContext,
 *   CekStack,
 *   CekStateChange,
 *   FlatReader,
 *   FlatWriter,
 *   UplcBuiltin,
 *   UplcTerm
 * } from "../index.js"
 */

export const UPLC_BUILTIN_TAG = 7

/**
 * @param {{id: number, name: string, site?: Site}} args
 * @returns {UplcBuiltin}
 */
export function makeUplcBuiltin(args) {
    return new UplcBuiltinImpl(args.id, args.name, args.site)
}

/**
 * @param {FlatReader} reader
 * @param {Builtin[]} builtins
 * @returns {UplcBuiltin}
 */
export function decodeUplcBuiltinFromFlat(reader, builtins) {
    let id = reader.readBuiltinId()

    return makeUplcBuiltin({ id, name: expectDefined(builtins[id]).name })
}

/**
 * Plutus-core builtin function ref term
 * @implements {UplcBuiltin}
 */
class UplcBuiltinImpl {
    /**
     * ID of the builtin
     * @readonly
     * @type {number}
     */
    id

    /**
     * Name of the builtin
     * Note: though is redundant information, it is much easier to keep track of this here for debugging purposes
     * @readonly
     * @type {string}
     */
    name

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Site | undefined}
     */
    site

    /**
     * @param {IntLike} id
     * @param {string} name
     * @param {Site | undefined} site
     */
    constructor(id, name, site = undefined) {
        this.id = toInt(id)
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
     * @type {"builtin"}
     */
    get kind() {
        return "builtin"
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(builtin ${this.id.toString()})`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeTermTag(UPLC_BUILTIN_TAG)
        w.writeBuiltinId(this.id)
    }

    /**
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrBuiltinCost()

        return {
            state: {
                reducing: {
                    builtin: {
                        id: this.id,
                        name: this.name,
                        forceCount: 0,
                        args: []
                    }
                }
            }
        }
    }
}
