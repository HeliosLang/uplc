import { builtinsV3 } from "../builtins/index.js"
import { makeUplcByteArray } from "../values/index.js"
import { makeUplcBuiltin } from "./UplcBuiltin.js"
import { makeUplcCall } from "./UplcCall.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekStack,
 *   CekStateChange,
 *   FlatReader,
 *   FlatWriter,
 *   UplcConst,
 *   UplcTerm,
 *   UplcValue
 * } from "../index.js"
 */

export const UPLC_CONST_TAG = 4

/**
 *
 * @param {{value: UplcValue, site?: Site}} props
 * @returns {UplcConst}
 */
export function makeUplcConst(props) {
    return new UplcConstImpl(props.value, props.site)
}

/**
 * @param {FlatReader} r
 * @returns {UplcConst}
 */
export function decodeUplcConstFromFlat(r) {
    const value = r.readValue()
    return makeUplcConst({ value })
}

/**
 * Plutus-core const term (i.e. a literal in conventional sense)
 * @implements {UplcConst}
 */
class UplcConstImpl {
    /**
     * @readonly
     * @type {UplcValue}
     */
    value

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Site | undefined}
     */
    site

    /**
     * @param {UplcValue} value
     * @param {Site | undefined} site
     */
    constructor(value, site = undefined) {
        this.value = value
        this.site = site

        if (value.kind == "int" && !value.signed) {
            throw new Error("UplcConst(UplcInt) must be signed")
        }
    }

    /**
     * @type {UplcTerm[]}
     */
    get children() {
        return []
    }

    /**
     * @type {"const"}
     */
    get kind() {
        return "const"
    }

    /**
     * @type {number}
     */
    get flatSize() {
        return 4 + this.value.flatSize
    }

    /**
     * @type {UplcTerm}
     */
    get serializableTerm() {
        const v = this.value

        if (v.kind == "bls12_381_G1_element") {
            const builtinName = "bls12_381_G1_uncompress"
            return makeUplcCall({
                fn: makeUplcBuiltin({
                    id: builtinsV3.findIndex((bi) => bi.name == builtinName),
                    name: builtinName
                }),
                arg: new UplcConstImpl(makeUplcByteArray(v.compress())),
                site: this.site
            })
        } else if (v.kind == "bls12_381_G2_element") {
            const builtinName = "bls12_381_G2_uncompress"
            return makeUplcCall({
                fn: makeUplcBuiltin({
                    id: builtinsV3.findIndex((bi) => bi.name == builtinName),
                    name: builtinName
                }),
                arg: new UplcConstImpl(makeUplcByteArray(v.compress())),
                site: this.site
            })
        } else {
            return this
        }
    }

    /**
     *
     * @param {CekStack} stack
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    compute(stack, ctx) {
        ctx.cost.incrConstCost()

        return {
            state: {
                reducing: {
                    value: this.value
                }
            }
        }
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        const v = this.value

        if (
            v.kind == "bls12_381_G1_element" ||
            v.kind == "bls12_381_G2_element"
        ) {
            const t = this.serializableTerm

            t.toFlat(w)
        } else if (v.kind == "bls12_381_mlresult") {
            throw new Error("Bls12_381_MlResult can't be serialized")
        } else {
            w.writeTermTag(UPLC_CONST_TAG)
            w.writeTypeBits(v.type.typeBits)
            v.toFlat(w)
        }
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(con ${this.value.type.toString()} ${this.value.toString()})`
    }
}
