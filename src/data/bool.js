import { ConstrData } from "./ConstrData.js"

/**
 * @typedef {import("./UplcData.js").UplcData} UplcData
 * @typedef {import("./UplcData.js").ConstrDataI} ConstrDataI
 */

/**
 * @param {UplcData} data
 * @param {boolean} strict - if `false` just check if ConstrData tag is 1 or not
 * @returns {boolean}
 */
export function decodeBoolData(data, strict = false) {
    ConstrData.assert(data)

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

/**
 *
 * @param {boolean} b
 * @returns {ConstrDataI}
 */
export function encodeBoolData(b) {
    return new ConstrData(b ? 1 : 0, [])
}
