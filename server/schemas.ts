import {z} from 'zod';
import {validBirthDate} from '../lib/numerology';
import {signs} from '../lib/types';
import {activeFields,reportDefinition} from '../lib/report-catalog';
const text=(n=200)=>z.string().trim().max(n);
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{const d=new Date(v+'T12:00:00Z');return !isNaN(d.getTime())&&d.toISOString().slice(0,10)===v;},'Enter a real calendar date.');
const language=z.enum(['English','Hindi']);
const base={id:z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),published:z.boolean(),version:z.number().int().optional()};
const ordered={...base,order:z.number().int().min(0).max(999)};
export const schemas={
 products:z.object({...ordered,name:text(100).min(2),description:text(600).min(10),price:z.number().int().min(100).max(10000000),features:z.array(text(150).min(1)).min(1).max(12)}),
 experts:z.object({...ordered,name:text(100).min(2),specialty:text(150).min(2),bio:text(2000),image:z.string().regex(/^$|^\/api\/media\/[a-f0-9-]+\.webp$/)}).refine(e=>!e.published||!!e.image,{message:'Upload a portrait before publishing this expert.'}),
 testimonials:z.object({...ordered,name:text(100).min(2),quote:text(1500).min(10),service:text(100),consent:z.boolean()}).refine(e=>!e.published||e.consent,{message:'Confirm customer permission before publishing.'}),
 horoscopes:z.object({...base,date,sign:z.enum(signs),language,reading:text(5000)}).refine(e=>!e.published||e.reading.length>=20,{message:'Write at least 20 characters before publishing.'}),
 panchang:z.object({...base,date,city:text(100).min(2),language,timezone:text(100).refine(v=>{try{new Intl.DateTimeFormat('en',{timeZone:v});return true;}catch{return false;}},'Enter a valid IANA time zone.'),tithi:text(),nakshatra:text(),yoga:text(),karana:text(),sunrise:text(),sunset:text(),rahuKalam:text(),notes:text(2500),source:text(600)}).refine(e=>!e.published||[e.tithi,e.nakshatra,e.yoga,e.karana,e.sunrise,e.sunset,e.rahuKalam,e.source].every(Boolean),{message:'Complete all Panchang fields and the verification source before publishing.'})
};
export const settingsSchema=z.object({brand:text(60).min(2),tagline:text(150),email:z.union([z.literal(''),z.email()]),phone:text(30),city:text(100).min(2),language,heroTitle:text(150).min(10),heroDescription:text(500).min(20),paymentsEnabled:z.boolean(),refundPolicy:text(10000).min(30),privacyPolicy:text(10000).min(30),terms:text(10000).min(30)});
export const orderSchema=z.object({productId:text(100).min(1),name:text(120).min(2),email:z.email().max(200),phone:z.string().regex(/^[6-9]\d{9}$/,'Enter a 10-digit Indian mobile number.'),address:text(400).default(''),dob:z.string().default(''),question:text(3000).default(''),answers:z.record(z.string().max(60),text(3000)).default({}),language,consent:z.literal(true)}).superRefine((input,ctx)=>{
 const answers:Record<string,string>={...input.answers,dob:input.answers.dob||input.dob,question:input.answers.question||input.question};
 const fields=activeFields(input.productId,answers);
 for(const field of fields){const value=answers[field.key]||'';const error=(message:string)=>ctx.addIssue({code:'custom',path:['answers',field.key],message});
  if(field.required&&!value){error(`${field.label} is required.`);continue;}
  if(!value)continue;
  if(field.type==='multi'){const selected=value.split(' | ');if(selected.length>3||new Set(selected).size!==selected.length||selected.some(v=>!field.options?.includes(v)))error('Choose between one and three valid focus areas.');}
  if(field.options&&field.type!=='multi'&&!field.options.includes(value))error(`Choose a valid option for ${field.label}.`);
  if(field.type==='date'){if(!date.safeParse(value).success)error(`Enter a valid date for ${field.label}.`);else if(!['dateFrom','dateTo'].includes(field.key)&&!validBirthDate(value))error(`Enter a valid birth date for ${field.label}.`);}
  if(field.type==='month'&&!/^\d{4}-(0[1-9]|1[0-2])$/.test(value))error('Enter a valid due month.');
  if(field.type==='time'&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))error('Enter a valid birth time.');
  if(field.key==='targetYear'&&(!/^\d{4}$/.test(value)||Number(value)<1900||Number(value)>2200))error('Target year must be between 1900 and 2200.');
 }
 if(answers.dateFrom&&answers.dateTo&&answers.dateFrom>answers.dateTo)ctx.addIssue({code:'custom',path:['answers','dateTo'],message:'End date must be on or after the start date.'});
 if(!reportDefinition(input.productId)&&!validBirthDate(input.dob))ctx.addIssue({code:'custom',path:['dob'],message:'Enter a valid birth date.'});
 if(Object.values(input.answers).join('').length>24000)ctx.addIssue({code:'custom',path:['answers'],message:'Please shorten your report details.'});
});

