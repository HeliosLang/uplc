import { decodeMap, encodeMap } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"
import { ByteStream } from "@helios-lang/codec-utils"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * Represents a list of pairs of other `UplcData` instances.
 * @implements {UplcData}
 */
export class MapData {
    /**
     * @readonly
     * @type {[UplcData, UplcData][]}
     */
    items

    /**
     * @param {[UplcData, UplcData][]} items
     */
    constructor(items) {
        this.items = items
    }

    /**
     * @param {UplcData} data
     * @returns {asserts data is MapData}
     */
    static assert(data) {
        if (!(data instanceof MapData)) {
            throw new Error(`expected MapData, got ${data.toString()}`)
        }
    }

    /**
     * @param {UplcData} data
     * @param {string} msg
     * @returns {MapData}
     */
    static expect(data, msg = `expected MapData, got ${data.toString()}`) {
        if (data instanceof MapData) {
            return data
        } else {
            throw new Error(msg)
        }
    }

    /**
     * @param {ByteArrayLike} bytes
     * @param {(bytes: ByteStream) => UplcData} itemDecoder
     * @returns {MapData}
     */
    static fromCbor(bytes, itemDecoder) {
        const items = decodeMap(bytes, itemDecoder, itemDecoder)
        return new MapData(items)
    }

    /**
     * Copies the internal list of items
     * @type {[UplcData, UplcData][]}
     */
    get list() {
        return this.items.slice()
    }

    /**
     * @type {number}
     */
    get length() {
        return this.items.length
    }

    /**
     * @type {number}
     */
    get memSize() {
        let sum = UPLC_DATA_NODE_MEM_SIZE

        for (let [k, v] of this.items) {
            sum += k.memSize + v.memSize
        }

        return sum
    }

    /**
     * @param {UplcData} other
     * @returns {boolean}
     */
    equals(other) {
        if (other instanceof MapData) {
            if (this.length == other.length) {
                return this.items.every(([key, value], i) => {
                    const [otherKey, otherValue] = other.items[i]
                    return key.equals(otherKey) && value.equals(otherValue)
                })
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
        return `{${this.items
            .map(([fst, snd]) => `${fst.toString()}: ${snd.toString()}`)
            .join(", ")}}`
    }

    /**
     * @returns {string}
     */
    toSchemaJson() {
        return `{"map": [${this.items
            .map((pair) => {
                return (
                    '{"k": ' +
                    pair[0].toSchemaJson() +
                    ', "v": ' +
                    pair[1].toSchemaJson() +
                    "}"
                )
            })
            .join(", ")}]}`
    }

    /**
     * @returns {number[]}
     */
    toCbor() {
        return encodeMap(this.items)
    }
}
