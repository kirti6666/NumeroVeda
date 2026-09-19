import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateNumbers,validBirthDate} from '../lib/numerology';
test('calculates and explains numbers without collecting personal information',()=>{const result=calculateNumbers('1995-08-24');assert.equal(result.birth,6);assert.equal(result.life,2);assert.equal(result.total,38);assert.match(result.explanation,/single-digit/);});
test('rejects invalid dates and accepts real leap days',()=>{assert.equal(validBirthDate('2023-02-29'),false);assert.equal(validBirthDate('2000-02-29'),true);assert.equal(validBirthDate('2025-13-01'),false);assert.equal(validBirthDate('2999-01-01'),false);assert.equal(validBirthDate('1899-12-31'),false);assert.throws(()=>calculateNumbers('bad'));});
