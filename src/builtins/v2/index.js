import { addInteger } from "../v1/addInteger.js"
import { appendByteString } from "../v1/appendByteString.js"
import { appendStringV1 } from "../v1/appendString.js"
import { bData } from "../v1/bData.js"
import { blake2b_256 } from "../v1/blake2b_256.js"
import { chooseData } from "../v1/chooseData.js"
import { chooseList } from "../v1/chooseList.js"
import { chooseUnit } from "../v1/chooseUnit.js"
import { consByteString } from "../v1/consByteString.js"
import { constrData } from "../v1/constrData.js"
import { decodeUtf8 } from "../v1/decodeUtf8.js"
import { divideInteger } from "../v1/divideInteger.js"
import { encodeUtf8 } from "../v1/encodeUtf8.js"
import { equalsByteString } from "../v1/equalsByteString.js"
import { equalsData } from "../v1/equalsData.js"
import { equalsInteger } from "../v1/equalsInteger.js"
import { equalsString } from "../v1/equalsString.js"
import { fstPair } from "../v1/fstPair.js"
import { headList } from "../v1/headList.js"
import { iData } from "../v1/iData.js"
import { ifThenElse } from "../v1/ifThenElse.js"
import { indexByteString } from "../v1/indexByteString.js"
import { lengthOfByteString } from "../v1/lengthOfByteString.js"
import { lessThanByteString } from "../v1/lessThanByteString.js"
import { lessThanEqualsByteString } from "../v1/lessThanEqualsByteString.js"
import { lessThanEqualsInteger } from "../v1/lessThanEqualsInteger.js"
import { lessThanInteger } from "../v1/lessThanInteger.js"
import { listData } from "../v1/listData.js"
import { mapData } from "../v1/mapData.js"
import { mkCons } from "../v1/mkCons.js"
import { mkNilData } from "../v1/mkNilData.js"
import { mkNilPairData } from "../v1/mkNilPairData.js"
import { mkPairData } from "../v1/mkPairData.js"
import { modInteger } from "../v1/modInteger.js"
import { multiplyInteger } from "../v1/multiplyInteger.js"
import { nullList } from "../v1/nullList.js"
import { quotientInteger } from "../v1/quotientInteger.js"
import { remainderInteger } from "../v1/remainderInteger.js"
import { serialiseData } from "./serialiseData.js"
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
import { verifyEcdsaSecp256k1Signature } from "./verifyEcdsaSecp256k1Signature.js"
import { verifyEd25519Signature } from "./verifyEd25519Signature.js"
import { verifySchnorrSecp256k1Signature } from "./verifySchnorrSecp256k1Signature.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin[]}
 */
export const builtinsV2 = [
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
    mkNilPairData, // 50
    serialiseData, // 51
    verifyEcdsaSecp256k1Signature, // 52
    verifySchnorrSecp256k1Signature // 53
]

/**
 * @type {Map<string, Builtin>}
 */
export const builtinsV2Map = new Map(builtinsV2.map((bi) => [bi.name, bi]))
