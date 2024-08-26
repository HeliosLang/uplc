import { None } from "@helios-lang/type-utils"
import { builtinsV3 } from "../builtins/index.js"
import {
    CostModel,
    CostModelParamsProxy,
    DEFAULT_COST_MODEL_PARAMS_V3
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
 * @typedef {import("../costmodel/index.js").CostModelParamsV3} CostModelParamsV3
 * @typedef {import("../terms/index.js").UplcTerm} UplcTerm
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcProgram.js").UplcProgram} UplcProgram
 */

const PLUTUS_VERSION = "PlutusScriptV3"
const PLUTUS_VERSION_TAG = 3
const UPLC_VERSION = "1.1.0"

/**
 * @implements {UplcProgram}
 */
export class UplcProgramV3 {
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
     * @returns {UplcProgramV3}
     */
    static fromFlat(bytes) {
        return new UplcProgramV3(decodeFlatProgram(bytes, UPLC_VERSION))
    }

    /**
     * @param {ByteArrayLike} bytes
     * @returns {UplcProgramV3}
     */
    static fromCbor(bytes) {
        return new UplcProgramV3(decodeCborProgram(bytes, UPLC_VERSION))
    }

    /**
     * @param {string} src
     * @returns {UplcProgramV3}
     */
    static fromString(src) {
        return new UplcProgramV3(
            parseProgram(src, {
                uplcVersion: UPLC_VERSION,
                builtins: builtinsV3
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
     * @returns {UplcProgramV3} - a new UplcProgram instance
     */
    apply(args) {
        return new UplcProgramV3(apply(this.expr, args))
    }

    /**
     * @param {undefined | UplcValue[]} args - if undefined, eval the root term without any applications, if empy: apply a force to the root term
     * @param {CostModelParamsV3} costModelParams
     * @returns {CekResult}
     */
    eval(args, costModelParams = DEFAULT_COST_MODEL_PARAMS_V3()) {
        const costModel = new CostModel(
            new CostModelParamsProxy(costModelParams),
            builtinsV3
        )
        return evalProgram(builtinsV3, costModel, this.expr, args)
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
     * @returns {UplcProgramV3}
     */
    withAlt(alt) {
        return new UplcProgramV3(this.expr, alt)
    }
}
