import { addInteger } from "./addInteger.js"
import { appendByteString } from "./appendByteString.js"
import { appendStringV1 } from "./appendString.js"
import { bData } from "./bData.js"
import { blake2b_256 } from "./blake2b_256.js"
import { chooseData } from "./chooseData.js"
import { chooseList } from "./chooseList.js"
import { chooseUnit } from "./chooseUnit.js"
import { consByteString } from "./consByteString.js"
import { constrData } from "./constrData.js"
import { decodeUtf8 } from "./decodeUtf8.js"
import { divideInteger } from "./divideInteger.js"
import { encodeUtf8 } from "./encodeUtf8.js"
import { equalsByteString } from "./equalsByteString.js"
import { equalsData } from "./equalsData.js"
import { equalsInteger } from "./equalsInteger.js"
import { equalsString } from "./equalsString.js"
import { fstPair } from "./fstPair.js"
import { headList } from "./headList.js"
import { iData } from "./iData.js"
import { ifThenElse } from "./ifThenElse.js"
import { indexByteString } from "./indexByteString.js"
import { lengthOfByteString } from "./lengthOfByteString.js"
import { lessThanByteString } from "./lessThanByteString.js"
import { lessThanEqualsByteString } from "./lessThanEqualsByteString.js"
import { lessThanEqualsInteger } from "./lessThanEqualsInteger.js"
import { lessThanInteger } from "./lessThanInteger.js"
import { listData } from "./listData.js"
import { mapData } from "./mapData.js"
import { mkCons } from "./mkCons.js"
import { mkNilData } from "./mkNilData.js"
import { mkNilPairData } from "./mkNilPairData.js"
import { mkPairData } from "./mkPairData.js"
import { modInteger } from "./modInteger.js"
import { multiplyInteger } from "./multiplyInteger.js"
import { nullList } from "./nullList.js"
import { quotientInteger } from "./quotientInteger.js"
import { remainderInteger } from "./remainderInteger.js"
import { sha2_256 } from "./sha2_256.js"
import { sha3_256 } from "./sha3_256.js"
import { sliceByteString } from "./sliceByteString.js"
import { sndPair } from "./sndPair.js"
import { subtractInteger } from "./subtractInteger.js"
import { tailList } from "./tailList.js"
import { trace } from "./trace.js"
import { unBData } from "./unBData.js"
import { unConstrData } from "./unConstrData.js"
import { unIData } from "./unIData.js"
import { unListData } from "./unListData.js"
import { unMapData } from "./unMapData.js"
import { verifyEd25519Signature } from "./verifyEd25519Signature.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin[]}
 */
export const builtinsV1 = [
    addInteger, // 0
    subtractInteger, // 1
    multiplyInteger, // 2
    divideInteger, // 3
    quotientInteger, // 4
    remainderInteger, // 5
    modInteger, // 6
    equalsInteger, // 7
    lessThanInteger, // 8
    lessThanEqualsInteger, // 9
    appendByteString, // 10
    consByteString, // 11
    sliceByteString, // 12
    lengthOfByteString, // 13
    indexByteString, // 14
    equalsByteString, // 15
    lessThanByteString, // 16
    lessThanEqualsByteString, // 17
    sha2_256, // 18
    sha3_256, // 19
    blake2b_256, // 20
    verifyEd25519Signature, // 21
    appendStringV1, // 22
    equalsString, // 23
    encodeUtf8, // 24
    decodeUtf8, // 25
    ifThenElse, // 26
    chooseUnit, // 27
    trace, // 28
    fstPair, // 29
    sndPair, // 30
    chooseList, // 31
    mkCons, // 32
    headList, // 33
    tailList, // 34
    nullList, // 35
    chooseData, // 36
    constrData, // 37
    mapData, // 38
    listData, // 39
    iData, // 40
    bData, // 41
    unConstrData, // 42
    unMapData, // 43
    unListData, // 44
    unIData, // 45
    unBData, // 46
    equalsData, // 47
    mkPairData, // 48
    mkNilData, // 49
    mkNilPairData // 50
]

/**
 * @type {Map<string, Builtin>}
 */
export const builtinsV1Map = new Map(builtinsV1.map((bi) => [bi.name, bi]))
