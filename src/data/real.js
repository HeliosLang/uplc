import { REAL_PRECISION } from "@helios-lang/compiler-utils"
import { IntData } from "./IntData.js"

/**
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * @param {UplcData} data
 * @returns {number}
 */
export function decodeRealData(data) {
    return Number(IntData.expect(data).value) / Math.pow(10, REAL_PRECISION)
}

/**
 * @param {number} x
 * @returns {IntData}
 */
export function encodeRealData(x) {
    return new IntData(Math.round(x * Math.pow(10, REAL_PRECISION)))
}
