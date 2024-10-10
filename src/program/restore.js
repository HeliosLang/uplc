import { UplcProgramV1 } from "./UplcProgramV1.js"
import { UplcProgramV2 } from "./UplcProgramV2.js"
import { UplcProgramV3 } from "./UplcProgramV3.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("./UplcProgram.js").PlutusVersion} PlutusVersion
 * @typedef {import("./UplcProgram.js").UplcProgram} UplcProgram
 * @typedef {import("./UplcProgramV1.js").PlutusVersionV1} PlutusVersionV1
 * @typedef {import("./UplcProgramV1.js").UplcProgramV1I} UplcProgramV1I
 * @typedef {import("./UplcProgramV1.js").UplcProgramV1Props} UplcProgramV1Props
 * @typedef {import("./UplcProgramV2.js").PlutusVersionV2} PlutusVersionV2
 * @typedef {import("./UplcProgramV2.js").UplcProgramV2Props} UplcProgramV2Props
 * @typedef {import("./UplcProgramV2.js").UplcProgramV2I} UplcProgramV2I
 * @typedef {import("./UplcProgramV3.js").PlutusVersionV3} PlutusVersionV3
 * @typedef {import("./UplcProgramV3.js").UplcProgramV3Props} UplcProgramV3Props
 * @typedef {import("./UplcProgramV3.js").UplcProgramV3I} UplcProgramV3I
 */

/**
 * @overload
 * @param {PlutusVersionV1} version
 * @param {BytesLike} cbor
 * @returns {UplcProgramV1I}
 */
/**
 * @overload
 * @param {PlutusVersionV1} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV1Props} props
 * @returns {UplcProgramV1I}
 */
/**
 * @overload
 * @param {PlutusVersionV2} version
 * @param {BytesLike} cbor
 * @returns {UplcProgramV2I}
 */
/**
 * @overload
 * @param {PlutusVersionV2} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV2Props} props
 * @returns {UplcProgramV2I}
 */
/**
 * @overload
 * @param {PlutusVersionV3} version
 * @param {BytesLike} cbor
 * @returns {UplcProgramV3I}
 */
/**
 * @overload
 * @param {PlutusVersionV3} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV3Props} props
 * @returns {UplcProgramV3I}
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
 * @param {UplcProgramV1Props | UplcProgramV2Props | UplcProgramV3Props} props
 * @returns {UplcProgram}
 */
/**
 * @param {PlutusVersion} version
 * @param {BytesLike} cbor
 * @param {UplcProgramV1Props | UplcProgramV2Props | UplcProgramV3Props} props
 * @returns {UplcProgram}
 */
export function restoreUplcProgram(version, cbor, props = {}) {
    switch (version) {
        case "PlutusScriptV1":
            return UplcProgramV1.fromCbor(
                cbor,
                /** @type {UplcProgramV1Props} */ (props)
            )
        case "PlutusScriptV2":
            return UplcProgramV2.fromCbor(
                cbor,
                /** @type {UplcProgramV2Props} */ (props)
            )
        case "PlutusScriptV3":
            return UplcProgramV3.fromCbor(
                cbor,
                /** @type {UplcProgramV3Props} */ (props)
            )
        default:
            throw new Error(`unhandled PlutusVersion ${version}`)
    }
}
