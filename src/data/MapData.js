import { decodeMap, encodeMap } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("@helios-lang/codec-utils").ByteStream} ByteStream
 * @typedef {import("./UplcData.js").MapData} MapData
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * @param {[UplcData, UplcData][]} items
 * @returns {MapData}
 */
export function makeMapData(items) {
    return new MapDataImpl(items)
}

/**
 * @param {UplcData} data
 * @returns {asserts data is MapData}
 */
export function assertMapData(data) {
    if (data.kind != "map") {
        throw new Error(`expected MapData, got ${data.toString()}`)
    }
}

/**
 * @param {BytesLike} bytes
 * @param {(bytes: ByteStream) => UplcData} itemDecoder
 * @returns {MapData}
 */
export function decodeMapData(bytes, itemDecoder) {
    const items = decodeMap(bytes, itemDecoder, itemDecoder)
    return new MapDataImpl(items)
}

/**
 * @param {UplcData} data
 * @param {string} msg
 * @returns {MapData}
 */
export function expectMapData(
    data,
    msg = `expected MapData, got ${data.toString()}`
) {
    if (data.kind == "map") {
        return data
    } else {
        throw new Error(msg)
    }
}

/**
 * Represents a list of pairs of other `UplcData` instances.
 * @implements {MapData}
 */
class MapDataImpl {
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
     * @type {"map"}
     */
    get kind() {
        return "map"
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
    isEqual(other) {
        if (other.kind == "map") {
            if (this.length == other.length) {
                return this.items.every(([key, value], i) => {
                    const [otherKey, otherValue] = other.items[i]
                    return key.isEqual(otherKey) && value.isEqual(otherValue)
                })
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
        return encodeMap(this.items)
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
     * @returns {string}
     */
    toString() {
        return `{${this.items
            .map(([fst, snd]) => `${fst.toString()}: ${snd.toString()}`)
            .join(", ")}}`
    }
}
