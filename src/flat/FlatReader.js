import { BitReader } from "@helios-lang/codec-utils"
import { decodeFlatBytes } from "./bytes.js"
import { decodeFlatInt } from "./int.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BitReaderI} BitReaderI
 */

/**
 * @template T
 * @typedef {import("./ValueReader.js").ValueReader<T>} ValueReader
 */

/**
 * @template TExpr
 * @template TValue
 * @typedef {{
 *   readBool(): boolean
 *   readBuiltinId(): number
 *   readBytes(): number[]
 *   readInt(): bigint
 *   readTag(): number
 *   readLinkedList(elemSize: number): number[]
 *   readValue(): TValue
 *   readExpr(): TExpr
 * }} FlatReaderI
 */

/**
 * @template TExpr
 * @template TValue
 * @implements {FlatReaderI<TExpr, TValue>}
 */
export class FlatReader {
    /**
     * @readonly
     * @type {() => TExpr}
     */
    readExpr

    /**
     * @private
     * @readonly
     * @type {BitReaderI}
     */
    _bitReader

    /**
     * @private
     * @readonly
     * @type {(r: FlatReaderI<any, any>, typeList: number[]) => ValueReader<TValue>}
     */
    _dispatchValueReader

    /**
     * @param {number[] | Uint8Array} bytes
     * @param {(r: FlatReaderI<any, any>) => TExpr} readExpr
     * @param {(r: FlatReaderI<any, any>, typeList: number[]) => ValueReader<TValue>} dispatchValueReader
     */
    constructor(bytes, readExpr, dispatchValueReader) {
        this.readExpr = () => readExpr(this)
        this._bitReader = new BitReader(bytes)
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
     * @returns {TValue}
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
