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
import { None, allOrNone, expectSome, isSome } from "@helios-lang/type-utils"
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
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("@helios-lang/compiler-utils").TokenReader} TokenReader
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../data/index.js").UplcData} UplcData
 * @typedef {import("../terms/index.js").UplcTerm} UplcTerm
 * @typedef {import("../terms/index.js").UplcLambda} UplcLambda
 * @typedef {import("../values/index.js").Bls12_381_G1_element} Bls12_381_G1_element
 * @typedef {import("../values/index.js").Bls12_381_G2_element} Bls12_381_G2_element
 * @typedef {import("../values/index.js").UplcBool} UplcBool
 * @typedef {import("../values/index.js").UplcByteArray} UplcByteArray
 * @typedef {import("../values/index.js").UplcDataValue} UplcDataValue
 * @typedef {import("../values/index.js").UplcInt} UplcInt
 * @typedef {import("../values/index.js").UplcString} UplcString
 * @typedef {import("../values/index.js").UplcType} UplcType
 * @typedef {import("../values/index.js").UplcUnit} UplcUnit
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./UplcProgram.js").UplcVersion} UplcVersion
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
 * @returns {Option<number>} - DeBruijn index
 */
function findVarName(ctx, name) {
    const varNames = ctx?.varNames ?? []
    for (let i = varNames.length - 1; i >= 0; i--) {
        if (varNames[i] == name) {
            return varNames.length - i
        }
    }

    return None
}

/**
 * @param {string} s
 * @param {ParseContext} ctx
 * @returns {UplcTerm}
 */
export function parseProgram(s, ctx) {
    const [major, minor, patch] = ctx.uplcVersion.split(".")

    const tokenizer = makeTokenizer({
        source: makeSource({ content: s, options: { name: "<na>" } }),
        options: {
            tokenizeReal: false,
            allowLeadingZeroes: true
        }
    })

    const tokens = tokenizer.tokenize()

    tokenizer.errors.throw()

    /**
     * @type {TokenReader}
     */
    let r = makeTokenReader({ tokens })
    let m

    /**
     * @type {Option<UplcTerm>}
     */
    let term = None

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

    return expectSome(term)
}

/**
 * @param {TokenReader} r
 * @param {ParseContext} ctx
 * @returns {Option<UplcTerm>}
 */
