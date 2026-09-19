export function validBirthDate(value:string):boolean {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const date=new Date(value+'T12:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0,10)===value && Number(value.slice(0,4))>=1900 && value<=new Date().toISOString().slice(0,10);
}
export function reduceNumber(n:number):number{while(n>9)n=String(n).split('').reduce((sum,d)=>sum+Number(d),0);return n;}
export function calculateNumbers(dob:string){
  if(!validBirthDate(dob))throw new Error('Enter a valid birth date between 1900 and today.');
  const day=Number(dob.slice(8));const digits=dob.replaceAll('-','').split('').map(Number);const total=digits.reduce((a,b)=>a+b,0);
  return {birth:reduceNumber(day),life:reduceNumber(total),day,total,explanation:`Birth number: ${String(day).split('').join(' + ')} → ${reduceNumber(day)}. Life path: ${digits.join(' + ')} = ${total} → ${reduceNumber(total)}. We use single-digit reduction (1–9), including compound numbers.`};
}
