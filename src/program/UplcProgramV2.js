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
 * @typedef {import("./UplcProgram.js").UplcProgramV2I} UplcProgramV2I
 */

/**
 * The optional ir property is lazy because it is only used for debugging and might require an expensive formatting operation
 * @typedef {{
 *   alt?: Option<UplcProgramV2I>
 *   ir?: Option<() => string>
 * }} UplcProgramV2Props
 */

const PLUTUS_VERSION = "PlutusScriptV2"
const PLUTUS_VERSION_TAG = 2
const UPLC_VERSION = "1.0.0"

/**
 * @implements {UplcProgramV2I}
 */
export class UplcProgramV2 {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    root

    /**
     * @readonly
     * @type {Option<UplcProgramV2I>}
     */
    alt

    /**
     * @type {Option<() => string>}
     */
    #ir

    /**
     * @type {Option<number[]>}
     */
    #cachedHash

    /**
     * @param {UplcTerm} root
     * @param {UplcProgramV2Props} props
     */
    constructor(root, props = {}) {
        this.root = root
        this.alt = props.alt
        this.#ir = props.ir
        this.#cachedHash = None
    }

    /**
     * @param {number[]} bytes
     * @param {UplcProgramV2Props} props
     * @returns {UplcProgramV2}
     */
    static fromFlat(bytes, props = {}) {
        return new UplcProgramV2(decodeFlatProgram(bytes, UPLC_VERSION), props)
    }

    /**
     * @param {ByteArrayLike} bytes
     * @param {UplcProgramV2Props} props
     * @returns {UplcProgramV2}
     */
    static fromCbor(bytes, props = {}) {
        return new UplcProgramV2(decodeCborProgram(bytes, UPLC_VERSION), props)
    }

    /**
     * @param {string} src
     * @param {UplcProgramV2Props} props
     * @returns {UplcProgramV2}
     */
    static fromString(src, props = {}) {
        return new UplcProgramV2(
            parseProgram(src, {
                uplcVersion: UPLC_VERSION,
                builtins: builtinsV2
            }),
            props
        )
    }

    /**
     * @type {Option<string>}
     */
    get ir() {
        return this.#ir ? this.#ir() : None
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
     * Returns a new UplcProgramV2 instance, leaving the original untouched.
     * @param {UplcValue[]} args
     * @returns {UplcProgramV2} - a new UplcProgram instance
     */
    apply(args) {
        const alt = this.alt ? this.alt.apply(args) : None
        return new UplcProgramV2(apply(this.root, args), { alt })
    }

    /**
     * @param {Option<UplcValue[]>} args - if None, eval the root term without any applications, if empy: apply a force to the root term
     * @param {number[]} costModelParams
     * @returns {CekResult}
     */
    eval(args, costModelParams = DEFAULT_COST_MODEL_PARAMS_V2()) {
        const costModel = new CostModel(
            new CostModelParamsProxy(costModelParams),
            builtinsV2
        )
        return evalProgram(builtinsV2, costModel, this.root, args)
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
     * @param {UplcProgramV2I} alt
     * @returns {UplcProgramV2I}
     */
    withAlt(alt) {
        return new UplcProgramV2(this.root, { alt, ir: this.#ir })
    }
}
