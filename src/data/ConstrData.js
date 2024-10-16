import { decodeConstr, encodeConstr } from "@helios-lang/cbor"
import { toInt } from "@helios-lang/codec-utils"
import { isSome, None } from "@helios-lang/type-utils"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("@helios-lang/codec-utils").ByteStream} ByteStream
 * @typedef {import("@helios-lang/codec-utils").IntLike} IntLike
 * @typedef {import("./UplcData.js").ConstrData} ConstrData
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * @param {{tag: number, fields: UplcData[]}} args
 * @returns {ConstrData}
 */
export function makeConstrData(args) {
    return new ConstrDataImpl(args.tag, args.fields)
}

/**
 * @param {UplcData} data
 * @param {Option<number>} tag
 * @param {Option<number>} nFields
 * @returns {asserts data is ConstrData}
 */
export function assertConstrData(data, tag = None, nFields = None) {
    if (data.kind == "constr") {
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
 * @param {BytesLike} bytes
 * @param {(bytes: ByteStream) => UplcData} itemDecoder
 * @returns {ConstrData}
 */
export function decodeConstrData(bytes, itemDecoder) {
    const [tag, fields] = decodeConstr(bytes, itemDecoder)
    return makeConstrData({ tag, fields })
}

/**
 * Represents a tag index and a list of `UplcData` fields.
 * @implements {ConstrData}
 */
class ConstrDataImpl {
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
     * @param {IntLike} tag
     * @param {UplcData[]} fields
     */
    constructor(tag, fields) {
        this.tag = toInt(tag)
        this.fields = fields
    }

    /**
     * @type {"constr"}
     */
    get kind() {
        return "constr"
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
    isEqual(other) {
        if (other.kind == "constr") {
            if (this.tag == other.tag && this.length == other.length) {
                return this.fields.every((f, i) => f.isEqual(other.fields[i]))
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
     * @returns {number[]}
     */
    toCbor() {
        return encodeConstr(this.tag, this.fields)
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
     * @returns {string}
     */
    toString() {
        let parts = this.fields.map((field) => field.toString())
        return `${this.tag.toString()}{${parts.join(", ")}}`
    }
}
