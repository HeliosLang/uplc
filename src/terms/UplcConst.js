import { None, expectSome } from "@helios-lang/type-utils"
import { builtinsV3, builtinsV3Map } from "../builtins/index.js"
import { FlatReader, FlatWriter } from "../flat/index.js"
import {
    Bls12_381_G1_element,
    Bls12_381_G2_element,
    Bls12_381_MlResult,
    UplcByteArray,
    UplcInt
} from "../values/index.js"
import { UplcCall } from "./UplcCall.js"
import { UplcBuiltin } from "./UplcBuiltin.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../cek/index.js").CekContext} CekContext
 * @typedef {import("../cek/index.js").CekStack} CekStack
 * @typedef {import("../cek/index.js").CekStateChange} CekStateChange
 * @typedef {import("../cek/index.js").CekValue} CekValue
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

export const UPLC_CONST_TAG = 4

/**
 * Plutus-core const term (i.e. a literal in conventional sense)
 * @implements {UplcTerm}
 */
export class UplcConst {
    /**
     * @readonly
     * @type {UplcValue}
     */
    value

    /**
     * Optional source-map site
     * Mutable so that SourceMap application is easier
     * @type {Option<Site>}
     */
    site

    /**
     * @param {UplcValue} value
     * @param {Option<Site>} site
     */
    constructor(value, site = None) {
        this.value = value
        this.site = site

        if (value.kind == "int" && !value.signed) {
            throw new Error("UplcConst(UplcInt) must be signed")
        }
    }

    /**
     * @param {FlatReader<UplcTerm, UplcValue>} r
     * @returns {UplcConst}
     */
    static fromFlat(r) {
        const value = r.readValue()
        return new UplcConst(value)
    }

    /**
     * @type {UplcTerm[]}
     */
    get children() {
        return []
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
            return new UplcCall(
                new UplcBuiltin(
                    builtinsV3.findIndex(
                        (bi) => bi.name == "bls12_381_G1_uncompress"
                    )
                ),
                new UplcConst(new UplcByteArray(v.compress())),
                this.site
            )
        } else if (v.kind == "bls12_381_G2_element") {
            return new UplcCall(
                new UplcBuiltin(
                    builtinsV3.findIndex(
                        (bi) => bi.name == "bls12_381_G2_uncompress"
                    )
                ),
                new UplcConst(new UplcByteArray(v.compress())),
                this.site
            )
        } else {
            return this
        }
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(con ${this.value.type.toString()} ${this.value.toString()})`
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
}
