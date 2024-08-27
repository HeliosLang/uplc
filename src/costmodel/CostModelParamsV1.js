import { ERA } from "@helios-lang/era"

/**
 * @returns {number[]}
 */
export function DEFAULT_COST_MODEL_PARAMS_V1() {
    switch (ERA) {
        case "Babbage":
            return BABBAGE_COST_MODEL_PARAMS_V1
        case "Conway":
            return CONWAY_COST_MODEL_PARAMS_V1
    }
}

/**
 * @type {number[]}
 */
export const BABBAGE_COST_MODEL_PARAMS_V1 = [
    205665, // 0: addInteger-cpu-arguments-intercept
    812, // 1: addInteger-cpu-arguments-slope
    1, // 2: addInteger-memory-arguments-intercept
    1, // 3: addInteger-memory-arguments-slope
    1000, // 4: appendByteString-cpu-arguments-intercept
    571, // 5: appendByteString-cpu-arguments-slope
    0, // 6: appendByteString-memory-arguments-intercept
    1, // 7: appendByteString-memory-arguments-slope
    1000, // 8: appendString-cpu-arguments-intercept
    24177, // 9: appendString-cpu-arguments-slope
    4, // 10: appendString-memory-arguments-intercept
    1, // 11: appendString-memory-arguments-slope
    1000, // 12: bData-cpu-arguments
    32, // 13: bData-memory-arguments
    117366, // 14: blake2b_256-cpu-arguments-intercept
    10475, // 15: blake2b_256-cpu-arguments-slope
    4, // 16: blake2b_256-memory-arguments
    23000, // 17: cekApplyCost-exBudgetCPU
    100, // 18: cekApplyCost-exBudgetMemory
    23000, // 19: cekBuiltinCost-exBudgetCPU
    100, // 20: cekBuiltinCost-exBudgetMemory
    23000, // 21: cekConstCost-exBudgetCPU
    100, // 22: cekConstCost-exBudgetMemory
    23000, // 23: cekDelayCost-exBudgetCPU
    100, // 24: cekDelayCost-exBudgetMemory
    23000, // 25: cekForceCost-exBudgetCPU
    100, // 26: cekForceCost-exBudgetMemory
    23000, // 27: cekLamCost-exBudgetCPU
    100, // 28: cekLamCost-exBudgetMemory
    100, // 29: cekStartupCost-exBudgetCPU
    100, // 30: cekStartupCost-exBudgetMemory
    23000, // 31: cekVarCost-exBudgetCPU
    100, // 32: cekVarCost-exBudgetMemory
    19537, // 33: chooseData-cpu-arguments
    32, // 34: chooseData-memory-arguments
    175354, // 35: chooseList-cpu-arguments
    32, // 36: chooseList-memory-arguments
    46417, // 37: chooseUnit-cpu-arguments
    4, // 38: chooseUnit-memory-arguments
    221973, // 39: consByteString-cpu-arguments-intercept
    511, // 40: consByteString-cpu-arguments-slope
    0, // 41: consByteString-memory-arguments-intercept
    1, // 42: consByteString-memory-arguments-slope
    89141, // 43: constrData-cpu-arguments
    32, // 44: constrData-memory-arguments
    497525, // 45: decodeUtf8-cpu-arguments-intercept
    14068, // 46: decodeUtf8-cpu-arguments-slope
    4, // 47: decodeUtf8-memory-arguments-intercept
    2, // 48: decodeUtf8-memory-arguments-slope
    196500, // 49: divideInteger-cpu-arguments-constant
    453240, // 50: divideInteger-cpu-arguments-model-arguments-intercept
    220, // 51: divideInteger-cpu-arguments-model-arguments-slope
    0, // 52: divideInteger-memory-arguments-intercept
    1, // 53: divideInteger-memory-arguments-minimum
    1, // 54: divideInteger-memory-arguments-slope
    1000, // 55: encodeUtf8-cpu-arguments-intercept
    28662, // 56: encodeUtf8-cpu-arguments-slope
    4, // 57: encodeUtf8-memory-arguments-intercept
    2, // 58: encodeUtf8-memory-arguments-slope
    245000, // 59: equalsByteString-cpu-arguments-constant
    216773, // 60: equalsByteString-cpu-arguments-intercept
    62, // 61: equalsByteString-cpu-arguments-slope
    1, // 62: equalsByteString-memory-arguments
    1060367, // 63: equalsData-cpu-arguments-intercept
    12586, // 64: equalsData-cpu-arguments-slope
    1, // 65: equalsData-memory-arguments
    208512, // 66: equalsInteger-cpu-arguments-intercept
    421, // 67: equalsInteger-cpu-arguments-slope
    1, // 68: equalsInteger-memory-arguments
    187000, // 69: equalsString-cpu-arguments-constant
    1000, // 70: equalsString-cpu-arguments-intercept
    52998, // 71: equalsString-cpu-arguments-slope
    1, // 72: equalsString-memory-arguments
    80436, // 73: fstPair-cpu-arguments
    32, // 74: fstPair-memory-arguments
    43249, // 75: headList-cpu-arguments
    32, // 76: headList-memory-arguments
    1000, // 77: iData-cpu-arguments
    32, // 78: iData-memory-arguments
    80556, // 79: ifThenElse-cpu-arguments
    1, // 80: ifThenElse-memory-arguments
    57667, // 81: indexByteString-cpu-arguments
    4, // 82: indexByteString-memory-arguments
    1000, // 83: lengthOfByteString-cpu-arguments
    10, // 84: lengthOfByteString-memory-arguments
    197145, // 85: lessThanByteString-cpu-arguments-intercept
    156, // 86: lessThanByteString-cpu-arguments-slope
    1, // 87: lessThanByteString-memory-arguments
    197145, // 88: lessThanEqualsByteString-cpu-arguments-intercept
    156, // 89: lessThanEqualsByteString-cpu-arguments-slope
    1, // 90: lessThanEqualsByteString-memory-arguments
    204924, // 91: lessThanEqualsInteger-cpu-arguments-intercept
    473, // 92: lessThanEqualsInteger-cpu-arguments-slope
    1, // 93: lessThanEqualsInteger-memory-arguments
    208896, // 94: lessThanInteger-cpu-arguments-intercept
    511, // 95: lessThanInteger-cpu-arguments-slope
    1, // 96: lessThanInteger-memory-arguments
    52467, // 97: listData-cpu-arguments
    32, // 98: listData-memory-arguments
    64832, // 99: mapData-cpu-arguments
    32, // 100: mapData-memory-arguments
    65493, // 101: mkCons-cpu-arguments
    32, // 102: mkCons-memory-arguments
    22558, // 103: mkNilData-cpu-arguments
    32, // 104: mkNilData-memory-arguments
    16563, // 105: mkNilPairData-cpu-arguments
    32, // 106: mkNilPairData-memory-arguments
    76511, // 107: mkPairData-cpu-arguments
    32, // 108: mkPairData-memory-arguments
    196500, // 109: modInteger-cpu-arguments-constant
    453240, // 110: modInteger-cpu-arguments-model-arguments-intercept
    220, // 111: modInteger-cpu-arguments-model-arguments-slope
    0, // 112: modInteger-memory-arguments-intercept
    1, // 113: modInteger-memory-arguments-minimum
    1, // 114: modInteger-memory-arguments-slope
    69522, // 115: multiplyInteger-cpu-arguments-intercept
    11687, // 116: multiplyInteger-cpu-arguments-slope
    0, // 117: multiplyInteger-memory-arguments-intercept
    1, // 118: multiplyInteger-memory-arguments-slope
    60091, // 119: nullList-cpu-arguments
    32, // 120: nullList-memory-arguments
    196500, // 121: quotientInteger-cpu-arguments-constant
    453240, // 122: quotientInteger-cpu-arguments-model-arguments-intercept
    220, // 123: quotientInteger-cpu-arguments-model-arguments-slope
    0, // 124: quotientInteger-memory-arguments-intercept
    1, // 125: quotientInteger-memory-arguments-minimum
    1, // 126: quotientInteger-memory-arguments-slope
    196500, // 127: remainderInteger-cpu-arguments-constant
    453240, // 128: remainderInteger-cpu-arguments-model-arguments-intercept
    220, // 129: remainderInteger-cpu-arguments-model-arguments-slope
    0, // 130: remainderInteger-memory-arguments-intercept
    1, // 131: remainderInteger-memory-arguments-minimum
    1, // 132: remainderInteger-memory-arguments-slope
    806990, // 133: sha2_256-cpu-arguments-intercept
    30482, // 134: sha2_256-cpu-arguments-slope
    4, // 135: sha2_256-memory-arguments
    1927926, // 136: sha3_256-cpu-arguments-intercept
    82523, // 137: sha3_256-cpu-arguments-slope
    4, // 138: sha3_256-memory-arguments
    265318, // 139: sliceByteString-cpu-arguments-intercept
    0, // 140: sliceByteString-cpu-arguments-slope
    4, // 141: sliceByteString-memory-arguments-intercept
    0, // 142: sliceByteString-memory-arguments-slope
    85931, // 143: sndPair-cpu-arguments
    32, // 144: sndPair-memory-arguments
    205665, // 145: subtractInteger-cpu-arguments-intercept
    812, // 146: subtractInteger-cpu-arguments-slope
    1, // 147: subtractInteger-memory-arguments-intercept
    1, // 148: subtractInteger-memory-arguments-slope
    41182, // 149: tailList-cpu-arguments
    32, // 150: tailList-memory-arguments
    212342, // 151: trace-cpu-arguments
    32, // 152: trace-memory-arguments
    31220, // 153: unBData-cpu-arguments
    32, // 154: unBData-memory-arguments
    32696, // 155: unConstrData-cpu-arguments
    32, // 156: unConstrData-memory-arguments
    43357, // 157: unIData-cpu-arguments
    32, // 158: unIData-memory-arguments
    32247, // 159: unListData-cpu-arguments
    32, // 160: unListData-memory-arguments
    38314, // 161: unMapData-cpu-arguments
    32, // 162: unMapData-memory-arguments
    9462713, // 163: verifyEd25519Signature-cpu-arguments-intercept
    1021, // 164: verifyEd25519Signature-cpu-arguments-slope
    10 // 165: verifyEd25519Signature-memory-arguments
]

