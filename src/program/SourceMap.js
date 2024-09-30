import { decodeInt, decodeList, encodeInt, encodeList } from "@helios-lang/cbor"
import { bytesToHex } from "@helios-lang/codec-utils"
import { TokenSite } from "@helios-lang/compiler-utils"
import { isStringArray } from "@helios-lang/type-utils"
import { isString } from "@helios-lang/type-utils"
import { isObject } from "@helios-lang/type-utils"
import { JSON, expect, expectJsonSafe } from "@helios-lang/type-utils"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../terms/index.js").UplcTerm} UplcTerm
 */

/**
 * @typedef {{
 *   sourceNames: string[]
 *   indices: string // cbor encoded
 * }} SourceMapJsonSafe
 */

/**
 * @typedef {{
 *   sourceNames: string[]
 *   indices: number[]
 * }} SourceMapProps
 */

export class SourceMap {
    /**
     * Eg. file names or helios header names
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
     * @readonly
     * @type {number[]}
     */
    indices

    /**
     * @param {SourceMapProps} props
     */
    constructor({ sourceNames, indices }) {
        this.sourceNames = sourceNames
        this.indices = indices
    }

    /**
     * @param {string | JsonSafe} raw
     * @returns {SourceMap}
     */
    static fromJson(raw) {
        const rawObj = typeof raw == "string" ? JSON.parse(raw) : raw

        const obj = expect(
            isObject({ sourceNames: isStringArray, indices: isString })
        )(rawObj)

        return new SourceMap({
            sourceNames: obj.sourceNames,
            indices: decodeList(obj.indices, decodeInt).map((i) => Number(i))
        })
    }

    /**
     * @param {UplcTerm} root
     * @returns {SourceMap}
     */
    static fromUplcTerm(root) {
        // root term index 0
        // the first child, if it exists, of root has index 1
        // the first grand-child, if it exists of root has index 2
        let i = 0

        /**
         * @type {string[]}
         */
        const sourceNames = []

        /**
         * @type {[number, number, number, number][]}
         */
        const indices = []

        traverseTerms(root, (term) => {
            /**
             * @type {Option<Site>}
             */
            const site = term.site

            if (site) {
                const sn = site.file
                let j = sourceNames.indexOf(sn)

                if (j == -1) {
                    j = sourceNames.length
                    sourceNames.push(sn)
                }

                indices.push([i, j, site.line, site.column])
            }

            i++
        })

        return new SourceMap({
            sourceNames,
            indices: indices.flat()
        })
    }

    /**
     * @param {UplcTerm} root - mutated in-place
     * @returns {void}
     */
    apply(root) {
        let i = 0

        //
        let j = 0

        traverseTerms(root, (term) => {
            while (this.indices[j] < i) {
                j += 4
            }

            if (this.indices[j] == i) {
                const [sourceId, line, column] = this.indices.slice(
                    j + 1,
                    j + 4
                )
                const sn = this.sourceNames[sourceId]
                term.site = new TokenSite(sn, line, column)
            }

            i++
        })
    }

    /**
     * @returns {SourceMapJsonSafe}
     */
    toJsonSafe() {
        return {
            sourceNames: this.sourceNames,
            indices: bytesToHex(
                encodeList(this.indices.map((i) => encodeInt(i)))
            )
        }
    }
}

/**
 * @param {UplcTerm} root
 * @param {(term: UplcTerm) => void} callback
 */
export function traverseTerms(root, callback) {
    let terms = [root]

    let next = terms.pop()

    while (next) {
        callback(next)

        // add the children
        terms = terms.concat(next.children.slice().reverse())

        next = terms.pop()
    }
}
