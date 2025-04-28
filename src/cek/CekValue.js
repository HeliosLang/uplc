/**
 * @import { CekValue, UplcValue } from "../index.js"
 */

/**
 * @param {CekValue} value
 * @param {boolean} simplify
 * @returns {string | UplcValue}
 */
export function stringifyNonUplcValue(value, simplify = false) {
    if (value.kind == "const") {
        return value.value
    } else if (value.kind == "delay") {
        if (simplify) {
            return "<fn>"
        } else {
            return `(delay ${value.term.toString()})`
        }
    } else if (value.kind == "builtin") {
        return value.name
    } else if (value.kind == "lambda") {
        if (simplify) {
            return "<fn>"
        } else {
            return `(lam ${
                value.argName ? `${value.argName} ` : ""
            }${value.body.toString()})`
        }
    } else {
        return "<constr>"
    }
}

/**
 * @param {CekValue} value
 * @param {boolean} simplify
 * @returns {string}
 */
export function stringifyCekValue(value, simplify = false) {
    const s = stringifyNonUplcValue(value, simplify)

    if (typeof s == "string") {
        return s
    } else {
        return s.toString()
    }
}