function parseTerm(r, ctx) {
    let m

    if ((m = r.matches(anyWord))) {
        const i = findVarName(ctx, m.value)
        if (isSome(i)) {
            return makeUplcVar({ index: i, name: m.value, site: m.site })
        } else {
            r.errors.syntax(
                m.site,
                `undefined var name ${
                    m.value
                } (hint: available var names are: ${ctx.varNames ?? []})`
            )
            return None
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
            return term ? makeUplcDelay({ arg: term, site: m.site }) : None
        } else if (r.matches(word("error"))) {
            r.end()
            return makeUplcError()
        } else if ((m = r.matches(word("force")))) {
            const term = parseTerm(r, ctx)
            r.end()
            return term ? makeUplcForce({ arg: term, site: m.site }) : None
        } else if ((m = r.matches(word("lam")))) {
            const term = parseLambda(r, m.site, ctx)
            r.end()
            return term
        } else {
            r.endMatch()
            return None
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

        const b = allOrNone(args)

        const term =
            a && b ? makeUplcCall({ fn: a, args: b, site: m.site }) : None

        return term
    } else {
        r.endMatch()
        return None
    }
}

/**
 * @param {TokenReader} r
 * @param {Site} site
 * @param {ParseContext} ctx
 * @returns {Option<UplcTerm>}
 */
function parseBuiltin(r, site, ctx) {
    let m

    if ((m = r.matches(anyWord))) {
        const name = m.value
        const i = ctx.builtins.findIndex((b) => b.name == name)

        if (i == -1) {
            r.errors.syntax(site, `unrecognized builtin ${m.value}`)
            return None
        } else {
            return makeUplcBuiltin({ id: i, name, site })
        }
    } else if ((m = r.matches(intlit()))) {
        const i = Number(m.value)
        const name = expectSome(ctx.builtins[i]).name
        return makeUplcBuiltin({ id: i, name, site })
    } else {
        r.endMatch()
        return None
    }
}

/**
 *
 * @param {TokenReader} r
 * @param {Site} site
 * @param {ParseContext} ctx
 * @returns {Option<UplcLambda>}
 */
function parseLambda(r, site, ctx) {
    let m
    if ((m = r.matches(anyWord))) {
        const varName = m.value

        const body = parseTerm(r, pushVarName(ctx, varName))

        return body ? makeUplcLambda({ body, argName: varName, site }) : None
    } else {
        r.endMatch()
        return None
    }
}

/**
 * @param {TokenReader} r
 * @param {Site} site
 * @returns {Option<UplcTerm>}
 */
function parseConst(r, site) {
    let t = parseTypedValue(r)

    if (t) {
        const valueParser = t[1]

        const v = valueParser(r)
        r.end()

        return v ? makeUplcConst({ value: v, site }) : None
    } else {
        return None
    }
}

/**
 * @typedef {(r: TokenReader) => Option<UplcValue>} ValueParser
 */
/**
 * @param {TokenReader} r
 * @returns {Option<[UplcType, ValueParser]>}
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
         * @type {Option<[UplcType, ValueParser]>}
         */
        let result = parseContainer(r)

        r.end()
        return result
    } else {
        r.endMatch()
        return None
    }
}

/**
 * @param {TokenReader} r
 * @returns {Option<[UplcType, ValueParser]>}
 */
function parseContainer(r) {
    if (r.matches(word("list"))) {
        return parseList(r)
    } else if (r.matches(word("pair"))) {
        return parsePair(r)
    } else {
        r.endMatch()
        return None
    }
}

/**
 *
 * @param {TokenReader} r
 * @returns {Option<[UplcType, ValueParser]>}
 */
function parseList(r) {
    const itemDetails = parseTypedValue(r)

    if (!itemDetails) {
        return None
    }

    const [itemType, itemParser] = itemDetails

    const listType = makeListType({ item: itemType })

    /**
     * @param {TokenReader} r
     * @returns {Option<UplcValue>}
     */
    const listParser = (r) => {
        let m
        if ((m = r.matches(group("[")))) {
            const items = allOrNone(m.fields.map(itemParser))

            return items ? makeUplcList({ itemType, items }) : None
        } else {
            r.endMatch()
            return None
        }
    }

    return [listType, listParser]
}

/**
 *
 * @param {TokenReader} r
 * @returns {Option<[UplcType, ValueParser]>}
 */
