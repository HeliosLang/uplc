import { describe, it } from "node:test"
import { UplcConst } from "../terms/index.js"
import { UplcInt } from "../values/index.js"
import { restoreUplcProgram } from "./restore.js"
import { UplcProgramV1 } from "./UplcProgramV1.js"
import { UplcProgramV2 } from "./UplcProgramV2.js"
import { UplcProgramV3 } from "./UplcProgramV3.js"

/**
 * @typedef {import("./UplcProgram.js").UplcProgram} UplcProgram
 * @typedef {import("./UplcProgram.js").PlutusVersion} PlutusVersion
 */

describe(restoreUplcProgram.name, () => {
    const validCborV1V2 = new UplcProgramV1(
        new UplcConst(new UplcInt(0))
    ).toCbor()
    const validCborV3 = new UplcProgramV3(
        new UplcConst(new UplcInt(0))
    ).toCbor()

    it('returns a UplcProgramV1 instance when restoring a "PlutusScriptV1" program', () => {
        /**
         * @satisfies {UplcProgramV1}
         */
        const program = restoreUplcProgram("PlutusScriptV1", validCborV1V2)
    })

    it('returns a UplcProgramV1 instance when restoring a "PlutusScriptV1" program with additional properties', () => {
        /**
         * @satisfies {UplcProgramV1}
         */
        const program = restoreUplcProgram("PlutusScriptV1", validCborV1V2, {
            alt: restoreUplcProgram("PlutusScriptV1", validCborV1V2)
        })
    })

    it('returns a UplcProgramV2 instance when restoring a "PlutusScriptV2" program', () => {
        /**
         * @satisfies {UplcProgramV2}
         */
        const program = restoreUplcProgram("PlutusScriptV2", validCborV1V2)
    })

    it('returns a UplcProgramV2 instance when restoring a "PlutusScriptV2" program with additional properties', () => {
        /**
         * @satisfies {UplcProgramV2}
         */
        const program = restoreUplcProgram("PlutusScriptV2", validCborV1V2, {
            alt: restoreUplcProgram("PlutusScriptV2", validCborV1V2)
        })
    })

    it('returns a UplcProgramV3 instance when restoring a "PlutusScriptV3" program', () => {
        /**
         * @satisfies {UplcProgramV3}
         */
        const program = restoreUplcProgram("PlutusScriptV3", validCborV3)
    })

    it('returns a UplcProgramV3 instance when restoring a "PlutusScriptV3" program with additional properties', () => {
        /**
         * @satisfies {UplcProgramV3}
         */
        const program = restoreUplcProgram("PlutusScriptV3", validCborV3, {
            alt: restoreUplcProgram("PlutusScriptV3", validCborV3)
        })
    })

    it("returns a UplcProgram instance when restoring a program of unknown version at compile-time", () => {
        /**
         * @satisfies {UplcProgram}
         */
        const program = restoreUplcProgram(
            /** @type {PlutusVersion} */ ("PlutusScriptV2"),
            validCborV1V2
        )
    })

    it("returns a UplcProgram instance when restoring a program of unknown version at compile-time with additional properties", () => {
        /**
         * @satisfies {UplcProgram}
         */
        const program = restoreUplcProgram(
            /** @type {PlutusVersion} */ ("PlutusScriptV2"),
            validCborV1V2,
            {
                alt: restoreUplcProgram("PlutusScriptV2", validCborV1V2)
            }
        )
    })
})
