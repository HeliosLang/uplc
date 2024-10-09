import { BitWriter, padBits } from "@helios-lang/codec-utils"
import { encodeFlatBytes } from "./bytes.js"
import { encodeFlatInt } from "./int.js"
import { encodeFlatSite } from "./site.js"

/**
 * @typedef {import("./site.js").Site} Site
 */

export class FlatWriter {
    /**
     * @private
     * @readonly
     * @type {BitWriter}
     */
    _bitWriter

    constructor() {
        this._bitWriter = new BitWriter()
    }

    /**
     * @param {Site} site
     */
    writeSite(site) {
        encodeFlatSite(this._bitWriter, site)
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
     * @param {{toFlat: (w: FlatWriter) => void}[]} items
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