function parsePair(r) {
    const firstDetails = parseTypedValue(r)
    const secondDetails = parseTypedValue(r)

    if (!firstDetails || !secondDetails) {
        return None
    }

    const [firstType, firstParser] = firstDetails
    const [secondType, secondParser] = secondDetails

    const pairType = makePairType({ first: firstType, second: secondType })

    /**
     * @param {TokenReader} r
     * @returns {Option<UplcValue>}
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

            return first && second ? makeUplcPair({ first, second }) : None
        } else {
            r.endMatch()
            return None
        }
    }

    return [pairType, pairParser]
}

/**
 * @param {TokenReader} r
 * @returns {Option<UplcBool>}
 */
function parseBool(r) {
    if (r.matches(word("false", { caseInsensitive: true }))) {
        return makeUplcBool(false)
    } else if (r.matches(word("true", { caseInsensitive: true }))) {
        return makeUplcBool(true)
    } else {
        r.endMatch()
        return None
    }
}

/**
 * @param {TokenReader} r
 * @returns {Option<UplcByteArray>}
 */
function parseByteArray(r) {
    let m
    if ((m = r.matches(byteslit()))) {
        return makeUplcByteArray(m.value)
    } else {
        r.endMatch()
        return None
    }
}

/**
 * @param {TokenReader} r
 * @returns {Option<UplcDataValue>}
 */
function parseDataValue(r) {
    let m

    /**
     * @type {Option<UplcData>}
     */
    let d

    if ((m = r.matches(group("(", { length: 1 })))) {
        r.end()
        r = m.fields[0]

        d = parseData(r)
    } else {
        r.endMatch()
        return None
    }

    return d ? makeUplcDataValue(d) : None
}

/**
 *
 * @param {TokenReader} r
 * @returns {Option<UplcData>}
 */
function parseData(r) {
    let m

    if ((m = r.matches(word("B"), byteslit()))) {
        return makeByteArrayData({ bytes: m[1].value })
    } else if ((m = r.matches(word("Constr"), intlit(), group("[")))) {
        const tag = m[1].value
        const fields = allOrNone(m[2].fields.map(parseData))

        return fields ? makeConstrData({ tag: Number(tag), fields }) : None
    } else if (r.matches(word("I"))) {
        if ((m = r.matches(intlit()))) {
            return makeIntData(m.value)
        } else if ((m = r.matches(symbol("-"), intlit()))) {
            return makeIntData(-m[1].value)
        } else {
            r.endMatch()
            return None
        }
    } else if ((m = r.matches(word("List"), group("[")))) {
        const items = allOrNone(m[1].fields.map(parseData))

        return items ? makeListData(items) : None
    } else if ((m = r.matches(word("Map"), group("[")))) {
        const pairs = allOrNone(m[1].fields.map(parseDataPair))

        return pairs ? makeMapData(pairs) : None
    } else {
        r.endMatch()
        return None
    }
}

/**
 *
 * @param {TokenReader} r
 * @returns {Option<[UplcData, UplcData]>}
 */
function parseDataPair(r) {
    let m

    if ((m = r.matches(group("(", { length: 2 })))) {
        const first = parseData(m.fields[0])
        const second = parseData(m.fields[1])

        return first && second ? [first, second] : None
    } else {
        r.endMatch()
        return None
    }
}

/**
 * @param {TokenReader} r
 * @returns {Option<Bls12_381_G1_element>}
 */
function parseBls12_381_G1_element(r) {
    let m

    if ((m = r.matches(intlit()))) {
        const bytes = encodeIntBE(m.value)

        return makeBls12_381_G1_element({ bytes })
    } else {
        r.endMatch()
        return None
    }
}

/**
 * @param {TokenReader} r
 * @returns {Option<Bls12_381_G2_element>}
 */
function parseBls12_381_G2_element(r) {
    let m

    if ((m = r.matches(intlit()))) {
        const bytes = encodeIntBE(m.value)

        return makeBls12_381_G2_element({ bytes })
    } else {
        r.endMatch()
        return None
    }
}

/**
 *
 * @param {TokenReader} r
 * @returns {Option<UplcInt>}
 */
function parseInt(r) {
    let m

    if ((m = r.matches(intlit()))) {
        return makeUplcInt(m.value)
    } else if ((m = r.matches(symbol("-"), intlit()))) {
        return makeUplcInt(-m[1].value)
    } else {
        r.endMatch()
        return None
    }
}

/**
 * @param {TokenReader} r
 * @returns {Option<UplcString>}
 */
function parseString(r) {
    let m
    if ((m = r.matches(strlit()))) {
        return makeUplcString(m.value)
    } else {
        r.endMatch()
        return None
    }
}

/**
 * @param {TokenReader} r
 * @returns {Option<UplcUnit>}
 */
function parseUnit(r) {
    if (r.matches(group("(", { length: 0 }))) {
        return UNIT_VALUE
    } else {
        r.endMatch()
        return None
    }
}
