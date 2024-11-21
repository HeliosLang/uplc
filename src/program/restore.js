import { decodeUplcProgramV1FromCbor } from "./UplcProgramV1.js"
import { decodeUplcProgramV2FromCbor } from "./UplcProgramV2.js"
import { decodeUplcProgramV3FromCbor } from "./UplcProgramV3.js"

/**
 * @import { BytesLike } from "@helios-lang/codec-utils"
 * @import { PlutusVersion, UplcProgram, UplcProgramV1, UplcProgramV1Options, UplcProgramV2, UplcProgramV2Options, UplcProgramV3, UplcProgramV3Options } from "../index.js"
 */

/**
 * @overload
 * @param {"PlutusScriptV1"} version
 * @param {BytesLike} cbor
 * @returns {UplcProgramV1}
 */
/**
 * @overload
 * @param {"PlutusScriptV1"} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV1Options} options
 * @returns {UplcProgramV1}
 */
/**
 * @overload
 * @param {"PlutusScriptV2"} version
 * @param {BytesLike} cbor
 * @returns {UplcProgramV2}
 */
/**
 * @overload
 * @param {"PlutusScriptV2"} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV2Options} options
 * @returns {UplcProgramV2}
 */
/**
 * @overload
 * @param {"PlutusScriptV3"} version
 * @param {BytesLike} cbor
 * @returns {UplcProgramV3}
 */
/**
 * @overload
 * @param {"PlutusScriptV3"} version
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
