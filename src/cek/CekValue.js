export {}

/**
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./CekStack.js").CekStack} CekStack - circular import, but is allowed in JSDocs
 * @typedef {import("./CekTerm.js").CekTerm} CekTerm - circular import, but is allowed in JSDocs
 */

/**
 * Generalized UplcValue
 * The optional name is used for debugging
 * @typedef {{name?: string} & ({
 *   value: UplcValue
 * } | {
 *   delay: {
 *     term: CekTerm
 *     stack: CekStack
 *   }
 * } | {
 *   lambda: {
 *     term: CekTerm
 *     argName?: string
 *     stack: CekStack
 *   }
 * } | {
 *   builtin: {
 *     id: number
 *     name: string
 *     forceCount: number
 *     args: CekValue[]
 *   }
 * })} CekValue
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
