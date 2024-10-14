import { decodeUtf8, encodeUtf8 } from "@helios-lang/codec-utils"
import { expectByteArrayData, makeByteArrayData } from "./ByteArrayData.js"

/**
 * @typedef {import("./UplcData.js").ByteArrayData} ByteArrayData
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 *
 * @param {string} str
 * @returns {ByteArrayData}
 */
export function stringToUplcData(str) {
    return makeByteArrayData(encodeUtf8(str))
}

/**
 * @param {UplcData} data
 * @returns {string}
 */
export function uplcDataToString(data) {
    return decodeUtf8(expectByteArrayData(data).bytes)
}
