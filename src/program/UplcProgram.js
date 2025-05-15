import { decodeBytes, encodeBytes, isBytes } from "@helios-lang/cbor"
import { makeByteStream } from "@helios-lang/codec-utils"
import { blake2b } from "@helios-lang/crypto"
import { makeCekMachine } from "../cek/index.js"
import { makeFlatReader, makeFlatWriter } from "../flat/index.js"
import {
    decodeTerm,
    encodeTerm,
    makeUplcApply,
    makeUplcConst,
    makeUplcForce
} from "../terms/index.js"
import { dispatchValueReader } from "../values/index.js"

/**
 * @import { BytesLike } from "@helios-lang/codec-utils"
 * @import {
 *   Builtin,
 *   CekResult,
 *   CostModel,
 *   FlatReader,
 *   UplcLogger,
 *   UplcProgram,
 *   UplcTerm,
 *   UplcValue,
 *   UplcVersion
 * } from "../index.js"
 */

/**
 * Reused by some Uplc unit tests
 * @param {number[] | Uint8Array} bytes
 * @returns {FlatReader}
 */
function makeDefaultFlatReader(bytes) {
    return makeFlatReader({
        bytes,
        readExpr: (_r) => {
            throw new Error("deprecated")
        }, // This field will be removed upon the next major release
        dispatchValueReader
    })
}

/**
 * @param {BytesLike} bytes
 * @param {UplcVersion} expectedUplcVersion
 * @param {Builtin[]} builtins
 * @returns {UplcTerm}
 */
export function decodeCborProgram(bytes, expectedUplcVersion, builtins) {
    const stream = makeByteStream(bytes)

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

    encodeTerm(expr, w)

    return w.finalize()
}

/**
 * @param {number[]} bytes
 * @param {UplcVersion} expectedUplcVersion
 * @param {Builtin[]} builtins
 * @returns {UplcTerm}
 */
export function decodeFlatProgram(bytes, expectedUplcVersion, builtins) {
    const r = makeDefaultFlatReader(bytes)

    const version = `${r.readInt()}.${r.readInt()}.${r.readInt()}`

    if (version != expectedUplcVersion) {
        throw new Error(
            `uplc version mismatch, expected ${expectedUplcVersion}, got ${version}`
        )
    }

    const root = decodeTerm(r, builtins)

    return root
}

/**
 * @param {Builtin[]} builtins
 * @param {UplcTerm} expr
 * @param {UplcValue[] | undefined} args
 * @param {object} options
 * @param {CostModel} options.costModel
 * @param {UplcLogger} [options.logOptions]
 * @returns {CekResult}
 */
export function evalProgram(builtins, expr, args, { costModel, logOptions }) {
    if (args) {
        if (args.length == 0) {
            expr = makeUplcForce({
                arg: expr
            })
        } else {
            for (let arg of args) {
                expr = makeUplcApply({
                    fn: expr,
                    arg: makeUplcConst({ value: arg })
                })
            }
        }
    }

    const machine = makeCekMachine(expr, builtins, costModel, logOptions)

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
