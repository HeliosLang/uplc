/**
 * @import { Builtin, CekStack, CekTerm, CekValue, UplcValue } from "src/index.js"
 */

/**
 * @param {CekValue} value
 * @param {boolean} simplify
 * @returns {string | UplcValue}
 */
export function stringifyNonUplcValue(value, simplify = false) {
    if ("value" in value) {
        return value.value
    } else if ("delay" in value) {
        if (simplify) {
            return "<fn>"
        } else {
            return `(delay ${value.delay.term.toString()})`
        }
    } else if ("builtin" in value) {
        return value.builtin.name
    } else {
        const props = value.lambda

        if (simplify) {
            return "<fn>"
        } else {
            return `(lam ${
                props.argName ? `${props.argName} ` : ""
            }${props.term.toString()})`
        }
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
