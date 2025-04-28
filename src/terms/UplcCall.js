import { makeUplcApply } from "./UplcApply.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   FlatReader,
 *   UplcCall,
 *   UplcTerm
 * } from "../index.js"
 */

/**
 * @deprecated use `makeUplcApply()` instead
 * @param {{
 *   fn: UplcTerm
 *   arg: UplcTerm
 *   site?: Site
 * } | {
 *   fn: UplcTerm
 *   args: UplcTerm[]
 *   site?: Site
 * }} props
 * @returns {UplcCall}
 */
export function makeUplcCall(props) {
    return makeUplcApply(props)
}

/**
 * @deprecated use `decodeUplcApplyFromFlat()` instead
 * @param {FlatReader} r
 * @returns {UplcCall}
 */
export function decodeUplcCallFromFlat(r) {
    return makeUplcCall({ fn: r.readExpr(), arg: r.readExpr() })
}
