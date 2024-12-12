import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { makeConstrData } from './ConstrData.js';
import { UplcData } from '../index.js'; // Adjust the import as per actual UplcData location

describe('ConstrData', () => {
    describe('memSize', () => {
        it('should return correct memory size for ConstrData', () => {
            const data = makeConstrData(1, [new UplcData(/* provide necessary parameters here */)]);
            const expectedSize = /* calculate expected size based on your implementation */;
            assert.equal(data.memSize, expectedSize);
        });
    });
});