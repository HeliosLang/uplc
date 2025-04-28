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
 * @import { BytesLike } from "@helios-lang/codec-utils"
 * @import { CekResult, UplcLogger, UplcProgramV3, UplcProgramV3Options, UplcSourceMapJsonSafe, UplcTerm, UplcValue } from "../index.js"
 */

const PLUTUS_VERSION = "PlutusScriptV3"
const PLUTUS_VERSION_TAG = 3
const UPLC_VERSION = "1.1.0"

/**
 * @typedef {typeof PLUTUS_VERSION} PlutusVersionV3
 */

/**
 * @overload
 * @param {UplcTerm} root
 * @returns {UplcProgramV3}
 */
/**
 * @overload
 * @param {UplcTerm} root
 * @param {UplcProgramV3Options} options
 * @returns {UplcProgramV3}
 */
/**
 * @overload
 * @param {{
 *   root: UplcTerm
 *   options?: UplcProgramV3Options
 * }} props
 * @returns {UplcProgramV3}
 */
/**
 * @param {(
 *   [UplcTerm]
 *   | [UplcTerm, UplcProgramV3Options]
 *   | [{root: UplcTerm, options?: UplcProgramV3Options}]
 * )} args
 * @returns {UplcProgramV3}
 */
export function makeUplcProgramV3(...args) {
    if (args.length == 2) {
        return new UplcProgramV3Impl(args[0], args[1])
    } else if (args.length == 1) {
        const arg = args[0]
        if ("root" in arg) {
            return new UplcProgramV3Impl(arg.root, arg.options ?? {})
        } else {
            return new UplcProgramV3Impl(arg, {})
        }
    } else {
        throw new Error("invalid number of arguments for makeUplcProgramV1")
    }
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
     * @type {UplcProgramV3 | undefined}
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
     * @param {UplcProgramV3Options} props
     */
    constructor(root, props = {}) {
        this.root = root
        this.alt = props.alt
        this._ir = props.ir
        this._hash = undefined

        if (props.sourceMap) {
            deserializeUplcSourceMap(props.sourceMap).apply(this.root)
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
     * Wrap the top-level term with consecutive UplcApply (not exported) terms.
     *
     * Returns a new UplcProgramV1 instance, leaving the original untouched.
     * @param {UplcValue[]} args
     * @returns {UplcProgramV3} - a new UplcProgram instance
     */
    apply(args) {
        const alt = this.alt ? this.alt.apply(args) : undefined
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
