import { REAL_PRECISION } from "@helios-lang/compiler-utils"
import { expectIntData, makeIntData } from "./IntData.js"

/**
 * @import { IntData, UplcData } from "../index.js"
 */

/**
 * @param {UplcData} data
 * @returns {number}
 */
export function uplcDataToReal(data) {
    return Number(expectIntData(data).value) / Math.pow(10, REAL_PRECISION)
}

/**
 * @param {number} x
 * @returns {IntData}
 */
export function realToUplcData(x) {
    return makeIntData(Math.round(x * Math.pow(10, REAL_PRECISION)))
}
