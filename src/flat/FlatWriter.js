import { BitWriter, padBits } from "@helios-lang/codec-utils"
import { encodeFlatSite } from "./site.js"
import { encodeFlatBytes } from "./bytes.js"
import { encodeFlatInt } from "./int.js"

/**
 * @typedef {import("./site.js").Site} Site
 */

export class FlatWriter {
    /**
     * @private
     * @readonly
     * @type {BitWriter}
     */
    bitWriter

    constructor() {
        this.bitWriter = new BitWriter()
    }

    /**
     * @param {Site} site
     */
    writeSite(site) {
        encodeFlatSite(this.bitWriter, site)
    }

    /**
     * @param {boolean} b
     */
    writeBool(b) {
        if (b) {
            this.bitWriter.writeBits("1")
        } else {
            this.bitWriter.writeBits("0")
        }
    }

    /**
     * @param {number[]} bytes
     */
    writeBytes(bytes) {
        encodeFlatBytes(this.bitWriter, bytes)
    }

    /**
     * @param {bigint} x
     */
    writeInt(x) {
        encodeFlatInt(this.bitWriter, x)
    }

    /**
     * @param {{toFlat: (w: FlatWriter) => void}[]} items
     */
    writeList(items) {
        items.forEach((item) => {
            this.bitWriter.writeBits("1")

            item.toFlat(this)
        })

        this.bitWriter.writeBits("0")
    }

    /**
     * @param {number} tag
     */
    writeTermTag(tag) {
        this.bitWriter.writeBits(padBits(tag.toString(2), 4))
    }

    /**
     * @param {string} typeBits
     */
    writeTypeBits(typeBits) {
        this.bitWriter.writeBits("1" + typeBits + "0")
    }

    /**
     * @param {number} id
     */
    writeBuiltinId(id) {
        this.bitWriter.writeBits(padBits(id.toString(2), 7))
    }

    /**
     * @returns {number[]}
     */
    finalize() {
        return this.bitWriter.finalize()
    }
}
