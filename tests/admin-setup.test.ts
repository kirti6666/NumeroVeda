import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
test('first administrator provisioning, sign-in and password reset',async(t)=>{
 process.env.MONGODB_URI='';process.env.DATA_DIR=mkdtempSync(path.join(tmpdir(),'numeroveda-admin-'));process.env.APP_ORIGIN='http://localhost:3000';
 const {createApp}=await import('../server/app');const {provisionAdmin}=await import('../server/admin-setup');const {db}=await import('../server/db');
 const server=createApp().listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));const base='http://127.0.0.1:'+(server.address() as {port:number}).port;
 t.after(async()=>{await new Promise<void>(resolve=>server.close(()=>resolve()));db.close();});
 const login=(password:string)=>fetch(base+'/api/auth/login',{method:'POST',headers:{Origin:'http://localhost:3000','Content-Type':'application/json'},body:JSON.stringify({email:'Owner@Example.Test',password})});
 const health=async()=>(await fetch(base+'/api/health')).json() as Promise<{store:string;adminConfigured:boolean}>;
 await t.test('health reports the store and that no administrator exists yet',async()=>{const body=await health();assert.equal(body.store,'sqlite');assert.equal(body.adminConfigured,false);});
 await t.test('sign-in names the missing administrator instead of blaming the password',async()=>{const response=await login('Unique-test-password');assert.equal(response.status,401);assert.match((await response.json()).error,/No administrator account exists yet/);});
 await t.test('provisioning stores a lowercase administrator and names its database',async()=>{const result=await provisionAdmin({email:' Owner@Example.Test ',password:'Unique-test-password'});assert.equal(result.action,'created');assert.equal(result.email,'owner@example.test');assert.match(result.target,/SQLite/);assert.equal((await health()).adminConfigured,true);assert.equal((await login('Unique-test-password')).status,200);});
 await t.test('re-running without a reset refuses instead of failing on a duplicate key',async()=>{await assert.rejects(provisionAdmin({email:'owner@example.test',password:'Another-test-password'}),/already exists/);assert.equal((await login('Another-test-password')).status,401);});
 await t.test('reset replaces the password, ends sessions and rejects weak passwords',async()=>{const signedIn=await login('Unique-test-password');const cookie=signedIn.headers.get('set-cookie')!.split(';')[0];assert.equal((await fetch(base+'/api/auth/me',{headers:{Cookie:cookie}})).status,200);await assert.rejects(provisionAdmin({email:'owner@example.test',password:'short',reset:true}),/12 characters/);const result=await provisionAdmin({email:'owner@example.test',password:'Another-test-password',reset:true});assert.equal(result.action,'reset');assert.equal((await fetch(base+'/api/auth/me',{headers:{Cookie:cookie}})).status,401);assert.equal((await login('Unique-test-password')).status,401);assert.equal((await login('Another-test-password')).status,200);});
});
