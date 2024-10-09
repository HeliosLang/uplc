/**
 * Methods for parsing the string representation of a program
 */
import { encodeIntBE } from "@helios-lang/codec-utils"
import {
    Source,
    TokenReader,
    Tokenizer,
    anyWord,
    byteslit,
    group,
    intlit,
    strlit,
    symbol,
    word
} from "@helios-lang/compiler-utils"
import { None, allOrNone, expectSome, isSome } from "@helios-lang/type-utils"
import {
    UplcBuiltin,
    UplcCall,
    UplcConst,
    UplcDelay,
    UplcError,
    UplcForce,
    UplcLambda,
    UplcVar
} from "../terms/index.js" // TODO: implement UplcCase and UplcConstr terms
import {
    Bls12_381_G1_element,
    Bls12_381_G2_element,
    UplcBool,
    UplcByteArray,
    UplcDataValue,
    UplcInt,
    UplcList,
    UplcPair,
    UplcString,
    UplcType,
    UplcUnit
} from "../values/index.js"
import {
    ByteArrayData,
    ConstrData,
    IntData,
    ListData,
    MapData
} from "../index.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../data/index.js").UplcData} UplcData
 * @typedef {import("../terms/index.js").UplcTerm} UplcTerm
 * @typedef {import("../values/index.js").UplcTypeI} UplcTypeI
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

    const tokenizer = new Tokenizer(new Source(s, { name: "<na>" }), {
        tokenizeReal: false,
        allowLeadingZeroes: true
    })

    const tokens = tokenizer.tokenize()

    tokenizer.errors.throw()

    let r = new TokenReader(tokens)
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
            return new UplcVar(i, m.value, m.site)
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
            return term ? new UplcDelay(term, m.site) : None
        } else if (r.matches(word("error"))) {
            r.end()
            return new UplcError()
        } else if ((m = r.matches(word("force")))) {
            const term = parseTerm(r, ctx)
            r.end()
            return term ? new UplcForce(term, m.site) : None
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

        const term = a && b ? UplcCall.multi(a, b, m.site) : None

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
            return new UplcBuiltin(i, name, site)
        }
    } else if ((m = r.matches(intlit()))) {
        const i = m.value
        const name = expectSome(ctx.builtins[Number(i)]).name
        return new UplcBuiltin(m.value, name, site)
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

        return body ? new UplcLambda(body, varName, site) : None
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

        return v ? new UplcConst(v, site) : None
    } else {
        return None
    }
}

/**
 * @typedef {(r: TokenReader) => Option<UplcValue>} ValueParser
 */
/**
 * @param {TokenReader} r
 * @returns {Option<[UplcTypeI, ValueParser]>}
 */
function parseTypedValue(r) {
    let m

    if (r.matches(word("bool"))) {
        return [UplcType.bool(), parseBool]
    } else if (r.matches(word("bytestring"))) {
        return [UplcType.byteArray(), parseByteArray]
    } else if (r.matches(word("data"))) {
        return [UplcType.data(), parseDataValue]
    } else if (r.matches(word("integer"))) {
        return [UplcType.int(), parseInt]
    } else if (r.matches(word("string"))) {
        return [UplcType.string(), parseString]
    } else if (r.matches(word("bls12_381_G1_element"))) {
        return [UplcType.bls12_381_G1_element(), parseBls12_381_G1_element]
    } else if (r.matches(word("bls12_381_G2_element"))) {
        return [UplcType.bls12_381_G2_element(), parseBls12_381_G2_element]
    } else if (r.matches(word("unit"))) {
        return [UplcType.unit(), parseUnit]
    } else if ((m = r.matches(group("(", { length: 1 })))) {
        r = m.fields[0]

        /**
         * @type {Option<[UplcTypeI, ValueParser]>}
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
 * @returns {Option<[UplcTypeI, ValueParser]>}
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
 * @returns {Option<[UplcTypeI, ValueParser]>}
 */
function parseList(r) {
    const itemDetails = parseTypedValue(r)

    if (!itemDetails) {
        return None
    }

    const [itemType, itemParser] = itemDetails

    const listType = UplcType.list(itemType)

    /**
     * @param {TokenReader} r
     * @returns {Option<UplcValue>}
     */
    const listParser = (r) => {
        let m
        if ((m = r.matches(group("[")))) {
            const items = allOrNone(m.fields.map(itemParser))

            return items ? new UplcList(itemType, items) : None
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
 * @returns {Option<[UplcTypeI, ValueParser]>}
 */
function parsePair(r) {
    const firstDetails = parseTypedValue(r)
    const secondDetails = parseTypedValue(r)

    if (!firstDetails || !secondDetails) {
        return None
    }

    const [firstType, firstParser] = firstDetails
    const [secondType, secondParser] = secondDetails

    const pairType = UplcType.pair(firstType, secondType)

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

            return first && second ? new UplcPair(first, second) : None
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
        return new UplcBool(false)
    } else if (r.matches(word("true", { caseInsensitive: true }))) {
        return new UplcBool(true)
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
        return new UplcByteArray(m.value)
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

    return d ? new UplcDataValue(d) : None
}

/**
 *
 * @param {TokenReader} r
 * @returns {Option<UplcData>}
 */
function parseData(r) {
    let m

    if ((m = r.matches(word("B"), byteslit()))) {
        return new ByteArrayData(m[1].value)
    } else if ((m = r.matches(word("Constr"), intlit(), group("[")))) {
        const tag = m[1].value
        const fields = allOrNone(m[2].fields.map(parseData))

        return fields ? new ConstrData(tag, fields) : None
    } else if (r.matches(word("I"))) {
        if ((m = r.matches(intlit()))) {
            return new IntData(m.value)
        } else if ((m = r.matches(symbol("-"), intlit()))) {
            return new IntData(-m[1].value)
        } else {
            r.endMatch()
            return None
        }
    } else if ((m = r.matches(word("List"), group("[")))) {
        const items = allOrNone(m[1].fields.map(parseData))

        return items ? new ListData(items) : None
    } else if ((m = r.matches(word("Map"), group("[")))) {
        const pairs = allOrNone(m[1].fields.map(parseDataPair))

        return pairs ? new MapData(pairs) : None
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

        return Bls12_381_G1_element.uncompress(bytes)
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

        return Bls12_381_G2_element.uncompress(bytes)
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
        return new UplcInt(m.value)
    } else if ((m = r.matches(symbol("-"), intlit()))) {
        return new UplcInt(-m[1].value)
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
        return new UplcString(m.value)
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
    let m
    if ((m = r.matches(group("(", { length: 0 })))) {
        return new UplcUnit()
    } else {
        r.endMatch()
        return None
    }
}
