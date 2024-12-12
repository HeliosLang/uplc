import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { makeConstrData } from './ConstrData.js';
import { UPLC_DATA_NODE_MEM_SIZE } from './UplcData.js';

describe('ConstrData', () => {
    describe('memSize', () => {
        it('should calculate the memory size correctly', () => {
            const fieldData1 = { memSize: 32 }; // Mock field data
            const fieldData2 = { memSize: 64 }; // Mock field data
            const constrData = makeConstrData(1, [fieldData1, fieldData2]);
            const expectedMemSize = UPLC_DATA_NODE_MEM_SIZE + fieldData1.memSize + fieldData2.memSize;
            assert.strictEqual(constrData.memSize, expectedMemSize);
        });
    });
});
