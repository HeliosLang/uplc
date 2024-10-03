import { decodeBytes, encodeBytes, isBytes } from "@helios-lang/cbor"
import { BasicUplcLogger } from "../logging/BasicUplcLogger.js"
import { ByteStream } from "@helios-lang/codec-utils"
import { blake2b } from "@helios-lang/crypto"
import { CekMachine } from "../cek/index.js"
import { CostModel } from "../costmodel/index.js"
import { FlatWriter } from "../flat/index.js"
import { UplcCall, UplcConst, UplcForce, UplcReader } from "../terms/index.js"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 * @typedef {import("../logging/UplcLoggingI.js").UplcLoggingI} UplcLoggingI
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../cek/index.js").CekResult} CekResult
 * @typedef {import("../terms/index.js").UplcTerm} UplcTerm
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * @typedef {"1.0.0" | "1.1.0"} UplcVersion
 * @typedef {"PlutusScriptV1" | "PlutusScriptV2" | "PlutusScriptV3"} PlutusVersion
 * @typedef {1 | 2 | 3} PlutusVersionTag
 */

/**
 * @typedef {{
 *   root: UplcTerm
 *   ir: Option<string>
 *   eval(args: Option<UplcValue[]>, options?: {
 *      logOptions?: UplcLoggingI,
 *      costModelParams?: number[],
 *   }): CekResult
 *   hash(): number[]
 *   toCbor(): number[]
 *   toFlat(): number[]
 *   toString(): string
 * }} CommonUplcProgramProps
 */

/**
 * @typedef {CommonUplcProgramProps & {
 *   plutusVersion: "PlutusScriptV1"
 *   plutusVersionTag: 1
 *   uplcVersion: "1.0.0"
 *   alt: Option<UplcProgramV1I>
 *   apply: (args: UplcValue[]) => UplcProgramV1I
 *   withAlt: (alt: UplcProgramV1I) => UplcProgramV1I
 * }} UplcProgramV1I
 */

/**
 * @typedef {CommonUplcProgramProps & {
 *   plutusVersion: "PlutusScriptV2"
 *   plutusVersionTag: 2
 *   uplcVersion: "1.0.0"
 *   alt: Option<UplcProgramV2I>
 *   apply: (args: UplcValue[]) => UplcProgramV2I
 *   withAlt: (alt: UplcProgramV2I) => UplcProgramV2I
 * }} UplcProgramV2I
 */

/**
 * @typedef {CommonUplcProgramProps & {
 *   plutusVersion: "PlutusScriptV3"
 *   plutusVersionTag: 3
 *   uplcVersion: "1.1.0"
 *   alt: Option<UplcProgramV3I>
 *   apply: (args: UplcValue[]) => UplcProgramV3I
 *   withAlt: (alt: UplcProgramV3I) => UplcProgramV3I
 * }} UplcProgramV3I
 */

/**
 * @typedef {UplcProgramV1I | UplcProgramV2I | UplcProgramV3I} UplcProgram
 */

/**
 * @param {ByteArrayLike} bytes
 * @param {UplcVersion} expectedUplcVersion
 * @param {Builtin[]} builtins
 * @returns {UplcTerm}
 */
export function decodeCborProgram(bytes, expectedUplcVersion, builtins) {
    const stream = ByteStream.from(bytes)

    if (!isBytes(stream)) {
        throw new Error("unexpected")
    }

    let scriptBytes = decodeBytes(stream)

    if (isBytes(scriptBytes)) {
        scriptBytes = decodeBytes(scriptBytes)
    }

    return decodeFlatProgram(scriptBytes, expectedUplcVersion, builtins)
}

/**
 * TODO: investigate if the double envelope is still necessary
 * @param {UplcTerm} expr
 * @param {UplcVersion} uplcVersion
 * @returns {number[]}
 */
export function encodeCborProgram(expr, uplcVersion) {
    return encodeBytes(encodeBytes(encodeFlatProgram(expr, uplcVersion)))
}

/**
 * @param {UplcTerm} expr
 * @param {UplcVersion} uplcVersion
 * @returns {number[]}
 */
export function encodeFlatProgram(expr, uplcVersion) {
    const w = new FlatWriter()

    uplcVersion.split(".").forEach((v) => w.writeInt(BigInt(v)))

    expr.toFlat(w)

    return w.finalize()
}

/**
 * @param {number[]} bytes
 * @param {UplcVersion} expectedUplcVersion
 * @param {Builtin[]} builtins
 * @returns {UplcTerm}
 */
export function decodeFlatProgram(bytes, expectedUplcVersion, builtins) {
    const r = new UplcReader(bytes, builtins)

    const version = `${r.readInt()}.${r.readInt()}.${r.readInt()}`

    if (version != expectedUplcVersion) {
        throw new Error(
            `uplc version mismatch, expected ${expectedUplcVersion}, got ${version}`
        )
    }

    const root = r.readExpr()

    return root
}

/**
 * @param {Builtin[]} builtins
 * @param {UplcTerm} expr
 * @param {Option<UplcValue[]>} args
 * @param {Object} options
 * @param {CostModel} options.costModel
 * @param {UplcLoggingI} [options.logOptions]
 * @returns {CekResult}
 */
export function evalProgram(builtins, expr, args, { costModel, logOptions }) {
    if (args) {
        if (args.length == 0) {
            expr = new UplcForce(expr)
        } else {
            for (let arg of args) {
                expr = new UplcCall(expr, new UplcConst(arg))
            }
        }
    }

    const machine = new CekMachine(expr, builtins, costModel, logOptions)

    return machine.eval()
}

/**
 * @param {UplcProgram} program
 * @returns {number[]}
 */
export function hashProgram(program) {
    const innerBytes = encodeBytes(program.toFlat())

    innerBytes.unshift(program.plutusVersionTag)

    // used for both script addresses and minting policy hashes
    return blake2b(innerBytes, 28)
}
