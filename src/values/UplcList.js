import { UplcType } from "./UplcType.js"

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("../flat/index.js").FlatReaderI<TExpr, TValue>} FlatReaderI
 */

/**
 * @template T
 * @typedef {import("../flat/index.js").ValueReader<T>} ValueReader<t>
 */

/**
 * @typedef {import("../flat/index.js").FlatWriterI} FlatWriterI
 * @typedef {import("./UplcValue.js").UplcListI} UplcListI
 * @typedef {import("./UplcValue.js").UplcTypeI} UplcTypeI
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Plutus-core list value class.
 * Only used during evaluation.
 * @implements {UplcListI}
 */
export class UplcList {
    /**
     * @readonly
     * @type {UplcTypeI}
     */
    itemType

    /**
     * @readonly
     * @type {UplcValue[]}
     */
    items

    /**
     * @param {UplcTypeI} itemType
     * @param {UplcValue[]} items
     */
    constructor(itemType, items) {
        this.itemType = itemType
        this.items = items
    }

    /**
     * @type {"list"}
     */
    get kind() {
        return "list"
    }

    /**
     * @param {FlatReaderI<any, UplcValue>} r
     * @param {UplcTypeI} itemType
     * @param {ValueReader<UplcValue>} itemReader
     * @returns {UplcList}
     */
    static fromFlat(r, itemType, itemReader) {
        /**
         * @type {UplcValue[]}
         */
        const items = []

        while (r.readBool()) {
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
     * @returns {UplcTypeI}
     */
    get type() {
        return UplcType.list(this.itemType)
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
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return (
            other.kind == "list" &&
            this.items.length == other.items.length &&
            this.items.every((item, i) => item.isEqual(other.items[i]))
        )
    }

    /**
     * @param {FlatWriterI} w
     */
    toFlat(w) {
        w.writeList(this.items)
    }

    /**
     * @returns {string}
     */
    toString() {
        return `[${this.items.map((item) => item.toString()).join(", ")}]`
    }
}
