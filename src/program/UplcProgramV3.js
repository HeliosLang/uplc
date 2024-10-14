import { None } from "@helios-lang/type-utils"
import { builtinsV3 } from "../builtins/index.js"
import {
    makeCostModel,
    makeCostModelParamsProxy,
    DEFAULT_COST_MODEL_PARAMS_V3
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
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("../logging/UplcLogger.js").UplcLogger} UplcLogger
 * @typedef {import("../cek/index.js").CekResult} CekResult
 * @typedef {import("../terms/index.js").UplcTerm} UplcTerm
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcProgram.js").UplcProgramV3} UplcProgramV3
 * @typedef {import("./UplcSourceMap.js").UplcSourceMapJsonSafe} UplcSourceMapJsonSafe
 */

/**
 * The optional ir property can be lazy because it is only used for debugging and might require an expensive formatting operation
 * @typedef {{
 *   alt?: Option<UplcProgramV3>
 *   ir?: Option<(() => string) | string>
 *   sourceMap?: UplcSourceMapJsonSafe
 * }} UplcProgramV3Options
 */

const PLUTUS_VERSION = "PlutusScriptV3"
const PLUTUS_VERSION_TAG = 3
const UPLC_VERSION = "1.1.0"

/**
 * @typedef {typeof PLUTUS_VERSION} PlutusVersionV3
 */

/**
 * @param {{root: UplcTerm, options?: UplcProgramV3Options}} props
 * @returns {UplcProgramV3}
 */
export function makeUplcProgramV3(props) {
    return new UplcProgramV3Impl(props.root, props.options ?? {})
}

/**
 * @param {BytesLike} bytes
 * @param {UplcProgramV3Options} options
 * @returns {UplcProgramV3}
 */
export function decodeUplcProgramV3FromCbor(bytes, options = {}) {
    return new UplcProgramV3Impl(
        decodeCborProgram(bytes, UPLC_VERSION, builtinsV3),
        options
    )
}

/**
 * @param {number[]} bytes
 * @param {UplcProgramV3Options} options
 * @returns {UplcProgramV3}
 */
export function decodeUplcProgramV3FromFlat(bytes, options = {}) {
    return new UplcProgramV3Impl(
        decodeFlatProgram(bytes, UPLC_VERSION, builtinsV3),
        options
    )
}

/**
 * @param {string} src
 * @param {UplcProgramV3Options} options
 * @returns {UplcProgramV3}
 */
export function parseUplcProgramV3(src, options = {}) {
    return new UplcProgramV3Impl(
        parseProgram(src, {
            uplcVersion: UPLC_VERSION,
            builtins: builtinsV3
        }),
        options
    )
}

/**
 * @implements {UplcProgramV3}
 */
class UplcProgramV3Impl {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    root

    /**
     * @readonly
     * @type {Option<UplcProgramV3>}
     */
    alt

    /**
     * @private
     * @readonly
     * @type {Option<(() => string) | string>}
     */
    _ir

    /**
     * Cached hash
     * @private
     * @type {Option<number[]>}
     */
    _hash

    /**
     * @param {UplcTerm} root
     * @param {UplcProgramV3Options} props
     */
    constructor(root, props = {}) {
        this.root = root
        this.alt = props.alt
        this._ir = props.ir
        this._hash = None

        if (props.sourceMap) {
            deserializeUplcSourceMap(props.sourceMap).apply(this.root)
        }
    }

    /**
     * @type {Option<string>}
     */
    get ir() {
        if (this._ir) {
            if (typeof this._ir == "string") {
                return this._ir
            } else {
                return this._ir()
            }
        } else {
            return None
        }
    }

    /**
     * @type {PlutusVersionV3}
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
        const alt = this.alt ? this.alt.apply(args) : None
        return new UplcProgramV3Impl(apply(this.root, args), { alt })
    }

    /**
     * @param {undefined | UplcValue[]} args - if undefined, eval the root term without any applications, if empty: apply a force to the root term
     * @param {object} [options]
     * @param {UplcLogger} [options.logOptions]
     * @param {number[]} [options.costModelParams]
     * @returns {CekResult}
     */
    eval(args, options = {}) {
        const { logOptions, costModelParams = DEFAULT_COST_MODEL_PARAMS_V3() } =
            options
        const costModel = makeCostModel(
            makeCostModelParamsProxy(costModelParams),
            builtinsV3
        )
        return evalProgram(builtinsV3, this.root, args, {
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
     * @param {UplcProgramV3} alt
     * @returns {UplcProgramV3}
     */
    withAlt(alt) {
        return new UplcProgramV3Impl(this.root, { alt, ir: this._ir })
    }
}
