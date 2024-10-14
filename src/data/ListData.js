import { decodeList, encodeList } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("@helios-lang/codec-utils").ByteStream} ByteStream
 * @typedef {import("./UplcData.js").ListData} ListData
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * @param {UplcData[]} args
 * @returns {ListData}
 */
export function makeListData(args) {
    return new ListDataImpl(args)
}

/**
 * @param {UplcData} data
 * @returns {asserts data is ListData}
 */
export function assertListData(data) {
    if (data.kind != "list") {
        throw new Error(`expected ListData, got ${data.toString()}`)
    }
}

/**
 * @param {BytesLike} bytes
 * @param {(bytes: ByteStream) => UplcData} itemDecoder
 * @returns {ListData}
 */
export function decodeListData(bytes, itemDecoder) {
    const items = decodeList(bytes, itemDecoder)
    return new ListDataImpl(items)
}

/**
 * @param {UplcData} data
 * @param {string} msg
 * @returns {ListData}
 */
export function expectListData(
    data,
    msg = `expected ListData, got ${data.toString()}`
) {
    if (data.kind == "list") {
        return data
    } else {
        throw new Error(msg)
    }
}

/**
 * Represents a list of other `UplcData` instances.
 * @implements {ListData}
 */
class ListDataImpl {
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
