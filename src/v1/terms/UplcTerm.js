import { FlatWriter } from "../../flat/index.js"

/**
 * @typedef {import("../cek/types.js").CekTerm} CekTerm
 */

/**
 * @typedef {CekTerm & {
 *   toString: () => string
 *   toFlat: (writer: FlatWriter) => void
 * }} UplcTerm
 */
