import { None } from "@helios-lang/type-utils"
import { builtinsV2 } from "../builtins/index.js"
import {
    CostModel,
    DEFAULT_COST_MODEL_PARAMS_V2,
    CostModelParamsProxy
} from "../costmodel/index.js"
import { apply } from "../terms/index.js"
import {
    decodeCborProgram,
    decodeFlatProgram,
    encodeCborProgram,
    encodeFlatProgram,
    evalProgram,
    hashProgram
} from "./UplcProgram.js"
import { parseProgram } from "./parse.js"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 * @typedef {import("../cek/index.js").CekResult} CekResult
 * @typedef {import("../terms/index.js").UplcTerm} UplcTerm
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcProgram.js").UplcProgram} UplcProgram
 */

const PLUTUS_VERSION = "PlutusScriptV2"
const PLUTUS_VERSION_TAG = 2
const UPLC_VERSION = "1.0.0"

/**
 * @implements {UplcProgram}
 */
export class UplcProgramV2 {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    expr

    /**
     * @readonly
     * @type {Option<UplcProgram>}
     */
    alt

    /**
     * @type {Option<number[]>}
     */
    #cachedHash

    /**
     * @param {UplcTerm} expr
     * @param {Option<UplcProgram>} alt
     */
    constructor(expr, alt = None) {
        this.expr = expr
        this.alt = alt
        this.#cachedHash = None
    }

    /**
     * @param {number[]} bytes
     * @returns {UplcProgramV2}
     */
    static fromFlat(bytes) {
        return new UplcProgramV2(decodeFlatProgram(bytes, UPLC_VERSION))
    }

    /**
     * @param {ByteArrayLike} bytes
     * @returns {UplcProgramV2}
     */
    static fromCbor(bytes) {
        return new UplcProgramV2(decodeCborProgram(bytes, UPLC_VERSION))
    }

    /**
     * @param {string} src
     * @returns {UplcProgramV2}
     */
    static fromString(src) {
        return new UplcProgramV2(
            parseProgram(src, {
                uplcVersion: UPLC_VERSION,
                builtins: builtinsV2
            })
        )
    }

    /**
     * @type {typeof PLUTUS_VERSION}
     */
    get plutusVersion() {
        return PLUTUS_VERSION
    }

    /**
     * @type {typeof PLUTUS_VERSION_TAG}
     */
    get plutusVersionTag() {
        return PLUTUS_VERSION_TAG
    }

    /**
     * @type {typeof UPLC_VERSION}
     */
    get uplcVersion() {
        return UPLC_VERSION
    }

    /**
     * Wrap the top-level term with consecutive UplcCall (not exported) terms.
     *
     * Returns a new UplcProgramV1 instance, leaving the original untouched.
     * @param {UplcValue[]} args
     * @returns {UplcProgramV2} - a new UplcProgram instance
     */
    apply(args) {
        return new UplcProgramV2(apply(this.expr, args))
    }

    /**
     * @param {undefined | UplcValue[]} args - if undefined, eval the root term without any applications, if empy: apply a force to the root term
     * @param {number[]} costModelParams
     * @returns {CekResult}
     */
    eval(args, costModelParams = DEFAULT_COST_MODEL_PARAMS_V2()) {
        const costModel = new CostModel(
            new CostModelParamsProxy(costModelParams),
            builtinsV2
        )
        return evalProgram(builtinsV2, costModel, this.expr, args)
    }

    /**
     * @returns {number[]} - 28 byte hash
     */
    hash() {
        if (!this.#cachedHash) {
            this.#cachedHash = hashProgram(this)
        }

        return this.#cachedHash
    }

    /**
     * Returns the Cbor encoding of a script (flat bytes wrapped twice in Cbor bytearray).
     * @returns {number[]}
     */
    toCbor() {
        return encodeCborProgram(this.expr, UPLC_VERSION)
    }

    /**
     * @returns {number[]}
     */
    toFlat() {
        return encodeFlatProgram(this.expr, UPLC_VERSION)
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.expr.toString()
    }

    /**
     * @param {UplcProgram} alt
     * @returns {UplcProgramV2}
     */
    withAlt(alt) {
        return new UplcProgramV2(this.expr, alt)
    }
}
