import { BitReader } from "@helios-lang/codec-utils"
import { decodeFlatSite } from "./site.js"
import { decodeFlatBytes } from "./bytes.js"
import { decodeFlatInt } from "./int.js"

/**
 * @typedef {import("./site.js").Site} Site
 */

/**
 * @template T
 * @typedef {import("./ValueReader.js").ValueReader<T>} ValueReader
 */

/**
 * @template TExpr
 * @template TValue
 */
export class FlatReader extends BitReader {
    /**
     * @readonly
     * @type {() => TExpr}
     */
    readExpr

    /**
     * @private
     * @readonly
     * @type {(r: FlatReader, typeList: number[]) => ValueReader<TValue>}
     */
    dispatchValueReader

    /**
     * @param {number[] | Uint8Array} bytes
     * @param {(r: FlatReader) => TExpr} readExpr
     * @param {(r: FlatReader, typeList: number[]) => ValueReader<TValue>} dispatchValueReader
     */
    constructor(bytes, readExpr, dispatchValueReader) {
        super(bytes)
        this.readExpr = () => readExpr(this)
        this.dispatchValueReader = dispatchValueReader
    }

    /**
     * @returns {number[]}
     */
    readBytes() {
        return decodeFlatBytes(this)
    }

    /**
     * @returns {bigint}
     */
    readInt() {
        return decodeFlatInt(this)
    }

    /**
     * @returns {Site}
     */
    readSite() {
        return decodeFlatSite(this)
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
        let nilOrCons = this.readBits(1)

        if (nilOrCons == 0) {
            return []
        } else {
            return [this.readBits(elemSize)].concat(
                this.readLinkedList(elemSize)
            )
        }
    }

    /**
     * @returns {TValue}
     */
    readValue() {
        let typeList = this.readLinkedList(4)

        const valueReader = this.dispatchValueReader(this, typeList)

        if (typeList.length != 0) {
            throw new Error("did not consume all type parameters")
        }

        return valueReader()
    }
}
