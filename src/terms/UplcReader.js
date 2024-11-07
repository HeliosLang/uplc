import { makeFlatReader } from "../flat/index.js"
import { dispatchValueReader } from "../values/index.js"
import { decodeTerm } from "./decode.js"

/**
 * @import { Builtin, FlatReader, UplcTerm, UplcValue } from "src/index.js"
 */

/**
 * @typedef {FlatReader & {
 *   builtins: Builtin[]
 * }} UplcReader
 */

/**
 * @param {{
 *   bytes: number[] | Uint8Array
 *   builtins: Builtin[]
 * }} args
 * @returns {UplcReader}
 */
export function makeUplcReader(args) {
    return new UplcReaderImpl(args.bytes, args.builtins)
}

/**
 * @implements {UplcReader}
 */
class UplcReaderImpl {
    /**
     * this.builtins is used to get the name of a builtin using only its id
     * @readonly
     * @type {Builtin[]}
     */
    builtins

    /**
     * @private
     * @readonly
     * @type {FlatReader}
     */
    _reader

    /**
     * @param {number[] | Uint8Array} bytes
     * @param {Builtin[]} builtins
     */
    constructor(bytes, builtins) {
        this.builtins = builtins
        this._reader = makeFlatReader({
            bytes,
            readExpr: (r) => decodeTerm(r, builtins),
            dispatchValueReader
        })
    }

    /**
     * @returns {boolean}
     */
    readBool() {
        return this._reader.readBool()
    }

    /**
     * @returns {number}
     */
    readBuiltinId() {
        return this._reader.readBuiltinId()
    }

    /**
     * @returns {number[]}
     */
    readBytes() {
        return this._reader.readBytes()
    }

    /**
     * @returns {UplcTerm}
     */
    readExpr() {
        return this._reader.readExpr()
    }

    /**
     * @returns {bigint}
     */
    readInt() {
        return this._reader.readInt()
    }

    /**
     * @returns {number}
     */
    readTag() {
        return this._reader.readTag()
    }

    /**
     * Reads a Plutus-core list with a specified size per element
     * Calls itself recursively until the end of the list is reached
     * @param {number} elemSize
     * @returns {number[]}
     */
    readLinkedList(elemSize) {
        return this._reader.readLinkedList(elemSize)
    }

    /**
     * @returns {UplcValue}
     */
    readValue() {
        return this._reader.readValue()
    }
}
