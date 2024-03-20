import { decodeConstr, encodeConstr } from "@helios-lang/cbor"
import { ByteStream } from "@helios-lang/codec-utils"
import { isSome, None } from "@helios-lang/type-utils"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
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
     * @param {UplcData} data
     * @param {Option<number>} tag
     * @param {Option<number>} nFields
     * @returns {asserts data is ConstrData}
     */
    static assert(data, tag = None, nFields = None) {
        if (data instanceof ConstrData) {
            if (isSome(tag) && data.tag != tag) {
                throw new Error(
                    `expected ConstrData with tag ${tag}, got tag ${data.tag}`
                )
            }

            if (isSome(nFields) && data.length != nFields) {
                throw new Error(
                    `expected ConstrData with ${nFields} fields, got ${data.length} fields`
                )
            }
        } else {
            throw new Error(`expected ConstrData, got ${data.toString()}`)
        }
    }

    /**
     * @param {UplcData} data
     * @returns {ConstrData}
     */
    static expect(data, msg = `expected ConstrData, got ${data.toString()}`) {
        if (data instanceof ConstrData) {
            return data
        } else {
            throw new Error(msg)
        }
    }

    /**
     * @param {ByteArrayLike} bytes
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
     * @param {number} n
     * @returns {ConstrData}
     */
    expectFields(
        n,
        msg = `expected ${n} ConstrData fields, got ${this.length} fields`
    ) {
        if (n != this.length) {
            throw new Error(msg)
        } else {
            return this
        }
    }

    /**
     * @param {number} tag
     * @param {string} msg
     * @returns {ConstrData}
     */
    expectTag(tag, msg = `expected ConstrData tag ${tag}, got ${this.tag}`) {
        if (this.tag != tag) {
            throw new Error(msg)
        } else {
            return this
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
