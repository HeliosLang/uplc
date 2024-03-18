import { FlatReader, FlatWriter } from "../../flat/index.js"
import { UplcType } from "./UplcType.js"

/**
 * @template T
 * @typedef {import("../../flat/index.js").ValueReader<T>} ValueReader<t>
 */

/**
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Plutus-core list value class.
 * Only used during evaluation.
 * @implements {UplcValue}
 */
export class UplcList {
    /**
     * @readonly
     * @type {UplcType}
     */
    itemType

    /**
     * @readonly
     * @type {UplcValue[]}
     */
    items

    /**
     * @param {UplcType} itemType
     * @param {UplcValue[]} items
     */
    constructor(itemType, items) {
        this.itemType = itemType
        this.items = items
    }

    /**
     *
     * @param {FlatReader} r
     * @param {UplcType} itemType
     * @param {ValueReader<UplcValue>} itemReader
     * @returns {UplcList}
     */
    static fromFlat(r, itemType, itemReader) {
        /**
         * @type {UplcValue[]}
         */
        const items = []

        while (r.readBits(1) == 1) {
            items.push(itemReader())
        }

        return new UplcList(itemType, items)
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
        let sum = 0

        for (let item of this.items) {
            sum += item.memSize
        }

        return sum
    }

    /**
     * 10 + nItemType type bits, value bits of each item (must be corrected by itemType)
     * @type {number}
     */
    get flatSize() {
        const nItemType = this.itemType.typeBits.length

        return (
            10 +
            nItemType +
            this.items.reduce(
                (prev, item) => item.flatSize - nItemType + prev,
                0
            )
        )
    }

    /**
     * 7 (5) (type bits of content)
     * @returns {string}
     */
    get typeBits() {
        return ["0111", "0101", this.itemType.typeBits].join("1")
    }

    /**
     * @returns {boolean}
     */
    isDataList() {
        return this.itemType.isData()
    }

    /**
     * @returns {boolean}
     */
    isDataMap() {
        return this.itemType.isDataPair()
    }

    /**
     * @returns {string}
     */
    toString() {
        return `[${this.items.map((item) => item.toString()).join(", ")}]`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeList(this.items)
    }
}
