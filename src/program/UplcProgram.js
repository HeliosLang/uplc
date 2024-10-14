import { decodeBytes, encodeBytes, isBytes } from "@helios-lang/cbor"
import { makeByteStream } from "@helios-lang/codec-utils"
import { blake2b } from "@helios-lang/crypto"
import { CekMachine } from "../cek/index.js"
import { makeFlatWriter } from "../flat/index.js"
import {
    makeUplcCall,
    makeUplcConst,
    makeUplcForce,
    makeUplcReader
} from "../terms/index.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../cek/index.js").CekResult} CekResult
 * @typedef {import("../cek/index.js").CekTerm} CekTerm
 * @typedef {import("../costmodel/index.js").CostModel} CostModel
 * @typedef {import("../logging/UplcLogger.js").UplcLogger} UplcLogger
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
 *      logOptions?: UplcLogger,
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
 *   alt: Option<UplcProgramV1>
 *   apply: (args: UplcValue[]) => UplcProgramV1
 *   withAlt: (alt: UplcProgramV1) => UplcProgramV1
 * }} UplcProgramV1
 */

/**
 * @typedef {CommonUplcProgramProps & {
 *   plutusVersion: "PlutusScriptV2"
 *   plutusVersionTag: 2
 *   uplcVersion: "1.0.0"
 *   alt: Option<UplcProgramV2>
 *   apply: (args: UplcValue[]) => UplcProgramV2
 *   withAlt: (alt: UplcProgramV2) => UplcProgramV2
 * }} UplcProgramV2
 */

/**
 * @typedef {CommonUplcProgramProps & {
 *   plutusVersion: "PlutusScriptV3"
 *   plutusVersionTag: 3
 *   uplcVersion: "1.1.0"
 *   alt: Option<UplcProgramV3>
 *   apply: (args: UplcValue[]) => UplcProgramV3
 *   withAlt: (alt: UplcProgramV3) => UplcProgramV3
 * }} UplcProgramV3
 */

/**
 * @typedef {UplcProgramV1 | UplcProgramV2 | UplcProgramV3} UplcProgram
 */

/**
 * @param {BytesLike} bytes
 * @param {UplcVersion} expectedUplcVersion
 * @param {Builtin[]} builtins
 * @returns {UplcTerm}
 */
export function decodeCborProgram(bytes, expectedUplcVersion, builtins) {
    const stream = makeByteStream({ bytes })

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
    const w = makeFlatWriter()

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
    const r = makeUplcReader({ bytes, builtins })

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
 * @param {object} options
 * @param {CostModel} options.costModel
 * @param {UplcLogger} [options.logOptions]
 * @returns {CekResult}
 */
export function evalProgram(builtins, expr, args, { costModel, logOptions }) {
    if (args) {
        if (args.length == 0) {
            expr = makeUplcForce({ arg: expr })
        } else {
            for (let arg of args) {
                expr = makeUplcCall({
                    fn: expr,
                    arg: makeUplcConst({ value: arg })
                })
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
