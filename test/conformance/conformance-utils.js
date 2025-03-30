import { readdirSync, readFileSync, statSync } from "node:fs"
import { resolve, join } from "node:path"
import { expectDefined } from "@helios-lang/type-utils"
import {
    builtinsV2,
    builtinsV3,
    makeUplcProgramV2,
    makeUplcProgramV3
} from "../../src/index.js"
import { parseProgramVersion, parseTerm } from "../../src/program/parse.js"

/**
 * @import { Cost, UplcProgram } from "../../src/index.js"
 */

/**
 * @param {string} root
 * @param {(path: string, uplc: string, budget: string, expected: string) => Promise<void>} callback
 * @returns {Promise<void>}
 */
export async function loopTests(root, callback) {
    root = resolve(root)
    const dirs = [root]

    let dir = dirs.pop()

    while (dir) {
        const content = readdirSync(dir)

        for (let f of content) {
            const absPath = join(dir, f)
            let testPath = dir.replace(root, "")
            if (testPath.startsWith("/")) {
                testPath = testPath.slice(1)
            }

            if (statSync(absPath).isDirectory()) {
                dirs.push(absPath)
            } else if (f.endsWith(".uplc")) {
                // read the .uplc file
                // read the .uplc.budget.expected file
                // read the .uplc.expected file
                const testName = f.slice(0, f.length - ".uplc".length)
                const budgetFilePath = join(
                    dir,
                    `${testName}.uplc.budget.expected`
                )
                const resultFilePath = join(dir, `${testName}.uplc.expected`)
                const uplcStr = removeComments(
                    readFileSync(absPath).toString().trim()
                )
                const budgetStr = readFileSync(budgetFilePath).toString().trim()
                const resultStr = readFileSync(resultFilePath).toString().trim()

                if (dir.split("/").some((part) => part.endsWith("_ignore"))) {
                    continue
                }

                if (budgetStr != "parse error") {
                    const [version, _] = parseProgramVersion(uplcStr, testPath)

                    if (version != "1.0.0") {
                        // TODO: also handle plutus version 1.1.0
                        continue
                    }
                }

                await callback(testPath, uplcStr, budgetStr, resultStr)
            } // ignore other file extensions
        }

        dir = dirs.pop()
    }
}

/**
 * By setting `allowUnresolvedNames` to true, the expected behaviour of the conformance tests is matched.
 * @typedef {{
 *   allowUnresolvedNames?: boolean
 *   programName?: string
 * }} ParseOptions
 */

/**
 * Similar to `parseProgram()`, but switches context based on verion
 * @param {string} src
 * @param {ParseOptions} options
 * @returns {UplcProgram}
 */
export function parseUplcProgram(src, options = {}) {
    const [version, r] = parseProgramVersion(src, options.programName ?? "<na>")

    const ctx = (() => {
        switch (version) {
            case "1.0.0":
                return {
                    uplcVersion: "1.0.0",
                    builtins: builtinsV2
                }
            case "1.1.0":
                return {
                    uplcVersion: "1.1.0",
                    builtins: builtinsV3
                }
            default:
                throw new Error(`unhandled UPLC version ${version}`)
        }
    })()

    const term = parseTerm(r, {
        ...ctx,
        allowUnresolvedNames: options.allowUnresolvedNames
    })
    r.end()
    r.errors.throw()

    switch (version) {
        case "1.0.0":
            return makeUplcProgramV2(expectDefined(term))
        case "1.1.0":
            return makeUplcProgramV3(expectDefined(term))
        default:
            throw new Error(`unhandled UPLC version ${version}`)
    }
}

/**
 * @param {string} uplcStr
 * @returns {string}
 */
function removeComments(uplcStr) {
    const lines = uplcStr.split("\n")

    return lines.filter((line) => !line.startsWith("--")).join("\n")
}

/**
 * @param {string} budgetStr
 * @returns {Cost}
 */
export function parseBudget(budgetStr) {
    const cpuStr = expectDefined(
        expectDefined(
            budgetStr.match(/cpu:\s*([0-9]+)/),
            "failed to parse budget"
        )[1],
        "failed to parse budget"
    )
    const memStr = expectDefined(
        expectDefined(
            budgetStr.match(/mem:\s*([0-9]+)/),
            "failed to parse budget"
        )[1],
        "failed to parse budget"
    )

    return {
        cpu: BigInt(cpuStr),
        mem: BigInt(memStr)
    }
}
