import { builtinsV1 } from "../builtins/index.js"
import {
    makeCostModel,
    makeCostModelParamsProxy,
    DEFAULT_COST_MODEL_PARAMS_V1
} from "../costmodel/index.js"
import { apply } from "../terms/index.js"
import { parseProgram } from "./parse.js"
import {
    decodeCborProgram,
    decodeFlatProgram,
    encodeCborProgram,
    encodeFlatProgram,
    evalProgram,
    hashProgram
} from "./UplcProgram.js"
import { deserializeUplcSourceMap } from "./UplcSourceMap.js"

/**
 * @import { BytesLike } from "@helios-lang/codec-utils"
 * @import { CekResult, UplcLogger, UplcProgramV1, UplcSourceMapJsonSafe, UplcTerm, UplcValue } from "src/index.js"
 */

/**
 * The optional ir property can be lazy because it is only used for debugging and might require an expensive formatting operation
 * @typedef {{
 *   alt?: UplcProgramV1
 *   ir?: (() => string) | string
 *   sourceMap?: UplcSourceMapJsonSafe
 * }} UplcProgramV1Options
 */

const PLUTUS_VERSION = "PlutusScriptV1"
const PLUTUS_VERSION_TAG = 1
const UPLC_VERSION = "1.0.0"

/**
 * @typedef {typeof PLUTUS_VERSION} PlutusVersionV1
 */

/**
 * @param {{
 *   root: UplcTerm
 *   options?: UplcProgramV1Options
 * }} props
 * @returns {UplcProgramV1}
 */
export function makeUplcProgramV1(props) {
    return new UplcProgramV1Impl(props.root, props.options ?? {})
}

/**
 * @param {BytesLike} bytes
 * @param {UplcProgramV1Options} options
 * @returns {UplcProgramV1Impl}
 */
export function decodeUplcProgramV1FromCbor(bytes, options = {}) {
    return new UplcProgramV1Impl(
        decodeCborProgram(bytes, UPLC_VERSION, builtinsV1),
        options
    )
}

/**
 * @param {number[]} bytes
 * @param {UplcProgramV1Options} options
 * @returns {UplcProgramV1Impl}
 */
export function decodeUplcProgramV1FromFlat(bytes, options = {}) {
    return new UplcProgramV1Impl(
        decodeFlatProgram(bytes, UPLC_VERSION, builtinsV1),
        options
    )
}

/**
 * @param {string} src
 * @param {UplcProgramV1Options} options
 * @returns {UplcProgramV1Impl}
 */
export function parseUplcProgramV1(src, options = {}) {
    return new UplcProgramV1Impl(
        parseProgram(src, {
            uplcVersion: UPLC_VERSION,
            builtins: builtinsV1
        }),
        options
    )
}

/**
 * @implements {UplcProgramV1}
 */
class UplcProgramV1Impl {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    root

    /**
     * @readonly
     * @type {UplcProgramV1 | undefined}
     */
    alt

    /**
     * @private
     * @readonly
     * @type {((() => string) | string) | undefined}
     */
    _ir

    /**
     * Cached hash
     * @private
     * @type {number[] | undefined}
     */
    _hash

    /**
     * @param {UplcTerm} root
     * @param {UplcProgramV1Options} options
     */
    constructor(root, options = {}) {
        this.root = root
        this.alt = options.alt
        this._ir = options.ir
        this._hash = undefined

        if (options.sourceMap) {
            deserializeUplcSourceMap(options.sourceMap).apply(this.root)
        }
    }

    /**
     * @type {string | undefined}
     */
    get ir() {
        if (this._ir) {
            if (typeof this._ir == "string") {
                return this._ir
            } else {
                return this._ir()
            }
        } else {
            return undefined
        }
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
     * @returns {UplcProgramV1Impl} - a new UplcProgram instance
     */
    apply(args) {
        const alt = this.alt ? this.alt.apply(args) : undefined
        return new UplcProgramV1Impl(apply(this.root, args), { alt })
    }

    /**
     * @param {UplcValue[] | undefined} args - if None, eval the root term without any applications, if empy: apply a force to the root term
     * @param {object} [options]
     * @param {UplcLogger} [options.logOptions]
     * @param {number[]} [options.costModelParams]
     * @returns {CekResult}
     */
    eval(args, options = {}) {
        const { logOptions, costModelParams = DEFAULT_COST_MODEL_PARAMS_V1() } =
            options
        const costModel = makeCostModel(
            makeCostModelParamsProxy(costModelParams),
            builtinsV1
        )
        return evalProgram(builtinsV1, this.root, args, {
            costModel,
            logOptions
        })
    }

    /**
     * @returns {number[]} - 28 byte hash
     */
    hash() {
        if (!this._hash) {
            this._hash = hashProgram(this)
        }

        return this._hash
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
     * @param {UplcProgramV1} alt
     * @returns {UplcProgramV1}
     */
    withAlt(alt) {
        return new UplcProgramV1Impl(this.root, { alt, ir: this._ir })
    }
}
