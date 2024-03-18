import { FlatReader } from "../../flat/index.js"
import { dispatchValueReader } from "../values/index.js"
import { decodeTerm } from "./decode.js"

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

/**
 * @extends {FlatReader<UplcTerm, UplcValue>}
 */
export class UplcReader extends FlatReader {
    /**
     * @param {number[] | Uint8Array} bytes
     */
    constructor(bytes) {
        super(bytes, decodeTerm, dispatchValueReader)
    }
}