/**
 * @type {number[]}
 */
export const CONWAY_COST_MODEL_PARAMS_V1 = [
    100788, // 0: addInteger-cpu-arguments-intercept
    420, // 1: addInteger-cpu-arguments-slope
    1, // 2: addInteger-memory-arguments-intercept
    1, // 3: addInteger-memory-arguments-slope
    1000, // 4: appendByteString-cpu-arguments-intercept
    173, // 5: appendByteString-cpu-arguments-slope
    0, // 6: appendByteString-memory-arguments-intercept
    1, // 7: appendByteString-memory-arguments-slope
    1000, // 8: appendString-cpu-arguments-intercept
    59957, // 9: appendString-cpu-arguments-slope
    4, // 10: appendString-memory-arguments-intercept
    1, // 11: appendString-memory-arguments-slope
    11183, // 12: bData-cpu-arguments
    32, // 13: bData-memory-arguments
    201305, // 14: blake2b_256-cpu-arguments-intercept
    8356, // 15: blake2b_256-cpu-arguments-slope
    4, // 16: blake2b_256-memory-arguments
    16000, // 17: cekApplyCost-exBudgetCPU
    100, // 18: cekApplyCost-exBudgetMemory
    16000, // 19: cekBuiltinCost-exBudgetCPU
    100, // 20: cekBuiltinCost-exBudgetMemory
    16000, // 21: cekConstCost-exBudgetCPU
    100, // 22: cekConstCost-exBudgetMemory
    16000, // 23: cekDelayCost-exBudgetCPU
    100, // 24: cekDelayCost-exBudgetMemory
    16000, // 25: cekForceCost-exBudgetCPU
    100, // 26: cekForceCost-exBudgetMemory
    16000, // 27: cekLamCost-exBudgetCPU
    100, // 28: cekLamCost-exBudgetMemory
    100, // 29: cekStartupCost-exBudgetCPU
    100, // 30: cekStartupCost-exBudgetMemory
    16000, // 31: cekVarCost-exBudgetCPU
    100, // 32: cekVarCost-exBudgetMemory
    94375, // 33: chooseData-cpu-arguments
    32, // 34: chooseData-memory-arguments
    132994, // 35: chooseList-cpu-arguments
    32, // 36: chooseList-memory-arguments
    61462, // 37: chooseUnit-cpu-arguments
    4, // 38: chooseUnit-memory-arguments
    72010, // 39: consByteString-cpu-arguments-intercept
    178, // 40: consByteString-cpu-arguments-slope
    0, // 41: consByteString-memory-arguments-intercept
    1, // 42: consByteString-memory-arguments-slope
    22151, // 43: constrData-cpu-arguments
    32, // 44: constrData-memory-arguments
    91189, // 45: decodeUtf8-cpu-arguments-intercept
    769, // 46: decodeUtf8-cpu-arguments-slope
    4, // 47: decodeUtf8-memory-arguments-intercept
    2, // 48: decodeUtf8-memory-arguments-slope
    85848, // 49: divideInteger-cpu-arguments-constant
    228465, // 50: divideInteger-cpu-arguments-model-arguments-intercept
    122, // 51: divideInteger-cpu-arguments-model-arguments-slope
    0, // 52: divideInteger-memory-arguments-intercept
    1, // 53: divideInteger-memory-arguments-minimum
    1, // 54: divideInteger-memory-arguments-slope
    1000, // 55: encodeUtf8-cpu-arguments-intercept
    42921, // 56: encodeUtf8-cpu-arguments-slope
    4, // 57: encodeUtf8-memory-arguments-intercept
    2, // 58: encodeUtf8-memory-arguments-slope
    24548, // 59: equalsByteString-cpu-arguments-constant
    29498, // 60: equalsByteString-cpu-arguments-intercept
    38, // 61: equalsByteString-cpu-arguments-slope
    1, // 62: equalsByteString-memory-arguments
    898148, // 63: equalsData-cpu-arguments-intercept
    27279, // 64: equalsData-cpu-arguments-slope
    1, // 65: equalsData-memory-arguments
    51775, // 66: equalsInteger-cpu-arguments-intercept
    558, // 67: equalsInteger-cpu-arguments-slope
    1, // 68: equalsInteger-memory-arguments
    39184, // 69: equalsString-cpu-arguments-constant
    1000, // 70: equalsString-cpu-arguments-intercept
    60594, // 71: equalsString-cpu-arguments-slope
    1, // 72: equalsString-memory-arguments
    141895, // 73: fstPair-cpu-arguments
    32, // 74: fstPair-memory-arguments
    83150, // 75: headList-cpu-arguments
    32, // 76: headList-memory-arguments
    15299, // 77: iData-cpu-arguments
    32, // 78: iData-memory-arguments
    76049, // 79: ifThenElse-cpu-arguments
    1, // 80: ifThenElse-memory-arguments
    13169, // 81: indexByteString-cpu-arguments
    4, // 82: indexByteString-memory-arguments
    22100, // 83: lengthOfByteString-cpu-arguments
    10, // 84: lengthOfByteString-memory-arguments
    28999, // 85: lessThanByteString-cpu-arguments-intercept
    74, // 86: lessThanByteString-cpu-arguments-slope
    1, // 87: lessThanByteString-memory-arguments
    28999, // 88: lessThanEqualsByteString-cpu-arguments-intercept
    74, // 89: lessThanEqualsByteString-cpu-arguments-slope
    1, // 90: lessThanEqualsByteString-memory-arguments
    43285, // 91: lessThanEqualsInteger-cpu-arguments-intercept
    552, // 92: lessThanEqualsInteger-cpu-arguments-slope
    1, // 93: lessThanEqualsInteger-memory-arguments
    44749, // 94: lessThanInteger-cpu-arguments-intercept
    541, // 95: lessThanInteger-cpu-arguments-slope
    1, // 96: lessThanInteger-memory-arguments
    33852, // 97: listData-cpu-arguments
    32, // 98: listData-memory-arguments
    68246, // 99: mapData-cpu-arguments
    32, // 100: mapData-memory-arguments
    72362, // 101: mkCons-cpu-arguments
    32, // 102: mkCons-memory-arguments
    7243, // 103: mkNilData-cpu-arguments
    32, // 104: mkNilData-memory-arguments
    7391, // 105: mkNilPairData-cpu-arguments
    32, // 106: mkNilPairData-memory-arguments
    11546, // 107: mkPairData-cpu-arguments
    32, // 108: mkPairData-memory-arguments
    85848, // 109: modInteger-cpu-arguments-constant
    228465, // 110: modInteger-cpu-arguments-model-arguments-intercept
    122, // 111: modInteger-cpu-arguments-model-arguments-slope
    0, // 112: modInteger-memory-arguments-intercept
    1, // 113: modInteger-memory-arguments-minimum
    1, // 114: modInteger-memory-arguments-slope
    90434, // 115: multiplyInteger-cpu-arguments-intercept
    519, // 116: multiplyInteger-cpu-arguments-slope
    0, // 117: multiplyInteger-memory-arguments-intercept
    1, // 118: multiplyInteger-memory-arguments-slope
    74433, // 119: nullList-cpu-arguments
    32, // 120: nullList-memory-arguments
    85848, // 121: quotientInteger-cpu-arguments-constant
    228465, // 122: quotientInteger-cpu-arguments-model-arguments-intercept
    122, // 123: quotientInteger-cpu-arguments-model-arguments-slope
    0, // 124: quotientInteger-memory-arguments-intercept
    1, // 125: quotientInteger-memory-arguments-minimum
    1, // 126: quotientInteger-memory-arguments-slope
    85848, // 127: remainderInteger-cpu-arguments-constant
    228465, // 128: remainderInteger-cpu-arguments-model-arguments-intercept
    122, // 129: remainderInteger-cpu-arguments-model-arguments-slope
    0, // 130: remainderInteger-memory-arguments-intercept
    1, // 131: remainderInteger-memory-arguments-minimum
    1, // 132: remainderInteger-memory-arguments-slope
    270652, // 133: sha2_256-cpu-arguments-intercept
    22588, // 134: sha2_256-cpu-arguments-slope
    4, // 135: sha2_256-memory-arguments
    1457325, // 136: sha3_256-cpu-arguments-intercept
    64566, // 137: sha3_256-cpu-arguments-slope
    4, // 138: sha3_256-memory-arguments
    20467, // 139: sliceByteString-cpu-arguments-intercept
    1, // 140: sliceByteString-cpu-arguments-slope
    4, // 141: sliceByteString-memory-arguments-intercept
    0, // 142: sliceByteString-memory-arguments-slope
    141992, // 143: sndPair-cpu-arguments
    32, // 144: sndPair-memory-arguments
    100788, // 145: subtractInteger-cpu-arguments-intercept
    420, // 146: subtractInteger-cpu-arguments-slope
    1, // 147: subtractInteger-memory-arguments-intercept
    1, // 148: subtractInteger-memory-arguments-slope
    81663, // 149: tailList-cpu-arguments
    32, // 150: tailList-memory-arguments
    59498, // 151: trace-cpu-arguments
    32, // 152: trace-memory-arguments
    20142, // 153: unBData-cpu-arguments
    32, // 154: unBData-memory-arguments
    24588, // 155: unConstrData-cpu-arguments
    32, // 156: unConstrData-memory-arguments
    20744, // 157: unIData-cpu-arguments
    32, // 158: unIData-memory-arguments
    25933, // 159: unListData-cpu-arguments
    32, // 160: unListData-memory-arguments
    24623, // 161: unMapData-cpu-arguments
    32, // 162: unMapData-memory-arguments
    53384111, // 163: verifyEd25519Signature-cpu-arguments-intercept
    14333, // 164: verifyEd25519Signature-cpu-arguments-slope
    10 // 165: verifyEd25519Signature-memory-arguments
]
