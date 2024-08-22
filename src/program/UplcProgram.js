import { decodeBytes, encodeBytes, isBytes } from "@helios-lang/cbor"
import { ByteStream } from "@helios-lang/codec-utils"
import { blake2b } from "@helios-lang/crypto"
import { CekMachine } from "../cek/index.js"
import { CostModel } from "../costmodel/index.js"
import { FlatWriter } from "../flat/index.js"
import { UplcCall, UplcConst, UplcForce, UplcReader } from "../terms/index.js"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../cek/index.js").CekResult} CekResult
 * @typedef {import("../terms/index.js").UplcTerm} UplcTerm
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * @typedef {"1.0.0" | "1.1.0"} UplcVersion
 * @typedef {"PlutusScriptV1" | "PlutusScriptV2"} PlutusVersion
 * @typedef {1 | 2} PlutusVersionTag
 */

/**
 * @typedef {{
 *   alt: Option<UplcProgram>
 *   plutusVersion: PlutusVersion
 *   plutusVersionTag: PlutusVersionTag
 *   uplcVersion: UplcVersion
 *   eval: (args: undefined | UplcValue[]) => CekResult
 *   hash: () => number[]
 *   toCbor: () => number[]
 *   toFlat: () => number[]
 *   toString: () => string
 *   withAlt: (alt: UplcProgram) => UplcProgram
 * }} UplcProgram
 */

/**
 * @param {ByteArrayLike} bytes
 * @param {UplcVersion} expectedUplcVersion
 * @returns {UplcTerm}
 */
export function decodeCborProgram(bytes, expectedUplcVersion) {
    const stream = ByteStream.from(bytes)

    if (!isBytes(stream)) {
        throw new Error("unexpected")
    }

    let scriptBytes = decodeBytes(stream)

    if (isBytes(scriptBytes)) {
        scriptBytes = decodeBytes(scriptBytes)
    }

    return decodeFlatProgram(scriptBytes, expectedUplcVersion)
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
 * @returns {UplcTerm}
 */
export function decodeFlatProgram(bytes, expectedUplcVersion) {
    const r = new UplcReader(bytes)

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
 * @param {CostModel} costModel
 * @param {UplcTerm} expr
 * @param {undefined | UplcValue[]} args
 * @returns {CekResult}
 */
export function evalProgram(builtins, costModel, expr, args) {
    if (args) {
        if (args.length == 0) {
            expr = new UplcForce(expr)
        } else {
            for (let arg of args) {
                expr = new UplcCall(expr, new UplcConst(arg))
            }
        }
    }

    const machine = new CekMachine(expr, builtins, costModel)

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
