import { BitWriter, padBits } from "@helios-lang/codec-utils"
import { encodeFlatBytes } from "./bytes.js"
import { encodeFlatInt } from "./int.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BitWriterI} BitWriterI
 */

/**
 * @typedef {{
 *   writeBool(b: boolean): void
 *   writeBytes(bytes: number[]): void
 *   writeInt(x: bigint): void
 *   writeList(items: {toFlat: (w: FlatWriterI) => void}[]): void
 *   writeTermTag(tag: number): void
 *   writeTypeBits(typeBits: string): void
 *   writeBuiltinId(id: number): void
 *   finalize(): number[]
 * }} FlatWriterI
 */

/**
 * @implements {FlatWriterI}
 */
export class FlatWriter {
    /**
     * @private
     * @readonly
     * @type {BitWriterI}
     */
    _bitWriter

    constructor() {
        this._bitWriter = new BitWriter()
    }

    /**
     * @param {boolean} b
     */
    writeBool(b) {
        if (b) {
            this._bitWriter.writeBits("1")
        } else {
            this._bitWriter.writeBits("0")
        }
    }

    /**
     * @param {number[]} bytes
     */
    writeBytes(bytes) {
        encodeFlatBytes(this._bitWriter, bytes)
    }

    /**
     * @param {bigint} x
     */
    writeInt(x) {
        encodeFlatInt(this._bitWriter, x)
    }

    /**
     * @param {{toFlat: (w: FlatWriterI) => void}[]} items
     */
    writeList(items) {
        items.forEach((item) => {
            this._bitWriter.writeBits("1")

            item.toFlat(this)
        })

        this._bitWriter.writeBits("0")
    }

    /**
     * @param {number} tag
     */
    writeTermTag(tag) {
        this._bitWriter.writeBits(padBits(tag.toString(2), 4))
    }

    /**
     * @param {string} typeBits
     */
    writeTypeBits(typeBits) {
        this._bitWriter.writeBits("1" + typeBits + "0")
    }

    /**
     * @param {number} id
     */
    writeBuiltinId(id) {
        this._bitWriter.writeBits(padBits(id.toString(2), 7))
    }

    /**
     * @returns {number[]}
     */
    finalize() {
        return this._bitWriter.finalize()
    }
}
