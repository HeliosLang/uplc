import {
    decodeInt,
    decodeList,
    decodeMap,
    decodeString,
    encodeInt,
    encodeList,
    encodeMap,
    encodeString
} from "@helios-lang/cbor"
import { bytesToHex } from "@helios-lang/codec-utils"
import {
    isDummySite,
    makeDummySite,
    makeTokenSite
} from "@helios-lang/compiler-utils"
import {
    expect,
    isObject,
    isString,
    isStringArray,
    JSON
} from "@helios-lang/type-utils"
import { traverse } from "../terms/index.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { JsonSafe } from "@helios-lang/type-utils"
 * @import { UplcSourceMap, UplcSourceMapJsonSafe, UplcSourceMapProps, UplcTerm } from "../index.js"
 */

/**
 * @param {UplcSourceMapProps | {term: UplcTerm}} props
 * @returns {UplcSourceMap}
 */
export function makeUplcSourceMap(props) {
    if ("term" in props) {
        return extractUplcSourceMap(props.term)
    } else {
        return new UplcSourceMapImpl(props)
    }
}

/**
 * @param {string | JsonSafe} raw
 * @returns {UplcSourceMap}
 */
export function deserializeUplcSourceMap(raw) {
    const rawObj = typeof raw == "string" ? JSON.parse(raw) : raw

    const obj = expect(
        isObject({
            sourceNames: isStringArray,
            indices: isString
        })
    )(rawObj)

    return makeUplcSourceMap({
        sourceNames: obj.sourceNames,
        indices: decodeList(obj.indices, decodeInt).map((i) => Number(i)),
        variableNames:
            "variableNames" in obj && isString(obj.variableNames)
                ? decodeMap(obj.variableNames, decodeInt, decodeString).map(
                      ([key, value]) => [Number(key), value]
                  )
                : [],
        termDescriptions:
            "termDescriptions" in obj && isString(obj.termDescriptions)
                ? decodeMap(obj.termDescriptions, decodeInt, decodeString).map(
                      ([key, value]) => [Number(key), value]
                  )
                : []
    })
}

/**
 * @param {UplcTerm} root
 * @returns {UplcSourceMap}
 */
function extractUplcSourceMap(root) {
    /**
     * @type {string[]}
     */
    const sourceNames = []

    /**
     * @type {[number, number, number, number][]}
     */
    const indices = []

    /**
     * @type {[number, string][]}
     */
    const variableNames = []

    /**
     * @type {[number, string][]}
     */
    const termDescriptions = []

    traverse(root, {
        anyTerm: (term, i) => {
            /**
             * @type {Site | undefined}
             */
            const site = term.site

            if (site) {
                if (!isDummySite(site)) {
                    const sn = site.file
                    let j = sourceNames.indexOf(sn)

                    // add source name if it wasn't added before
                    if (j == -1) {
                        j = sourceNames.length
                        sourceNames.push(sn)
                    }

                    indices.push([i, j, site.line, site.column])
                }

                if (site.description) {
                    termDescriptions.push([i, site.description])
                }
            }
        },
        lambdaTerm: (term, i) => {
            const name = term.argName

            if (name) {
                variableNames.push([i, name])
            }
        }
    })

    return makeUplcSourceMap({
        sourceNames,
        indices: indices.flat(),
        variableNames,
        termDescriptions
    })
}

/**
 * Named "UplcSourceMap" instead of "SourceMap" in order to avoid confusion with the Helios -> IR SourceMap type
 * @implements {UplcSourceMap}
 */
class UplcSourceMapImpl {
    /**
     * Eg. file names or helios header names
     * @private
     * @readonly
     * @type {string[]}
     */
    sourceNames

    /**
     * Tuples of 4 indices
     *   - First index in each tuple is the uplc term 'preorder' index
     *   - Second index in each tuple is the source index (i.e. index in `this.sourceNames`)
     *   - Third index in each tuple is the line number (0-based)
     *   - Fourth index in each tuple is the column number (0-based)
     * @private
     * @readonly
     * @type {number[]}
     */
    indices

    /**
     * Tuple of uplc lambda term index and variable name
     * @private
     * @readonly
     * @type {[number, string][]}
     */
    variableNames

    /**
     * Tuple of uplc term index and description string
     * @private
     * @readonly
     * @type {[number, string][]}
     */
    termDescriptions

    /**
     * @param {UplcSourceMapProps} props
     */
    constructor({
        sourceNames,
        indices,
        variableNames = [],
        termDescriptions = []
    }) {
        this.sourceNames = sourceNames
        this.indices = indices
        this.variableNames = variableNames
        this.termDescriptions = termDescriptions
    }

    /**
     * @param {UplcTerm} root - mutated in-place
     * @returns {void}
     */
    apply(root) {
        let indicesPos = 0
        let variableNamesPos = 0
        let termDescriptionsPos = 0

        traverse(root, {
            anyTerm: (term, i) => {
                while (this.indices[indicesPos] < i) {
                    indicesPos += 4
                }

                if (this.indices[indicesPos] == i) {
                    const [sourceId, line, column] = this.indices.slice(
                        indicesPos + 1,
                        indicesPos + 4
                    )
                    const sn = this.sourceNames[sourceId]
                    term.site = makeTokenSite({
                        file: sn,
                        startLine: line,
                        startColumn: column
                    })
                }

                while (this.termDescriptions[termDescriptionsPos]?.[0] < i) {
                    termDescriptionsPos += 1
                }

                if (this.termDescriptions[termDescriptionsPos]?.[0] == i) {
                    const description =
                        this.termDescriptions[termDescriptionsPos][1]

                    if (term.site) {
                        term.site = term.site.withDescription(description)
                    } else {
                        term.site = makeDummySite().withDescription(description)
                    }
                }
            },
            lambdaTerm: (term, i) => {
                while (this.variableNames[variableNamesPos]?.[0] < i) {
                    variableNamesPos += 1
                }

                if (this.variableNames[variableNamesPos]?.[0] == i) {
                    const name = this.variableNames[variableNamesPos][1]

                    term.argName = name
                }
            }
        })
    }

    /**
     * @returns {UplcSourceMapJsonSafe}
     */
    toJsonSafe() {
        return {
            sourceNames: this.sourceNames,
            indices: bytesToHex(
                encodeList(this.indices.map((i) => encodeInt(i)))
            ),
            variableNames:
                this.variableNames.length > 0
                    ? bytesToHex(
                          encodeMap(
                              this.variableNames.map(([key, value]) => {
                                  return [encodeInt(key), encodeString(value)]
                              })
                          )
                      )
                    : undefined,
            termDescriptions:
                this.termDescriptions.length > 0
                    ? bytesToHex(
                          encodeMap(
                              this.termDescriptions.map(([key, value]) => {
                                  return [encodeInt(key), encodeString(value)]
                              })
                          )
                      )
                    : undefined
        }
    }
}
