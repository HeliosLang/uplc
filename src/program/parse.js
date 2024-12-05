/**
 * Methods for parsing the string representation of a program
 */
import { encodeIntBE } from "@helios-lang/codec-utils"
import {
    anyWord,
    byteslit,
    group,
    intlit,
    makeSource,
    makeTokenReader,
    makeTokenizer,
    strlit,
    symbol,
    word
} from "@helios-lang/compiler-utils"
import { allOrUndefined, expectDefined } from "@helios-lang/type-utils"
import {
    makeByteArrayData,
    makeConstrData,
    makeIntData,
    makeListData,
    makeMapData
} from "../data/index.js"
import {
    makeUplcBuiltin,
    makeUplcCall,
    makeUplcConst,
    makeUplcDelay,
    makeUplcError,
    makeUplcForce,
    makeUplcLambda,
    makeUplcVar
} from "../terms/index.js" // TODO: implement UplcCase and UplcConstr terms
import {
    BLS12_381_G1_ELEMENT_TYPE,
    BLS12_381_G2_ELEMENT_TYPE,
    BOOL_TYPE,
    BYTE_ARRAY_TYPE,
    DATA_TYPE,
    INT_TYPE,
    makeBls12_381_G1_element,
    makeBls12_381_G2_element,
    makeListType,
    makePairType,
    makeUplcBool,
    makeUplcByteArray,
    makeUplcDataValue,
    makeUplcInt,
    makeUplcList,
    makeUplcPair,
    makeUplcString,
    STRING_TYPE,
    UNIT_TYPE,
    UNIT_VALUE
} from "../values/index.js"

/**
 * @import { Site, TokenReader } from "@helios-lang/compiler-utils"
 * @import { Bls12_381_G1_element, Bls12_381_G2_element, Builtin, UplcBool, UplcByteArray, UplcData, UplcDataValue, UplcInt, UplcLambda, UplcString, UplcTerm, UplcType, UplcUnit, UplcValue, UplcVersion } from "../index.js"
 */

/**
 * @typedef {{
 *   uplcVersion: string
 *   builtins: Builtin[]
 *   varNames?: string[]
 * }} ParseContext
 */

/**
 * @param {ParseContext} ctx
 * @param {string} name
 * @returns {ParseContext}
 */
function pushVarName(ctx, name) {
    return {
        ...ctx,
        varNames: (ctx?.varNames ?? []).concat(name)
    }
}

/**
 *
 * @param {ParseContext} ctx
 * @param {string} name
 * @returns {number | undefined} - DeBruijn index
 */
function findVarName(ctx, name) {
    const varNames = ctx?.varNames ?? []
    for (let i = varNames.length - 1; i >= 0; i--) {
        if (varNames[i] == name) {
            return varNames.length - i
        }
    }

    return undefined
}

/**
 * @param {string} s
 * @param {ParseContext} ctx
 * @returns {UplcTerm}
 */
export function parseProgram(s, ctx) {
    const [major, minor, patch] = ctx.uplcVersion.split(".")

    const tokenizer = makeTokenizer(makeSource(s, { name: "<na>" }), {
        tokenizeReal: false,
        allowLeadingZeroes: true
    })

    const tokens = tokenizer.tokenize()

    tokenizer.errors.throw()

    /**
     * @type {TokenReader}
     */
    let r = makeTokenReader({ tokens })
    let m

    /**
     * @type {UplcTerm | undefined}
     */
    let term = undefined

    if ((m = r.matches(group("(", { length: 1 })))) {
        r.end()
        r = m.fields[0]
        r.assert(
            word("program"),
            intlit(major),
            symbol("."),
            intlit(minor),
            symbol("."),
            intlit(patch)
        )

        term = parseTerm(r, ctx)
        r.end()
    } else {
        r.endMatch()
    }

    r.errors.throw()

    return expectDefined(term)
}

/**
 * @param {TokenReader} r
 * @param {ParseContext} ctx
 * @returns {UplcTerm | undefined}
 */
