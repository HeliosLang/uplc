import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { makeConstrData } from './ConstrData.js';
import { UPLC_DATA_NODE_MEM_SIZE } from './UplcData.js';

// Boilerplate unit tests for ConstrData

test('ConstrData.memSize', () => {
    const testTag = 1;
    const testFields = [{ memSize: 5 }, { memSize: 10 }];
    const constrData = makeConstrData(testTag, testFields);

    // Assume UPLC_DATA_NODE_MEM_SIZE is a constant import, adjust based on your logic.
    const expectedMemSize = UPLC_DATA_NODE_MEM_SIZE + testFields.reduce((sum, field) => sum + field.memSize, 0);

    assert.equal(constrData.memSize, expectedMemSize);
});
