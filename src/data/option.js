import { None } from "@helios-lang/type-utils"
import { ConstrData } from "./ConstrData.js"

/**
 * @typedef {import("./UplcData.js").UplcData} UplcData
 * @typedef {import("./UplcData.js").ConstrDataI} ConstrDataI
 */

/**
 * @param {UplcData} data
 * @param {boolean} strict
 * @returns {Option<UplcData>}
 */
export function decodeOptionData(data, strict = false) {
    ConstrData.assert(data)

    switch (data.tag) {
        case 0:
            if (
                data.fields.length == 0 ||
                (strict && data.fields.length != 1)
            ) {
                throw new Error(
                    `expected 1 Option ConstrData field, got ${data.fields.length} fields`
                )
            }

            return data.fields[0]
        case 1:
            if (strict && data.fields.length != 0) {
                throw new Error(
                    `expected 0 Option ConstrData fields, got ${data.fields.length} fields`
                )
            }

            return None
        default:
            if (strict) {
                throw new Error(
                    `expected 0 or 1 for Option ConstrData tag, got ${data.tag}`
                )
            }

            return None
    }
}

/**
 * @param {Option<UplcData>} data
 * @returns {ConstrDataI}
 */
export function encodeOptionData(data) {
    if (data) {
        return new ConstrData(0, [data])
    } else {
        return new ConstrData(1, [])
    }
}
