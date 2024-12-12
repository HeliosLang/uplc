'use strict';

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { makeConstrData } from './ConstrData.js';
import { UPLC_DATA_NODE_MEM_SIZE } from './UplcData.js';

describe('ConstrData', () => {
    describe('memSize', () => {
        it('should calculate the correct memory size for ConstrData with fields', () => {
            const fields = [
                // Mock UplcData fields with a .memSize property
                { memSize: 10 },
                { memSize: 20 },
                { memSize: 30 },
            ];
            const constrData = makeConstrData(1, fields);
            const expectedMemSize = UPLC_DATA_NODE_MEM_SIZE + fields[0].memSize + fields[1].memSize + fields[2].memSize;
            assert.equal(constrData.memSize, expectedMemSize);
        });

        it('should calculate the correct memory size for ConstrData with no fields', () => {
            const constrData = makeConstrData(1, []);
            assert.equal(constrData.memSize, UPLC_DATA_NODE_MEM_SIZE);
        });
    });
});
