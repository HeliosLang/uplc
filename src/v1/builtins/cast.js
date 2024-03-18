/**
 * @typedef {import("../cek/types.js").CekValue} CekValue
 */

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * @param {UplcValue} value
 * @returns {CekValue}
 */
export function asCekValue(value) {
    return { value: value }
}

/**
 * @param {CekValue} value
 * @returns {undefined | UplcValue}
 */
export function asUplcValue(value) {
    if ("value" in value) {
        return value.value
    } else {
        return undefined
    }
}

/**
 * @param {CekValue[]} values
 * @returns {(undefined | UplcValue)[]}
 */
export function asUplcValues(values) {
    return values.map((v) => asUplcValue(v))
}