function parseTerm(r, ctx) {
    let m

    if ((m = r.matches(anyWord))) {
        const i = findVarName(ctx, m.value)
        if (i !== undefined) {
            return makeUplcVar({ index: i, name: m.value, site: m.site })
        } else {
            r.errors.syntax(
                m.site,
                `undefined var name ${
                    m.value
                } (hint: available var names are: ${ctx.varNames ?? []})`
            )
            return undefined
        }
    } else if ((m = r.matches(group("(", { length: 1 })))) {
        r = m.fields[0]

        if ((m = r.matches(word("builtin")))) {
            const term = parseBuiltin(r, m.site, ctx)
            r.end()
            return term
        } else if ((m = r.matches(word("con")))) {
            const term = parseConst(r, m.site)
            r.end()
            return term
        } else if ((m = r.matches(word("delay")))) {
            const term = parseTerm(r, ctx)
            r.end()
            return term ? makeUplcDelay({ arg: term, site: m.site }) : undefined
        } else if (r.matches(word("error"))) {
            r.end()
            return makeUplcError()
        } else if ((m = r.matches(word("force")))) {
            const term = parseTerm(r, ctx)
            r.end()
            return term ? makeUplcForce({ arg: term, site: m.site }) : undefined
        } else if ((m = r.matches(word("lam")))) {
            const term = parseLambda(r, m.site, ctx)
            r.end()
            return term
        } else {
            r.endMatch()
            return undefined
        }
    } else if ((m = r.matches(group("[", { length: 1 })))) {
        r = m.fields[0]
        const a = parseTerm(r, ctx)
        const args = [parseTerm(r, ctx)]

        while (!r.isEof()) {
            args.push(parseTerm(r, ctx))
        }

        // apparently there can be more terms
        r.end()

        const b = allOrUndefined(args)

        const term =
            a && b ? makeUplcCall({ fn: a, args: b, site: m.site }) : undefined

        return term
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 * @param {TokenReader} r
 * @param {Site} site
 * @param {ParseContext} ctx
 * @returns {UplcTerm | undefined}
 */
function parseBuiltin(r, site, ctx) {
    let m

    if ((m = r.matches(anyWord))) {
        const name = m.value
        const i = ctx.builtins.findIndex((b) => b.name == name)

        if (i == -1) {
            r.errors.syntax(site, `unrecognized builtin ${m.value}`)
            return undefined
        } else {
            return makeUplcBuiltin({ id: i, name, site })
        }
    } else if ((m = r.matches(intlit()))) {
        const i = Number(m.value)
        const name = expectDefined(ctx.builtins[i]).name
        return makeUplcBuiltin({ id: i, name, site })
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 *
 * @param {TokenReader} r
 * @param {Site} site
 * @param {ParseContext} ctx
 * @returns {UplcLambda | undefined}
 */
function parseLambda(r, site, ctx) {
    let m
    if ((m = r.matches(anyWord))) {
        const varName = m.value

        const body = parseTerm(r, pushVarName(ctx, varName))

        return body
            ? makeUplcLambda({ body, argName: varName, site })
            : undefined
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 * @param {TokenReader} r
 * @param {Site} site
 * @returns {UplcTerm | undefined}
 */
function parseConst(r, site) {
    let t = parseTypedValue(r)

    if (t) {
        const valueParser = t[1]

        const v = valueParser(r)
        r.end()

        return v ? makeUplcConst({ value: v, site }) : undefined
    } else {
        return undefined
    }
}

/**
 * @typedef {(r: TokenReader) => (UplcValue | undefined)} ValueParser
 */
/**
 * @param {TokenReader} r
 * @returns {[UplcType, ValueParser] | undefined}
 */
function parseTypedValue(r) {
    let m

    if (r.matches(word("bool"))) {
        return [BOOL_TYPE, parseBool]
    } else if (r.matches(word("bytestring"))) {
        return [BYTE_ARRAY_TYPE, parseByteArray]
    } else if (r.matches(word("data"))) {
        return [DATA_TYPE, parseDataValue]
    } else if (r.matches(word("integer"))) {
        return [INT_TYPE, parseInt]
    } else if (r.matches(word("string"))) {
        return [STRING_TYPE, parseString]
    } else if (r.matches(word("bls12_381_G1_element"))) {
        return [BLS12_381_G1_ELEMENT_TYPE, parseBls12_381_G1_element]
    } else if (r.matches(word("bls12_381_G2_element"))) {
        return [BLS12_381_G2_ELEMENT_TYPE, parseBls12_381_G2_element]
    } else if (r.matches(word("unit"))) {
        return [UNIT_TYPE, parseUnit]
    } else if ((m = r.matches(group("(", { length: 1 })))) {
        r = m.fields[0]

        /**
         * @type {[UplcType, ValueParser] | undefined}
         */
        let result = parseContainer(r)

        r.end()
        return result
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 * @param {TokenReader} r
 * @returns {[UplcType, ValueParser] | undefined}
 */
function parseContainer(r) {
    if (r.matches(word("list"))) {
        return parseList(r)
    } else if (r.matches(word("pair"))) {
        return parsePair(r)
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 *
 * @param {TokenReader} r
 * @returns {[UplcType, ValueParser] | undefined}
 */
function parseList(r) {
    const itemDetails = parseTypedValue(r)

    if (!itemDetails) {
        return undefined
    }

    const [itemType, itemParser] = itemDetails

    const listType = makeListType({ item: itemType })

    /**
     * @param {TokenReader} r
     * @returns {UplcValue | undefined}
     */
    const listParser = (r) => {
        let m
        if ((m = r.matches(group("[")))) {
            const items = allOrUndefined(m.fields.map(itemParser))

            return items ? makeUplcList({ itemType, items }) : undefined
        } else {
            r.endMatch()
            return undefined
        }
    }

    return [listType, listParser]
}

/**
 *
 * @param {TokenReader} r
 * @returns {[UplcType, ValueParser] | undefined}
 */
function parsePair(r) {
    const firstDetails = parseTypedValue(r)
    const secondDetails = parseTypedValue(r)

    if (!firstDetails || !secondDetails) {
        return undefined
    }

    const [firstType, firstParser] = firstDetails
    const [secondType, secondParser] = secondDetails

    const pairType = makePairType({ first: firstType, second: secondType })

    /**
     * @param {TokenReader} r
     * @returns {UplcValue | undefined}
     */
    const pairParser = (r) => {
        let m
        if ((m = r.matches(group("(", { length: 2 })))) {
            const r1 = m.fields[0]
            const first = firstParser(r1)
            r1.end()

            const r2 = m.fields[1]
            const second = secondParser(r2)
            r2.end()

            return first && second ? makeUplcPair({ first, second }) : undefined
        } else {
            r.endMatch()
            return undefined
        }
    }

    return [pairType, pairParser]
}

/**
 * @param {TokenReader} r
 * @returns {UplcBool | undefined}
 */
function parseBool(r) {
    if (r.matches(word("false", { caseInsensitive: true }))) {
        return makeUplcBool(false)
    } else if (r.matches(word("true", { caseInsensitive: true }))) {
        return makeUplcBool(true)
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 * @param {TokenReader} r
 * @returns {UplcByteArray | undefined}
 */
function parseByteArray(r) {
    let m
    if ((m = r.matches(byteslit()))) {
        return makeUplcByteArray(m.value)
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 * @param {TokenReader} r
 * @returns {UplcDataValue | undefined}
 */
function parseDataValue(r) {
    let m

    /**
     * @type {UplcData | undefined}
     */
    let d

    if ((m = r.matches(group("(", { length: 1 })))) {
        r.end()
        r = m.fields[0]

        d = parseData(r)
    } else {
        r.endMatch()
        return undefined
    }

    return d ? makeUplcDataValue(d) : undefined
}

/**
 *
 * @param {TokenReader} r
 * @returns {UplcData | undefined}
 */
function parseData(r) {
    let m

    if ((m = r.matches(word("B"), byteslit()))) {
        return makeByteArrayData({ bytes: m[1].value })
    } else if ((m = r.matches(word("Constr"), intlit(), group("[")))) {
        const tag = m[1].value
        const fields = allOrUndefined(m[2].fields.map(parseData))

        return fields ? makeConstrData(tag, fields) : undefined
    } else if (r.matches(word("I"))) {
        if ((m = r.matches(intlit()))) {
            return makeIntData(m.value)
        } else if ((m = r.matches(symbol("-"), intlit()))) {
            return makeIntData(-m[1].value)
        } else {
            r.endMatch()
            return undefined
        }
    } else if ((m = r.matches(word("List"), group("[")))) {
        const items = allOrUndefined(m[1].fields.map(parseData))

        return items ? makeListData(items) : undefined
    } else if ((m = r.matches(word("Map"), group("[")))) {
        const pairs = allOrUndefined(m[1].fields.map(parseDataPair))

        return pairs ? makeMapData(pairs) : undefined
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 *
 * @param {TokenReader} r
 * @returns {[UplcData, UplcData] | undefined}
 */
function parseDataPair(r) {
    let m

    if ((m = r.matches(group("(", { length: 2 })))) {
        const first = parseData(m.fields[0])
        const second = parseData(m.fields[1])

        return first && second ? [first, second] : undefined
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 * @param {TokenReader} r
 * @returns {Bls12_381_G1_element | undefined}
 */
function parseBls12_381_G1_element(r) {
    let m

    if ((m = r.matches(intlit()))) {
        const bytes = encodeIntBE(m.value)

        return makeBls12_381_G1_element({ bytes })
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 * @param {TokenReader} r
 * @returns {Bls12_381_G2_element | undefined}
 */
function parseBls12_381_G2_element(r) {
    let m

    if ((m = r.matches(intlit()))) {
        const bytes = encodeIntBE(m.value)

        return makeBls12_381_G2_element({ bytes })
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 *
 * @param {TokenReader} r
 * @returns {UplcInt | undefined}
 */
function parseInt(r) {
    let m

    if ((m = r.matches(intlit()))) {
        return makeUplcInt(m.value)
    } else if ((m = r.matches(symbol("-"), intlit()))) {
        return makeUplcInt(-m[1].value)
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 * @param {TokenReader} r
 * @returns {UplcString | undefined}
 */
function parseString(r) {
    let m
    if ((m = r.matches(strlit()))) {
        return makeUplcString(m.value)
    } else {
        r.endMatch()
        return undefined
    }
}

/**
 * @param {TokenReader} r
 * @returns {UplcUnit | undefined}
 */
function parseUnit(r) {
    if (r.matches(group("(", { length: 0 }))) {
        return UNIT_VALUE
    } else {
        r.endMatch()
        return undefined
    }
}
