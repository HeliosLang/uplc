import { builtinsV2 } from "../builtins/index.js"
import {
    DEFAULT_COST_MODEL_PARAMS_V2,
    makeCostModel,
    makeCostModelParamsProxy
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
 * @import { CekResult, UplcLogger, UplcProgramV2, UplcSourceMapJsonSafe, UplcTerm, UplcValue } from "src/index.js"
 */

/**
 * The optional ir property can be lazy because it is only used for debugging and might require an expensive formatting operation
 * @typedef {{
 *   alt?: UplcProgramV2
 *   ir?: (() => string) | string
 *   sourceMap?: UplcSourceMapJsonSafe
 * }} UplcProgramV2Options
 */

const PLUTUS_VERSION = "PlutusScriptV2"
const PLUTUS_VERSION_TAG = 2
const UPLC_VERSION = "1.0.0"

/**
 * @typedef {typeof PLUTUS_VERSION} PlutusVersionV2
 */

/**
 * @param {{root: UplcTerm, options?: UplcProgramV2Options}} props
 * @returns {UplcProgramV2}
 */
export function makeUplcProgramV2(props) {
    return new UplcProgramV2Impl(props.root, props.options ?? {})
}

/**
 * @param {BytesLike} bytes
 * @param {UplcProgramV2Options} options
 * @returns {UplcProgramV2}
 */
export function decodeUplcProgramV2FromCbor(bytes, options = {}) {
    return new UplcProgramV2Impl(
        decodeCborProgram(bytes, UPLC_VERSION, builtinsV2),
        options
    )
}

/**
 * @param {number[]} bytes
 * @param {UplcProgramV2Options} options
 * @returns {UplcProgramV2}
 */
export function decodeUplcProgramV2FromFlat(bytes, options = {}) {
    return new UplcProgramV2Impl(
        decodeFlatProgram(bytes, UPLC_VERSION, builtinsV2),
        options
    )
}

/**
 * @param {string} src
 * @param {UplcProgramV2Options} options
 * @returns {UplcProgramV2}
 */
export function parseUplcProgramV2(src, options = {}) {
    return new UplcProgramV2Impl(
        parseProgram(src, {
            uplcVersion: UPLC_VERSION,
            builtins: builtinsV2
        }),
        options
    )
}

/**
 * @implements {UplcProgramV2}
 */
class UplcProgramV2Impl {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    root

    /**
     * @readonly
     * @type {UplcProgramV2 | undefined}
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
     * @param {UplcProgramV2Options} options
     */
    constructor(root, options) {
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
     * @type {PlutusVersionV2}
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
        const alt = this.alt ? this.alt.apply(args) : undefined
        return new UplcProgramV2Impl(apply(this.root, args), { alt })
    }

    /**
     * @param {UplcValue[] | undefined} args - if None, eval the root term without any applications, if empy: apply a force to the root term
     * @param {object} [options]
     * @param {UplcLogger} [options.logOptions]
     * @param {number[]} [options.costModelParams]
     * @returns {CekResult}
     */
    eval(args, options = {}) {
        const { logOptions, costModelParams = DEFAULT_COST_MODEL_PARAMS_V2() } =
            options
        const costModel = makeCostModel(
            makeCostModelParamsProxy(costModelParams),
            builtinsV2
        )
        return evalProgram(builtinsV2, this.root, args, {
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
     * @param {UplcProgramV2} alt
     * @returns {UplcProgramV2}
     */
    withAlt(alt) {
        return new UplcProgramV2Impl(this.root, { alt, ir: this._ir })
    }
}
