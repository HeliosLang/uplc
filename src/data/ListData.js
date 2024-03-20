import { ByteStream } from "@helios-lang/codec-utils"
import { decodeList, encodeList } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * Represents a list of other `UplcData` instances.
 * @implements {UplcData}
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
     * @param {UplcData} data
     * @param {string} msg
     * @returns {ListData}
     */
    static expect(data, msg = `expected ListData, got ${data.toString()}`) {
        if (data instanceof ListData) {
            return data
        } else {
            throw new Error(msg)
        }
    }

    /**
     * @param {ByteArrayLike} bytes
     * @param {(bytes: ByteStream) => UplcData} itemDecoder
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
    equals(other) {
        if (other instanceof ListData) {
            if (this.length == other.length) {
                return this.items.every((item, i) =>
                    item.equals(other.items[i])
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
    toString() {
        return `[${this.items.map((item) => item.toString()).join(", ")}]`
    }

    /**
     * @returns {string}
     */
    toSchemaJson() {
        return `{"list":[${this.items
            .map((item) => item.toSchemaJson())
            .join(", ")}]}`
    }
}
