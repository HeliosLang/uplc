import { assertConstrData, makeConstrData } from "./ConstrData.js"

/**
 * @import { ConstrData, UplcData } from "../index.js"
 */

/**
 * @param {boolean} b
 * @returns {ConstrData}
 */
export function boolToUplcData(b) {
    return makeConstrData({ tag: b ? 1 : 0, fields: [] })
}

/**
 * @param {UplcData} data
 * @param {boolean} strict - if `false` just check if ConstrData tag is 1 or not
 * @returns {boolean}
 */
export function uplcDataToBool(data, strict = false) {
    assertConstrData(data)

    if (strict) {
        if (data.fields.length != 0) {
            throw new Error(
                `expected 0 fields in Bool ConstrData, got ${data.fields.length} fields`
            )
        }

        switch (data.tag) {
            case 0:
                return false
            case 1:
                return true
            default:
                throw new Error(
                    `expected 0 or 1 Bool ConstrData tag, ${data.tag}`
                )
        }
    } else {
        return data.tag == 1
    }
}
