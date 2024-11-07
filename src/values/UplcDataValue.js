import { decodeUplcData } from "../data/index.js"
import { bytesFlatSize } from "../flat/index.js"
import { DATA_TYPE } from "./UplcType.js"

/**
 * @import { FlatReader, FlatWriter, UplcData, UplcDataValue, UplcType, UplcValue } from "src/index.js"
 */

/**
 * @param {UplcData} args
 * @returns {UplcDataValue}
 */
export function makeUplcDataValue(args) {
    return new UplcDataValueImpl(args)
}

/**
 * @param {FlatReader} r
 * @returns {UplcDataValue}
 */
export function decodeUplcDataValueFromFlat(r) {
    const bytes = r.readBytes()
    const data = decodeUplcData(bytes)
    return new UplcDataValueImpl(data)
}

/**
 * @param {UplcDataValue | UplcData} data
 * @returns {UplcData}
 */
export function unwrapUplcDataValue(data) {
    if (data.kind == "data") {
        return data.value
    } else {
        return data
    }
}

/**
 * `UplcValue` that wraps a `UplcData` instance.
 * @implements {UplcDataValue}
 */
class UplcDataValueImpl {
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
        return DATA_TYPE
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return other.kind == "data" && other.value.isEqual(this.value)
    }

    /**
     * @param {FlatWriter} w
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
