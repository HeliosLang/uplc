import { FlatWriter } from "../flat/index.js"

/**
 * @typedef {import("../cek/CekTerm.js").CekTerm} CekTerm
 */

/**
 * @typedef {CekTerm & {
 *   toFlat: (writer: FlatWriter) => void
 *   children: UplcTerm[]
 * }} UplcTerm
 */
