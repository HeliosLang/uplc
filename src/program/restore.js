import { decodeUplcProgramV1FromCbor } from "./UplcProgramV1.js"
import { decodeUplcProgramV2FromCbor } from "./UplcProgramV2.js"
import { decodeUplcProgramV3FromCbor } from "./UplcProgramV3.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("./UplcProgram.js").PlutusVersion} PlutusVersion
 * @typedef {import("./UplcProgram.js").UplcProgram} UplcProgram
 * @typedef {import("./UplcProgramV1.js").PlutusVersionV1} PlutusVersionV1
 * @typedef {import("./UplcProgramV1.js").UplcProgramV1} UplcProgramV1
 * @typedef {import("./UplcProgramV1.js").UplcProgramV1Options} UplcProgramV1Options
 * @typedef {import("./UplcProgramV2.js").PlutusVersionV2} PlutusVersionV2
 * @typedef {import("./UplcProgramV2.js").UplcProgramV2Options} UplcProgramV2Options
 * @typedef {import("./UplcProgramV2.js").UplcProgramV2} UplcProgramV2
 * @typedef {import("./UplcProgramV3.js").PlutusVersionV3} PlutusVersionV3
 * @typedef {import("./UplcProgramV3.js").UplcProgramV3Options} UplcProgramV3Options
 * @typedef {import("./UplcProgramV3.js").UplcProgramV3} UplcProgramV3
 */

/**
 * @overload
 * @param {PlutusVersionV1} version
 * @param {BytesLike} cbor
 * @returns {UplcProgramV1}
 */
/**
 * @overload
 * @param {PlutusVersionV1} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV1Options} options
 * @returns {UplcProgramV1}
 */
/**
 * @overload
 * @param {PlutusVersionV2} version
 * @param {BytesLike} cbor
 * @returns {UplcProgramV2}
 */
/**
 * @overload
 * @param {PlutusVersionV2} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV2Options} options
 * @returns {UplcProgramV2}
 */
/**
 * @overload
 * @param {PlutusVersionV3} version
 * @param {BytesLike} cbor
 * @returns {UplcProgramV3}
 */
/**
 * @overload
 * @param {PlutusVersionV3} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV3Options} options
 * @returns {UplcProgramV3}
 */
/**
 * Deserializes a UplcProgram from its CBOR representation with no available IR or alternate/unoptimized version
 * @overload
 * @param {PlutusVersion} version
 * @param {BytesLike} cbor
 * @returns {UplcProgram}
 */
/**
 * Deserializes a UplcProgram from its CBOR representation, with optional IR-generator and alternate/unoptimized version
 * @overload
 * @param {PlutusVersion} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV1Options | UplcProgramV2Options | UplcProgramV3Options} options
 * @returns {UplcProgram}
 */
/**
 * @param {PlutusVersion} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV1Options | UplcProgramV2Options | UplcProgramV3Options} options
 * @returns {UplcProgram}
 */
export function restoreUplcProgram(version, cbor, options = {}) {
    switch (version) {
        case "PlutusScriptV1":
            return decodeUplcProgramV1FromCbor(
                cbor,
                /** @type {UplcProgramV1Options} */ (options)
            )
        case "PlutusScriptV2":
            return decodeUplcProgramV2FromCbor(
                cbor,
                /** @type {UplcProgramV2Options} */ (options)
            )
        case "PlutusScriptV3":
            return decodeUplcProgramV3FromCbor(
                cbor,
                /** @type {UplcProgramV3Options} */ (options)
            )
        default:
            throw new Error(`unhandled PlutusVersion ${version}`)
    }
}
