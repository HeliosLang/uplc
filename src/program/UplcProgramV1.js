import { None } from "@helios-lang/type-utils"
import { builtinsV1 } from "../builtins/index.js"
import {
    CostModel,
    CostModelParamsProxy,
    DEFAULT_COST_MODEL_PARAMS_V1
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
 * @typedef {import("./UplcProgram.js").UplcProgramV1I} UplcProgramV1I
 */

/**
 * The optional ir property is lazy because it is only used for debugging and might require an expensive formatting operation
 * @typedef {{
 *   alt?: Option<UplcProgramV1I>
 *   ir?: Option<() => string>
 * }} UplcProgramV1Props
 */

const PLUTUS_VERSION = "PlutusScriptV1"
const PLUTUS_VERSION_TAG = 1
const UPLC_VERSION = "1.0.0"

/**
 * @typedef {typeof PLUTUS_VERSION} PlutusVersionV1
 */

/**
 * @implements {UplcProgramV1I}
 */
export class UplcProgramV1 {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    root

    /**
     * @readonly
     * @type {Option<UplcProgramV1I>}
     */
    alt

    /**
     * @private
     * @readonly
     * @type {Option<() => string>}
     */
    genIr

    /**
     * @private
     * @type {Option<number[]>}
     */
    cachedHash

    /**
     * @param {UplcTerm} root
     * @param {UplcProgramV1Props} props
     */
    constructor(root, props = {}) {
        this.root = root
        this.alt = props.alt
        this.genIr = props.ir
        this.cachedHash = None
    }

    /**
     * @param {number[]} bytes
     * @param {UplcProgramV1Props} props
     * @returns {UplcProgramV1}
     */
    static fromFlat(bytes, props = {}) {
        return new UplcProgramV1(decodeFlatProgram(bytes, UPLC_VERSION), props)
    }

    /**
     * @param {ByteArrayLike} bytes
     * @param {UplcProgramV1Props} props
     * @returns {UplcProgramV1}
     */
    static fromCbor(bytes, props = {}) {
        return new UplcProgramV1(decodeCborProgram(bytes, UPLC_VERSION), props)
    }

    /**
     * @param {string} src
     * @param {UplcProgramV1Props} props
     * @returns {UplcProgramV1}
     */
    static fromString(src, props = {}) {
        return new UplcProgramV1(
            parseProgram(src, {
                uplcVersion: UPLC_VERSION,
                builtins: builtinsV1
            }),
            props
        )
    }

    /**
     * @type {Option<string>}
     */
    get ir() {
        return this.genIr ? this.genIr() : None
    }

    /**
     * Script version, determines the available builtins and the shape of the ScriptContext
     * @type {PlutusVersionV1}
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
        const alt = this.alt ? this.alt.apply(args) : None
        return new UplcProgramV1(apply(this.root, args), { alt })
    }

    /**
     * @param {Option<UplcValue[]>} args - if None, eval the root term without any applications, if empy: apply a force to the root term
     * @param {number[]} costModelParams
     * @returns {CekResult}
     */
    eval(args, costModelParams = DEFAULT_COST_MODEL_PARAMS_V1()) {
        const costModel = new CostModel(
            new CostModelParamsProxy(costModelParams),
            builtinsV1
        )
        return evalProgram(builtinsV1, costModel, this.root, args)
    }

    /**
     * @returns {number[]} - 28 byte hash
     */
    hash() {
        if (!this.cachedHash) {
            this.cachedHash = hashProgram(this)
        }

        return this.cachedHash
    }

    /**
     * Returns the Cbor encoding of a script (flat bytes wrapped twice in Cbor bytearray).
     * @returns {number[]}
     */
    toCbor() {
        return encodeCborProgram(this.root, UPLC_VERSION)
    }

    /**
     * @returns {number[]}
     */
    toFlat() {
        return encodeFlatProgram(this.root, UPLC_VERSION)
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.root.toString()
    }

    /**
     * @param {UplcProgramV1I} alt
     * @returns {UplcProgramV1}
     */
    withAlt(alt) {
        return new UplcProgramV1(this.root, { alt, ir: this.genIr })
    }
}
