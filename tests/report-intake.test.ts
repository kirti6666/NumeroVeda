import test from 'node:test';
import assert from 'node:assert/strict';
import {orderSchema} from '../server/schemas';
import {reportCatalog,activeFields} from '../lib/report-catalog';
const contact={name:'Test Customer',email:'customer@example.test',phone:'9876543210',language:'English',consent:true};
test('all nine report categories accept complete relevant details without an unnecessary contact DOB',()=>{
 assert.equal(reportCatalog.length,9);
 for(const report of reportCatalog){const answers:Record<string,string>={};for(const field of report.fields){if(field.when||!field.required)continue;answers[field.key]=field.options?.[0]||(field.type==='date'?(field.key.startsWith('date')?'2027-01-01':'1995-08-24'):field.type==='number'?'2027':'A considered question');}for(const field of activeFields(report.id,answers)){if(field.required&&!answers[field.key])answers[field.key]=field.options?.[0]||(field.type==='date'?'1995-08-24':'Details for review');}assert.equal(orderSchema.safeParse({...contact,productId:report.id,answers}).success,true,report.name);}
});
test('category requirements are enforced server-side',()=>{
 for(const report of reportCatalog)assert.equal(orderSchema.safeParse({...contact,productId:report.id}).success,false,report.name);
 const result=orderSchema.safeParse({...contact,productId:'business-name',answers:{industry:'Retail',businessStage:'New business',namingMode:'Request suggestions',preferences:'Short and memorable',question:'A memorable business name'}});
 assert.equal(result.success,true);
});
test('astrological muhurat requires birth times and places for both partners',()=>{
 const answers={personOne:'First Partner',personTwo:'Second Partner',dobOne:'1995-08-24',dobTwo:'1996-01-12',dateFrom:'2027-01-01',dateTo:'2027-02-01',city:'Delhi, India',method:'Astrological muhurat'};
 assert.equal(orderSchema.safeParse({...contact,productId:'marriage-date',answers}).success,false);
 const complete={...answers,birthTimeOne:'09:30',birthTimeTwo:'18:00',birthplaceOne:'Delhi, India',birthplaceTwo:'Mumbai, India'};
 assert.equal(orderSchema.safeParse({...contact,productId:'marriage-date',answers:complete}).success,true);
 assert.equal(orderSchema.safeParse({...contact,productId:'marriage-date',answers:{...complete,dateTo:'2026-01-01'}}).success,false);
});
test('optional dates, invalid choices, and forecast years are validated',()=>{
 const answers={industry:'Retail',businessStage:'New business',namingMode:'Request suggestions',founderDob:'1995-02-31'};
 assert.equal(orderSchema.safeParse({...contact,productId:'personal-numerology',answers}).success,false);
 assert.equal(orderSchema.safeParse({...contact,productId:'yearly-forecast',answers:{dob:'1995-08-24',priorities:'Career',targetYear:'abc'}}).success,false);
 assert.equal(orderSchema.safeParse({...contact,productId:'baby-name',answers:{babyStatus:'Invalid',surname:'Test',preferredLanguage:'Hindi',namingMode:'Request suggestions'}}).success,false);
});
test('minimal forms accept essential details and enforce conditional baby names',()=>{
 assert.equal(orderSchema.safeParse({...contact,productId:'personal-numerology',answers:{dob:'1995-08-24'}}).success,true);
 const baby={...contact,productId:'baby-name',answers:{babyStatus:'Expecting',surname:'Sharma',preferredLanguage:'Hindi',namingMode:'Compare existing names'}};
 assert.equal(orderSchema.safeParse(baby).success,false);
 assert.equal(orderSchema.safeParse({...baby,answers:{...baby.answers,names:'Aarav, Arjun'}}).success,true);
 assert.equal(orderSchema.safeParse({...baby,answers:{...baby.answers,names:'Aarav',babyStatus:'Born'}}).success,false);
 assert.equal(orderSchema.safeParse({...contact,productId:'name-analysis',answers:{dob:'1995-08-24'}}).success,true);
 assert.equal(orderSchema.safeParse({...contact,productId:'relationship-compatibility',answers:{personOne:'Partner One',dobOne:'1995-08-24',personTwo:'Partner Two',dobTwo:'1996-01-12'}}).success,true);
});
