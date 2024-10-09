import { decodeList, encodeList } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("@helios-lang/codec-utils").ByteStreamI} ByteStreamI
 * @typedef {import("./UplcData.js").ListDataI} ListDataI
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * Represents a list of other `UplcData` instances.
 * @implements {ListDataI}
 */
export class ListData {
    /**
     * @readonly
     * @type {UplcData[]}
     */
    items

    /**
     * @param {UplcData[]} items
     */
    constructor(items) {
        this.items = items
    }

    /**
     * @type {"list"}
     */
    get kind() {
        return "list"
    }

    /**
     * @param {UplcData} data
     * @returns {asserts data is ListDataI}
     */
    static assert(data) {
        if (data.kind != "list") {
            throw new Error(`expected ListData, got ${data.toString()}`)
        }
    }

    /**
     * @param {UplcData} data
     * @param {string} msg
     * @returns {ListDataI}
     */
    static expect(data, msg = `expected ListData, got ${data.toString()}`) {
        if (data.kind == "list") {
            return data
        } else {
            throw new Error(msg)
        }
    }

    /**
     * @param {BytesLike} bytes
     * @param {(bytes: ByteStreamI) => UplcData} itemDecoder
     * @returns {ListData}
     */
    static fromCbor(bytes, itemDecoder) {
        const items = decodeList(bytes, itemDecoder)
        return new ListData(items)
    }

    /**
     * @type {number}
     */
    get length() {
        return this.items.length
    }

    /**
     * Copies the array of items
     * @type {UplcData[]}
     */
    get list() {
        return this.items.slice()
    }

    /**
     * @type {number}
     */
    get memSize() {
        let sum = UPLC_DATA_NODE_MEM_SIZE

        for (let item of this.items) {
            sum += item.memSize
        }

        return sum
    }

    /**
     * @param {UplcData} other
     * @returns {boolean}
     */
    isEqual(other) {
        if (other.kind == "list") {
            if (this.length == other.length) {
                return this.items.every((item, i) =>
                    item.isEqual(other.items[i])
                )
            } else {
                return false
            }
        } else {
            return false
        }
    }

    /**
     * @returns {number[]}
     */
    toCbor() {
        return encodeList(this.items)
    }

    /**
     * @returns {string}
     */
    toSchemaJson() {
        return `{"list":[${this.items
            .map((item) => item.toSchemaJson())
            .join(", ")}]}`
    }

    /**
     * @returns {string}
     */
    toString() {
        return `[${this.items.map((item) => item.toString()).join(", ")}]`
    }
}
