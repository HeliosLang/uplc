import {
    ByteArrayData,
    ConstrData,
    IntData,
    ListData,
    MapData,
    decodeUplcData
} from "../data/index.js"
import { FlatReader, FlatWriter, bytesFlatSize } from "../flat/index.js"
import { UplcType } from "./UplcType.js"

/**
 * @typedef {import("../data/index.js").UplcData} UplcData
 */

/**
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * `UplcValue` that wraps a `UplcData` instance.
 * @implements {UplcValue}
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
     * @param {FlatReader<any, UplcValue>} r
     * @returns {UplcDataValue}
     */
    static fromFlat(r) {
        const bytes = r.readBytes()
        const data = decodeUplcData(bytes)
        return new UplcDataValue(data)
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
     * @returns {UplcType}
     */
    get type() {
        return UplcType.data()
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return other instanceof UplcDataValue && other.value.isEqual(this.value)
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
            if (data instanceof ByteArrayData) {
                return `B ${data.toString()}`
            } else if (data instanceof IntData) {
                return `I ${data.toString()}`
            } else if (data instanceof ConstrData) {
                return `Constr ${data.tag} [${data.fields
                    .map((field) => dataToString(field))
                    .join(", ")}]`
            } else if (data instanceof ListData) {
                return `List [${data.items
                    .map((item) => dataToString(item))
                    .join(", ")}]`
            } else if (data instanceof MapData) {
                return `Map[${data.items
                    .map(
                        ([first, second]) =>
                            `(${dataToString(first)}, ${dataToString(second)})`
                    )
                    .join(", ")}]`
            } else {
                throw new Error("unhandled UplcData type")
            }
        }

        return `(${dataToString(this.value)})`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeBytes(this.value.toCbor())
    }

    /**
     * @param {UplcDataValue | UplcData} data
     * @returns {UplcData}
     */
    static unwrap(data) {
        if (data instanceof UplcDataValue) {
            return data.value
        } else {
            return data
        }
    }
}
