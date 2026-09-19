import {test} from 'node:test';
import assert from 'node:assert/strict';
import {api} from '../lib/api';

test('client API rejects an HTML deployment response even with status 200',async t=>{
 t.mock.method(globalThis,'fetch',async()=>new Response('<html>Unavailable</html>',{status:200}));
 await assert.rejects(api('/public'),/server could not be reached/);
});

test('client API adds a timeout and keeps successful JSON',async t=>{
 let signal:AbortSignal|null|undefined;
 t.mock.method(globalThis,'fetch',async(_url:unknown,options:RequestInit)=>{
  signal=options.signal;
  return Response.json({products:[]});
 });
 assert.deepEqual(await api('/public'),{products:[]});
 assert.ok(signal instanceof AbortSignal);
});
