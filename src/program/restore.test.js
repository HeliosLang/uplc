import { describe, it } from "node:test"
import { makeUplcConst } from "../terms/index.js"
import { makeUplcInt } from "../values/index.js"
import { restoreUplcProgram } from "./restore.js"
import { makeUplcProgramV1 } from "./UplcProgramV1.js"
import { makeUplcProgramV3 } from "./UplcProgramV3.js"

/**
 * @import { PlutusVersion, UplcProgram, UplcProgramV1, UplcProgramV2, UplcProgramV3 } from "src/index.js"
 */

describe(restoreUplcProgram.name, () => {
    const validCborV1V2 = makeUplcProgramV1({
        root: makeUplcConst({ value: makeUplcInt(0) })
    }).toCbor()
    const validCborV3 = makeUplcProgramV3({
        root: makeUplcConst({ value: makeUplcInt(0) })
    }).toCbor()

    it('returns a UplcProgramV1 instance when restoring a "PlutusScriptV1" program', () => {
        /**
         * @satisfies {UplcProgramV1}
         */
        const _program = restoreUplcProgram("PlutusScriptV1", validCborV1V2)
    })

    it('returns a UplcProgramV1 instance when restoring a "PlutusScriptV1" program with additional properties', () => {
        /**
         * @satisfies {UplcProgramV1}
         */
        const _program = restoreUplcProgram("PlutusScriptV1", validCborV1V2, {
            alt: restoreUplcProgram("PlutusScriptV1", validCborV1V2)
        })
    })

    it('returns a UplcProgramV2 instance when restoring a "PlutusScriptV2" program', () => {
        /**
         * @satisfies {UplcProgramV2}
         */
        const _program = restoreUplcProgram("PlutusScriptV2", validCborV1V2)
    })

    it('returns a UplcProgramV2 instance when restoring a "PlutusScriptV2" program with additional properties', () => {
        /**
         * @satisfies {UplcProgramV2}
         */
        const _program = restoreUplcProgram("PlutusScriptV2", validCborV1V2, {
            alt: restoreUplcProgram("PlutusScriptV2", validCborV1V2)
        })
    })

    it('returns a UplcProgramV3 instance when restoring a "PlutusScriptV3" program', () => {
        /**
         * @satisfies {UplcProgramV3}
         */
        const _program = restoreUplcProgram("PlutusScriptV3", validCborV3)
    })

    it('returns a UplcProgramV3 instance when restoring a "PlutusScriptV3" program with additional properties', () => {
        /**
         * @satisfies {UplcProgramV3}
         */
        const _program = restoreUplcProgram("PlutusScriptV3", validCborV3, {
            alt: restoreUplcProgram("PlutusScriptV3", validCborV3)
        })
    })

    it("returns a UplcProgram instance when restoring a program of unknown version at compile-time", () => {
        /**
         * @satisfies {UplcProgram}
         */
        const _program = restoreUplcProgram(
            /** @type {PlutusVersion} */ ("PlutusScriptV2"),
            validCborV1V2
        )
    })

    it("returns a UplcProgram instance when restoring a program of unknown version at compile-time with additional properties", () => {
        /**
         * @satisfies {UplcProgram}
         */
        const _program = restoreUplcProgram(
            /** @type {PlutusVersion} */ ("PlutusScriptV2"),
            validCborV1V2,
            {
                alt: restoreUplcProgram("PlutusScriptV2", validCborV1V2)
            }
        )
    })
})
