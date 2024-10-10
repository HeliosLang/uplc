import { FlatReader } from "../flat/index.js"
import { dispatchValueReader } from "../values/index.js"
import { decodeTerm } from "./decode.js"

/**
 * @typedef {import("../builtins/Builtin.js").Builtin} Builtin
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcTerm.js").UplcTerm} UplcTerm
 */

/**
 * TODO: don't extend, use composition instead
 * @extends {FlatReader<UplcTerm, UplcValue>}
 */
export class UplcReader extends FlatReader {
    /**
     * this.builtins is used to get the name of a builtin using only its id
     * @readonly
     * @type {Builtin[]}
     */
    builtins

    /**
     * @param {number[] | Uint8Array} bytes
     * @param {Builtin[]} builtins
     */
    constructor(bytes, builtins) {
        super(bytes, (r) => decodeTerm(r, builtins), dispatchValueReader)

        this.builtins = builtins
    }
}
