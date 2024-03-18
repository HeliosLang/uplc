import { decodeConstr, encodeConstr } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"
import { ByteStream } from "@helios-lang/codec-utils"

/**
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * Represents a tag index and a list of `UplcData` fields.
 * @implements {UplcData}
 */
export class ConstrData {
    /**
     * @readonly
     * @type {number}
     */
    tag

    /**
     * @readonly
     * @type {UplcData[]}
     */
    fields

    /**
     * @param {number} tag
     * @param {UplcData[]} fields
     */
    constructor(tag, fields) {
        this.tag = tag
        this.fields = fields
    }

    /**
     * @param {number[] | ByteStream} bytes
     * @param {(bytes: ByteStream) => UplcData} itemDecoder
     * @returns {ConstrData}
     */
    static fromCbor(bytes, itemDecoder) {
        const [tag, fields] = decodeConstr(bytes, itemDecoder)
        return new ConstrData(tag, fields)
    }

    /**
     * @type {number}
     */
    get memSize() {
        let sum = UPLC_DATA_NODE_MEM_SIZE

        for (let field of this.fields) {
            sum += field.memSize
        }

        return sum
    }

    /**
     * Number of fields in the constr
     * @type {number}
     */
    get length() {
        return this.fields.length
    }

    /**
     * @param {UplcData} other
     * @returns {boolean}
     */
    equals(other) {
        if (other instanceof ConstrData) {
            if (this.tag == other.tag && this.length == other.length) {
                return this.fields.every((f, i) => f.equals(other.fields[i]))
            } else {
                return false
            }
        } else {
            return false
        }
    }

    /**
     * @returns {string}
     */
    toString() {
        let parts = this.fields.map((field) => field.toString())
        return `${this.tag.toString()}{${parts.join(", ")}}`
    }

    /**
     * @returns {string}
     */
    toSchemaJson() {
        return `{"constructor": ${this.tag.toString()}, "fields": [${this.fields
            .map((f) => f.toSchemaJson())
            .join(", ")}]}`
    }

    /**
     * @returns {number[]}
     */
    toCbor() {
        return encodeConstr(this.tag, this.fields)
    }
}
