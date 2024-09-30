import { FlatWriter } from "../flat/index.js"

/**
 * @typedef {import("../cek/types.js").CekTerm} CekTerm
 */

/**
 * @typedef {CekTerm & {
 *   toFlat: (writer: FlatWriter) => void
 *   children: UplcTerm[]
 * }} UplcTerm
 */
