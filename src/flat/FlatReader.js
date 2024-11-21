import { makeBitReader } from "@helios-lang/codec-utils"
import { decodeFlatBytes } from "./bytes.js"
import { decodeFlatInt } from "./int.js"

/**
 * @import { BitReader } from "@helios-lang/codec-utils"
 * @import { FlatReader, UplcTerm, UplcValue } from "../index.js"
 */

/**
 * @param {{
 *   bytes: number[] | Uint8Array
 *   readExpr: (r: FlatReader) => UplcTerm
 *   dispatchValueReader: (r: FlatReader, typeList: number[]) => (() => UplcValue)
 * }} args
 * @returns {FlatReader}
 */
export function makeFlatReader(args) {
    return new FlatReaderImpl(
        args.bytes,
        args.readExpr,
        args.dispatchValueReader
    )
}

/**
 * @implements {FlatReader}
 */
class FlatReaderImpl {
    /**
     * @readonly
     * @type {() => UplcTerm}
     */
    readExpr

    /**
     * @private
     * @readonly
     * @type {BitReader}
     */
    _bitReader

    /**
     * @private
     * @readonly
     * @type {(r: FlatReader, typeList: number[]) => (() => UplcValue)}
     */
    _dispatchValueReader

    /**
     * @param {number[] | Uint8Array} bytes
     * @param {(r: FlatReader) => UplcTerm} readExpr
     * @param {(r: FlatReader, typeList: number[]) => (() => UplcValue)} dispatchValueReader
     */
    constructor(bytes, readExpr, dispatchValueReader) {
        this.readExpr = () => readExpr(this)
        this._bitReader = makeBitReader({ bytes })
        this._dispatchValueReader = dispatchValueReader
    }

    /**
     * @returns {boolean}
     */
    readBool() {
        return this._bitReader.readBits(1) == 1
    }

    /**
     * @returns {number}
     */
    readBuiltinId() {
        return this._bitReader.readBits(7)
    }

    /**
     * @returns {number[]}
     */
    readBytes() {
        return decodeFlatBytes(this._bitReader)
    }

    /**
     * @returns {bigint}
     */
    readInt() {
        return decodeFlatInt(this._bitReader)
    }

    /**
     * @returns {number}
     */
    readTag() {
        return this._bitReader.readBits(4)
    }

    /**
     * Reads a Plutus-core list with a specified size per element
     * Calls itself recursively until the end of the list is reached
     * @param {number} elemSize
     * @returns {number[]}
     */
    readLinkedList(elemSize) {
        // Cons and Nil constructors come from Lisp/Haskell
        //  cons 'a' creates a linked list node,
        //  nil      creates an empty linked list
        let nilOrCons = this._bitReader.readBits(1)

        if (nilOrCons == 0) {
            return []
        } else {
            return [this._bitReader.readBits(elemSize)].concat(
                this.readLinkedList(elemSize)
            )
        }
    }

    /**
     * @returns {UplcValue}
     */
    readValue() {
        let typeList = this.readLinkedList(4)

        const valueReader = this._dispatchValueReader(this, typeList)

        if (typeList.length != 0) {
            throw new Error("did not consume all type parameters")
        }

        return valueReader()
    }
}
