import { toInt } from "@helios-lang/codec-utils"
import { expectSome, None } from "@helios-lang/type-utils"

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("../flat/index.js").FlatReader<TExpr, TValue>} FlatReader
 */

/**
 * @typedef {import("@helios-lang/codec-utils").IntLike} IntLike
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../cek/index.js").CekContext} CekContext
 * @typedef {import("../cek/index.js").CekStack} CekStack
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("../flat/index.js").FlatWriter} FlatWriter
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcTerm.js").UplcBuiltin} UplcBuiltin
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

export const UPLC_BUILTIN_TAG = 7

/**
 * @param {{id: number, name: string, site?: Option<Site>}} args
 * @returns {UplcBuiltin}
 */
export function makeUplcBuiltin(args) {
    return new UplcBuiltinImpl(args.id, args.name, args.site)
}

/**
 * @param {FlatReader<UplcTerm, UplcValue>} reader
 * @param {Builtin[]} builtins
 * @returns {UplcBuiltin}
 */
export function decodeUplcBuiltinFromFlat(reader, builtins) {
    let id = reader.readBuiltinId()

    return makeUplcBuiltin({ id, name: expectSome(builtins[id]).name })
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
     * @type {Option<Site>}
     */
    site

    /**
     * @param {IntLike} id
     * @param {string} name
     * @param {Option<Site>} site
     */
    constructor(id, name, site = None) {
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
