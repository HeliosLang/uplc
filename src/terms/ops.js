import { UplcCall } from "./UplcCall.js"
import { UplcConst } from "./UplcConst.js"

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

/**
 * @param {UplcTerm} expr
 * @param {UplcValue[]} args
 * @returns {UplcTerm}
 */
export function apply(expr, args) {
    for (let arg of args) {
        expr = new UplcCall(expr, new UplcConst(arg))
    }

    return expr
}
