import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { memSize } from "./ConstrData.js";

// Test cases for memSize function

describe("memSize", () => {
    it(`memSize of 0 is 1`, () => {
        strictEqual(memSize(0), 1);
    });
    
it(`memSize of 255 is 1`, () => {
        strictEqual(memSize(255), 1);
    });
    
it(`memSize of -255 is 1`, () => {
        strictEqual(memSize(-255), 1);
    });
    
it(`memSize of 65536 is 2`, () => {
        strictEqual(memSize(65536), 2);
    });
    
it(`memSize of -65536 is 2`, () => {
        strictEqual(memSize(-65536), 2);
    });
    
it(`memSize of 4294967295 is 2`, () => {
        strictEqual(memSize(4294967295), 2);
    });
    
it(`memSize of -4294967295 is 2`, () => {
        strictEqual(memSize(-4294967295), 2);
    });
    
it(`memSize of 18446744073709551615 is 3`, () => {
        strictEqual(memSize(18446744073709551615), 3);
    });
    
it(`memSize of 18446744073709551616 is 4`, () => {
        strictEqual(memSize(18446744073709551616), 4);
    });
});