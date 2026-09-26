export function validBirthDate(value:string):boolean {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const date=new Date(value+'T12:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0,10)===value && Number(value.slice(0,4))>=1900 && value<=new Date().toISOString().slice(0,10);
}
function digitSum(n:number){return String(n).split('').reduce((sum,d)=>sum+Number(d),0);}
export function reduceNumber(n:number):number{while(n>9)n=digitSum(n);return n;}
const masterNumbers=new Set([11,22,33]);
export function reduceKeepingMaster(n:number):number{while(n>9&&!masterNumbers.has(n))n=digitSum(n);return n;}
export function reductionSteps(total:number):string[]{const steps:string[]=[];let n=total;while(n>9&&!masterNumbers.has(n)){const next=digitSum(n);steps.push(`${String(n).split('').join(' + ')} = ${next}`);n=next;}return steps;}

export const letterValues:Record<string,number>=Object.fromEntries('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter,i)=>[letter,i%9+1]));
const plainVowels=new Set(['A','E','I','O','U']);
// Y counts as a vowel only when neither neighbour in the word is a vowel (Lynn, Vyas), not in Yash or Ayush.
function isVowel(word:string,i:number){const l=word[i];if(plainVowels.has(l))return true;return l==='Y'&&!plainVowels.has(word[i-1]??'')&&!plainVowels.has(word[i+1]??'');}

export type NameLetter={letter:string;value:number;vowel:boolean;word:number};
export type NumberProfile={
  name:string;dob:string;letters:NameLetter[];
  birth:number;
  lifePath:number;lifePathDigits:number[];lifePathTotal:number;
  destiny:number;destinyTotal:number;
  soulUrge:number|null;soulUrgeTotal:number;
  personality:number|null;personalityTotal:number;
  subconscious:number;missing:number[];
};
export function numerologyProfile(name:string,dob:string):NumberProfile{
  if(!validBirthDate(dob))throw new Error('Enter a valid birth date between 1900 and today.');
  const words=name.trim().toUpperCase().split(/[^A-Z]+/).filter(Boolean);
  const letters=words.flatMap((w,word)=>w.split('').map((letter,i)=>({letter,value:letterValues[letter],vowel:isVowel(w,i),word})));
  if(letters.length<2)throw new Error('Enter your full name in English letters.');
  const sum=(list:NameLetter[])=>list.reduce((s,l)=>s+l.value,0);
  const lifePathDigits=dob.replaceAll('-','').split('').map(Number);
  const lifePathTotal=lifePathDigits.reduce((a,b)=>a+b,0);
  const destinyTotal=sum(letters);
  const soulUrgeTotal=sum(letters.filter(l=>l.vowel));
  const personalityTotal=sum(letters.filter(l=>!l.vowel));
  const present=new Set(letters.map(l=>l.value));
  const missing=[1,2,3,4,5,6,7,8,9].filter(n=>!present.has(n));
  return {
    name:words.join(' '),dob,letters,
    birth:reduceNumber(Number(dob.slice(8))),
    lifePath:reduceKeepingMaster(lifePathTotal),lifePathDigits,lifePathTotal,
    destiny:reduceKeepingMaster(destinyTotal),destinyTotal,
    soulUrge:soulUrgeTotal?reduceKeepingMaster(soulUrgeTotal):null,soulUrgeTotal,
    personality:personalityTotal?reduceKeepingMaster(personalityTotal):null,personalityTotal,
    subconscious:9-missing.length,missing,
  };
}
