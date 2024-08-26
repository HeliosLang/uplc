import { UplcProgramV1 } from "./UplcProgramV1.js"
import { UplcProgramV2 } from "./UplcProgramV2.js"
import { UplcProgramV3 } from "./UplcProgramV3.js"

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
    switch (version) {
        case "PlutusScriptV1":
            return UplcProgramV1.fromCbor(cbor)
        case "PlutusScriptV2":
            return UplcProgramV2.fromCbor(cbor)
        case "PlutusScriptV3":
            return UplcProgramV3.fromCbor(cbor)
        default:
            throw new Error(`unhandled PlutusVersion ${version}`)
    }
}
