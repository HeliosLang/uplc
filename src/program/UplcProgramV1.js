import { None } from "@helios-lang/type-utils"
import { builtinsV1 } from "../builtins/index.js"
import { CostModel, DEFAULT_COST_MODEL_PARAMS_V1 } from "../costmodel/index.js"
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
 * @typedef {import("../costmodel/index.js").CostModelParamsV1} CostModelParamsV1
 * @typedef {import("../terms/index.js").UplcTerm} UplcTerm
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcProgram.js").UplcProgram} UplcProgram
 */

const PLUTUS_VERSION = "PlutusScriptV1"
const PLUTUS_VERSION_TAG = 1
const UPLC_VERSION = "1.0.0"

/**
 * @implements {UplcProgram}
 */
export class UplcProgramV1 {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    expr

    /**
     * @readonly
     * @type {Option<UplcProgramV1>}
     */
    alt

    /**
     * @type {Option<number[]>}
     */
    #cachedHash

    /**
     * @param {UplcTerm} expr
     * @param {Option<UplcProgramV1>} alt
     */
    constructor(expr, alt = None) {
        this.expr = expr
        this.alt = alt
        this.#cachedHash = None
    }

    /**
     * @param {number[]} bytes
     * @returns {UplcProgramV1}
     */
    static fromFlat(bytes) {
        return new UplcProgramV1(decodeFlatProgram(bytes, UPLC_VERSION))
    }

    /**
     * @param {ByteArrayLike} bytes
     * @returns {UplcProgramV1}
     */
    static fromCbor(bytes) {
        return new UplcProgramV1(decodeCborProgram(bytes, UPLC_VERSION))
    }

    /**
     * @param {string} src
     * @returns {UplcProgramV1}
     */
    static fromString(src) {
        return new UplcProgramV1(
            parseProgram(src, {
                uplcVersion: UPLC_VERSION,
                builtins: builtinsV1
            })
        )
    }

    /**
     * Script version, determines the available builtins and the shape of the ScriptContext
     * @type {typeof PLUTUS_VERSION}
     */
    get plutusVersion() {
        return PLUTUS_VERSION
    }

    /**
     * Script version tag, shorthand for the plutus version, used in (de)serialization
     * @type {typeof PLUTUS_VERSION_TAG}
     */
    get plutusVersionTag() {
        return PLUTUS_VERSION_TAG
    }

    /**
     * UPLC version, determines UPLC semantics and term types
     * Note: though it makes sense for the team maintaining the Plutus repo
     *   for this to be distinct version, each HFC combines a potentially
     *   new uplcVersion with a new script version, so from a client perspective
     *   it only makes sense to track a single version change
     *   (ie. Plutus V1 vs Plutus V2 vs Plutus V3)
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
     * @returns {UplcProgramV1} - a new UplcProgram instance
     */
    apply(args) {
        return new UplcProgramV1(apply(this.expr, args))
    }

    /**
     * @param {undefined | UplcValue[]} args - if undefined, eval the root term without any applications, if empy: apply a force to the root term
     * @param {CostModelParamsV1} costModelParams
     * @returns {CekResult}
     */
    eval(args, costModelParams = DEFAULT_COST_MODEL_PARAMS_V1) {
        const costModel = new CostModel(costModelParams, builtinsV1)
        return evalProgram(builtinsV1, costModel, this.expr, args)
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
     * @param {UplcProgramV1} alt
     * @returns {UplcProgramV1}
     */
    withAlt(alt) {
        return new UplcProgramV1(this.expr, alt)
    }
}
