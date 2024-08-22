import { UplcProgramV1 } from "./UplcProgramV1.js"
import { UplcProgramV2 } from "./UplcProgramV2.js"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 * @typedef {import("./UplcProgram.js").PlutusVersion} PlutusVersion
 * @typedef {import("./UplcProgram.js").UplcProgram} UplcProgram
 */

/**
 * @param {PlutusVersion} version
 * @param {ByteArrayLike} cbor
 * @returns {UplcProgram}
 */
export function restoreUplcProgram(version, cbor) {
    if (version == "PlutusScriptV1") {
        return UplcProgramV1.fromCbor(cbor)
    } else if (version == "PlutusScriptV2") {
        return UplcProgramV2.fromCbor(cbor)
    } else {
        throw new Error(`unhandled PlutusVersion ${version}`)
    }
}
