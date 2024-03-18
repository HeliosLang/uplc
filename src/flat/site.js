import { BitReader, BitWriter } from "@helios-lang/codec-utils"
import { decodeFlatInt, encodeFlatInt } from "./int.js"

/**
 * @typedef {{
 *   file: number
 *   line: number
 *   column: number
 * }} Site
 */

/**
 * @param {BitReader} r
 * @returns {Site}
 */
export function decodeFlatSite(r) {
    const file = Number(decodeFlatInt(r))
    const line = Number(decodeFlatInt(r))
    const column = Number(decodeFlatInt(r))

    return { file, line, column }
}

/**
 * Used by EUplc
 * @param {BitWriter} w
 * @param {Site} site
 */
export function encodeFlatSite(w, site) {
    encodeFlatInt(w, BigInt(site.file))
    encodeFlatInt(w, BigInt(site.line))
    encodeFlatInt(w, BigInt(site.column))
}
