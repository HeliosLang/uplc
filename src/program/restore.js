import { UplcProgramV1 } from "./UplcProgramV1.js"
import { UplcProgramV2 } from "./UplcProgramV2.js"
import { UplcProgramV3 } from "./UplcProgramV3.js"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 * @typedef {import("./UplcProgram.js").PlutusVersion} PlutusVersion
 * @typedef {import("./UplcProgram.js").UplcProgram} UplcProgram
 * @typedef {import("./UplcProgramV1.js").PlutusVersionV1} PlutusVersionV1
 * @typedef {import("./UplcProgramV1.js").UplcProgramV1Props} UplcProgramV1Props
 * @typedef {import("./UplcProgramV2.js").PlutusVersionV2} PlutusVersionV2
 * @typedef {import("./UplcProgramV2.js").UplcProgramV2Props} UplcProgramV2Props
 * @typedef {import("./UplcProgramV3.js").PlutusVersionV3} PlutusVersionV3
 * @typedef {import("./UplcProgramV3.js").UplcProgramV3Props} UplcProgramV3Props
 */

/**
 * @overload
 * @param {PlutusVersionV1} version
 * @param {ByteArrayLike} cbor
 * @returns {UplcProgramV1}
 */
/**
 * @overload
 * @param {PlutusVersionV1} version
 * @param {ByteArrayLike} cbor
 * @param {UplcProgramV1Props} props
 * @returns {UplcProgramV1}
 */
/**
 * @overload
 * @param {PlutusVersionV2} version
 * @param {ByteArrayLike} cbor
 * @returns {UplcProgramV2}
 */
/**
 * @overload
 * @param {PlutusVersionV2} version
 * @param {ByteArrayLike} cbor
 * @param {UplcProgramV2Props} props
 * @returns {UplcProgramV2}
 */
/**
 * @overload
 * @param {PlutusVersionV3} version
 * @param {ByteArrayLike} cbor
 * @returns {UplcProgramV3}
 */
/**
 * @overload
 * @param {PlutusVersionV3} version
 * @param {ByteArrayLike} cbor
 * @param {UplcProgramV3Props} props
 * @returns {UplcProgramV3}
 */
/**
 * Deserializes a UplcProgram from its CBOR representation with no available IR or alternate/unoptimized version
 * @overload
 * @param {PlutusVersion} version
 * @param {ByteArrayLike} cbor
 * @returns {UplcProgram}
 */
/**
 * Deserializes a UplcProgram from its CBOR representation, with optional IR-generator and alternate/unoptimized version
 * @overload
 * @param {PlutusVersion} version
 * @param {ByteArrayLike} cbor
 * @param {UplcProgramV1Props | UplcProgramV2Props | UplcProgramV3Props} props
 * @returns {UplcProgram}
 */
/**
 * @param {PlutusVersion} version
 * @param {ByteArrayLike} cbor
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
