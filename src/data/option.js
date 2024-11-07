import { assertConstrData, makeConstrData } from "./ConstrData.js"

/**
 * @import { ConstrData, UplcData } from "src/index.js"
 */

/**
 * @param {UplcData} data
 * @param {boolean} strict
 * @returns {UplcData | undefined}
 */
export function unwrapUplcDataOption(data, strict = false) {
    assertConstrData(data)

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

            return undefined
        default:
            if (strict) {
                throw new Error(
                    `expected 0 or 1 for Option ConstrData tag, got ${data.tag}`
                )
            }

            return undefined
    }
}

/**
 * @param {UplcData | undefined} data
 * @returns {ConstrData}
 */
export function wrapUplcDataOption(data) {
    if (data) {
        return makeConstrData({ tag: 0, fields: [data] })
    } else {
        return makeConstrData({ tag: 1, fields: [] })
    }
}
