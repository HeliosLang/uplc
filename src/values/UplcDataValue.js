import { decodeUplcData } from "../data/index.js"
import { bytesFlatSize } from "../flat/index.js"
import { UplcType } from "./UplcType.js"

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("../flat/index.js").FlatReaderI<TExpr, TValue>} FlatReaderI
 */

/**
 * @typedef {import("../data/index.js").UplcData} UplcData
 * @typedef {import("../flat/index.js").FlatWriterI} FlatWriterI
 * @typedef {import("./UplcValue.js").UplcDataValueI} UplcDataValueI
 * @typedef {import("./UplcValue.js").UplcTypeI} UplcTypeI
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * `UplcValue` that wraps a `UplcData` instance.
 * @implements {UplcDataValueI}
 */
export class UplcDataValue {
    /**
     * @readonly
     * @type {UplcData}
     */
    value

    /**
     * @param {UplcData} data
     */
    constructor(data) {
        this.value = data
    }

    /**
     * @type {"data"}
     */
    get kind() {
        return "data"
    }

    /**
     * @param {FlatReaderI<any, UplcValue>} r
     * @returns {UplcDataValue}
     */
    static fromFlat(r) {
        const bytes = r.readBytes()
        const data = decodeUplcData(bytes)
        return new UplcDataValue(data)
    }

    /**
     * @param {UplcDataValueI | UplcData} data
     * @returns {UplcData}
     */
    static unwrap(data) {
        if (data.kind == "data") {
            return data.value
        } else {
            return data
        }
    }

    /**
     * @type {number}
     */
    get memSize() {
        return this.value.memSize
    }

    /**
     * Same number of header bits as UplcByteArray
     * @type {number}
     */
    get flatSize() {
        const bytes = this.value.toCbor()
        return bytesFlatSize(bytes.length)
    }

    /**
     * @returns {UplcTypeI}
     */
    get type() {
        return UplcType.data()
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return other.kind == "data" && other.value.isEqual(this.value)
    }

    /**
     * @param {FlatWriterI} w
     */
    toFlat(w) {
        w.writeBytes(this.value.toCbor())
    }

    /**
     * @returns {string}
     */
    toString() {
        /**
         * Differs from the internal UplcData.toString() representation
         * @param {UplcData} data
         * @returns {string}
         */
        function dataToString(data) {
            switch (data.kind) {
                case "bytes":
                    return `B ${data.toString()}`
                case "int":
                    return `I ${data.toString()}`
                case "constr":
                    return `Constr ${data.tag} [${data.fields
                        .map((field) => dataToString(field))
                        .join(", ")}]`
                case "list":
                    return `List [${data.items
                        .map((item) => dataToString(item))
                        .join(", ")}]`
                case "map":
                    return `Map[${data.items
                        .map(
                            ([first, second]) =>
                                `(${dataToString(first)}, ${dataToString(
                                    second
                                )})`
                        )
                        .join(", ")}]`
                default:
                    throw new Error("unhandled UplcData type")
            }
        }

        return `(${dataToString(this.value)})`
    }
}
