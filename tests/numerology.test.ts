import test from 'node:test';
import assert from 'node:assert/strict';
import {numerologyProfile,reductionSteps,validBirthDate} from '../lib/numerology';
import {numberMeanings,rulingByBirthNumber,subconsciousMeanings} from '../lib/number-meanings';

test('calculates the five core numbers with Pythagorean letter values',()=>{
  const p=numerologyProfile('Kirti Gunjan','1995-08-24');
  assert.equal(p.destinyTotal,53);assert.equal(p.destiny,8);
  assert.equal(p.soulUrgeTotal,22);assert.equal(p.soulUrge,22);
  assert.equal(p.personalityTotal,31);assert.equal(p.personality,4);
  assert.deepEqual(p.missing,[4,6,8]);assert.equal(p.subconscious,6);
  assert.equal(p.lifePathTotal,38);assert.equal(p.lifePath,11);
  assert.equal(p.birth,6);
  assert.deepEqual(reductionSteps(53),['5 + 3 = 8']);
});

test('treats Y as a vowel only when it sounds like one',()=>{
  assert.equal(numerologyProfile('Lynn','2000-01-01').letters[1].vowel,true);
  assert.equal(numerologyProfile('Yash','2000-01-01').letters[0].vowel,false);
  assert.equal(numerologyProfile('Ayush','2000-01-01').letters[1].vowel,false);
});

test('ignores punctuation and asks for a name in English letters',()=>{
  assert.equal(numerologyProfile(' mary-ann  d’souza ','2000-01-01').name,'MARY ANN D SOUZA');
  assert.throws(()=>numerologyProfile('कीर्ति','2000-01-01'),/English letters/);
});

test('rejects invalid dates and accepts real leap days',()=>{assert.equal(validBirthDate('2023-02-29'),false);assert.equal(validBirthDate('2000-02-29'),true);assert.equal(validBirthDate('2025-13-01'),false);assert.equal(validBirthDate('2999-01-01'),false);assert.equal(validBirthDate('1899-12-31'),false);assert.throws(()=>numerologyProfile('Kirti','bad'));});

test('has a meaning for every number the calculator can produce',()=>{
  for(const n of [1,2,3,4,5,6,7,8,9,11,22,33])assert.ok(numberMeanings[n].strengths.length&&numberMeanings[n].challenges.length);
  for(let n=1;n<=9;n++){assert.ok(rulingByBirthNumber[n].planet);assert.ok(subconsciousMeanings[n]);}
});
