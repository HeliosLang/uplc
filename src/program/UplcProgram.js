import {
    decodeBytes,
    decodeObjectIKey,
    decodeTuple,
    encodeBytes,
    encodeObjectIKey,
    encodeTuple,
    isBytes,
    isTuple
} from "@helios-lang/cbor"
import { makeByteStream } from "@helios-lang/codec-utils"
import { blake2b } from "@helios-lang/crypto"
import { CekMachine } from "../cek/index.js"
import { makeFlatReader, makeFlatWriter } from "../flat/index.js"
import {
    decodeTerm,
    encodeTerm,
    makeUplcCall,
    makeUplcConst,
    makeUplcForce
} from "../terms/index.js"
import { dispatchValueReader } from "../values/index.js"
import {
    decodeUplcSourceMap,
    encodeUplcSourceMap,
    makeUplcSourceMap
} from "./UplcSourceMap.js"

/**
 * @import { BytesLike, ByteStream } from "@helios-lang/codec-utils"
 * @import {
 *   Builtin,
 *   CekResult,
 *   CostModel,
 *   FlatReader,
 *   UplcLogger,
 *   UplcProgram,
 *   UplcSourceMapJsonSafe,
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
 * @param {unknown} v
 * @returns {v is UplcVersion}
 */
export function isUplcVersion(v) {
    return v == "1.0.0" || v == "1.1.0"
}

/**
 * @param {BytesLike} bytes
 * @returns {UplcVersion}
 */
export function decodeCborVersion(bytes) {
    const stream = makeByteStream(bytes).copy()

    if (!isBytes(stream)) {
        throw new Error("unexpected")
    }

    let scriptBytes = decodeBytes(stream)

    if (isBytes(scriptBytes)) {
        scriptBytes = decodeBytes(scriptBytes)
    }

    return decodeFlatVersion(scriptBytes)
}

/**
 * @param {number[]} bytes
 * @returns {UplcVersion}
 */
export function decodeFlatVersion(bytes) {
    const r = makeDefaultFlatReader(bytes)

    const version = `${r.readInt()}.${r.readInt()}.${r.readInt()}`

    if (!isUplcVersion(version)) {
        throw new Error(`unhandled UplcVersion ${version}`)
    }

    return version
}

/**
 * @param {UplcProgram} program
 * @returns {number[]}
 */
export function encodeFullUplcProgram(program) {
    const sourceMap = makeUplcSourceMap({ term: program.root })

    if (program.alt) {
        const altSourceMap = makeUplcSourceMap({ term: program.alt.root })

        // use a map format for optional entries
        if (altSourceMap.indices.length > 0) {
            return encodeTuple([
                program.toCbor(),
                encodeObjectIKey({
                    0: encodeUplcSourceMap(sourceMap),
                    1: program.alt.toCbor(),
                    2: encodeUplcSourceMap(altSourceMap)
                })
            ])
        } else {
            return encodeTuple([
                program.toCbor(),
                encodeObjectIKey({
                    0: encodeUplcSourceMap(sourceMap),
                    1: program.alt.toCbor()
                })
            ])
        }
    } else if (sourceMap.indices.length > 0) {
        return encodeTuple([
            program.toCbor(),
            encodeObjectIKey({
                0: encodeUplcSourceMap(sourceMap)
            })
        ])
    } else {
        return program.toCbor()
    }
}

/**
 * @param {BytesLike} bytes
 * @param {(s: ByteStream) => UplcTerm} decodeRoot
 * @returns {[UplcTerm, UplcSourceMapJsonSafe | undefined, UplcTerm | undefined, UplcSourceMapJsonSafe | undefined]}
 */
export function decodeFullUplcProgram(bytes, decodeRoot) {
    const stream = makeByteStream(bytes)

    if (isBytes(stream)) {
        return [decodeRoot(stream), undefined, undefined, undefined]
    } else if (isTuple(stream)) {
        const [root, { 0: sourceMap, 1: altRoot, 2: altSourceMap }] =
            decodeTuple(stream, [
                decodeRoot,
                (s) =>
                    decodeObjectIKey(s, {
                        0: (s) => decodeUplcSourceMap(s),
                        1: decodeRoot,
                        2: (s) => decodeUplcSourceMap(s)
                    })
            ])

        return [
            root,
            sourceMap?.toJsonSafe(),
            altRoot,
            altSourceMap?.toJsonSafe()
        ]
    } else {
        throw new Error("unexpected")
    }
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
