import test from 'node:test';
import assert from 'node:assert/strict';
import {Writable} from 'node:stream';
import {MongoMemoryReplSet} from 'mongodb-memory-server-core';
import {v2 as cloudinary} from 'cloudinary';
import {createHmac} from 'node:crypto';
import {createServer} from 'node:http';
import type {NextApiRequest,NextApiResponse} from 'next';

test('MongoDB API lifecycle, concurrency and private Cloudinary delivery',async t=>{
 const replica=await MongoMemoryReplSet.create({replSet:{count:1},binary:{version:'7.0.14'}});
 process.env.MONGODB_URI=replica.getUri();process.env.MONGODB_DB='isolated_test';
 process.env.APP_ORIGIN='http://localhost:3000';process.env.CASHFREE_CLIENT_ID='test';process.env.CASHFREE_CLIENT_SECRET='test';process.env.CASHFREE_ENV='sandbox';
 process.env.CLOUDINARY_CLOUD_NAME='test';process.env.CLOUDINARY_API_KEY='test';process.env.CLOUDINARY_API_SECRET='test';process.env.SMTP_HOST='';process.env.MAIL_FROM='';
 const store=await import('../server/store');const {mongo,closeMongo}=await import('../server/mongo');
 const {passwordHash}=await import('../server/security');const {default:handler}=await import('../pages/api/[...path]');
 const server=createServer((req,res)=>{void handler(req as NextApiRequest,res as NextApiResponse).catch(()=>{res.statusCode=500;res.end();});}).listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));
 const base='http://127.0.0.1:'+(server.address() as {port:number}).port+'/api';
 t.after(async()=>{await new Promise<void>(resolve=>server.close(()=>resolve()));await closeMongo();await replica.stop();});
 const realFetch=globalThis.fetch;let id='';const pdf=Buffer.from('%PDF-1.4\nprivate customer report');let uploads=0;
 t.mock.method(cloudinary.uploader,'upload_stream',(options:any,callback:any)=>new Writable({write(_chunk,_encoding,done){done();},final(done){uploads++;assert.equal(options.resource_type,'raw');assert.equal(options.type,'authenticated');callback(null,{public_id:options.public_id,type:'authenticated'});done();}}));
 t.mock.method(globalThis,'fetch',async(input:any,init:any)=>{
  const url=String(input);
  if(url.startsWith('https://sandbox.cashfree.com/pg')){
   if(init?.method==='POST'){id=JSON.parse(init.body).order_id;return Response.json({payment_session_id:'sandbox-session'});}
   if(url.endsWith('/payments'))return Response.json([{payment_status:'SUCCESS',payment_currency:'INR',payment_amount:499,cf_payment_id:'verified-unique',payment_time:new Date().toISOString()}]);
   return Response.json({order_id:id,order_status:'PAID',order_currency:'INR',order_amount:499});
  }
  if(url.startsWith('https://api.cloudinary.com/')){const u=new URL(url);assert.equal(u.searchParams.get('type'),'authenticated');assert.ok(Number(u.searchParams.get('expires_at'))<=Date.now()/1000+61);return new Response(pdf);}
  return realFetch(input,init);
 });
 let cookie='';const call=(path:string,method='GET',body?:unknown,access?:string)=>realFetch(base+path,{method,headers:{Origin:'http://localhost:3000',...(cookie?{Cookie:cookie}:{}),...(access?{Authorization:'Bearer '+access}:{}),...(body instanceof FormData?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:body instanceof FormData?body:JSON.stringify(body)});
 const db=await mongo();
 assert.equal((await store.entries('products')).length,9);
 await store.createUser({id:'admin',email:'admin@test.example',password:passwordHash('unique-test-password')});
 await store.setSettings({...await store.settings(),paymentsEnabled:true,email:'support@test.example'});
 assert.equal((await call('/admin/settings')).status,401);
 const login=await call('/auth/login','POST',{email:'admin@test.example',password:'unique-test-password'});assert.equal(login.status,200);cookie=login.headers.get('set-cookie')!.split(';')[0];
 const product=(await store.entries('products'))[0];
 const results=await Promise.allSettled([store.saveEntry('products',{...product,name:'Edit A'}),store.saveEntry('products',{...product,name:'Edit B'})]);
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
 const order=await call('/orders','POST',{productId:'baby-name',name:'Customer',email:'customer@test.example',phone:'9876543210',answers:{babyStatus:'Expecting',surname:'Sharma',preferredLanguage:'Hindi',namingMode:'Request suggestions'},language:'English',consent:true});
 assert.equal(order.status,201);const created=await order.json();id=created.id;const access=created.access;
 assert.equal((await call('/orders/'+id)).status,401);
 assert.equal((await call('/orders/'+id+'/report','GET',undefined,access)).status,404);
 const payload=JSON.stringify({data:{order:{order_id:id}}});const ts=String(Date.now());const signature=createHmac('sha256','test').update(ts+payload).digest('base64');
 const webhook=()=>realFetch(base+'/payments/cashfree/webhook',{method:'POST',headers:{'Content-Type':'application/json','x-webhook-timestamp':ts,'x-webhook-signature':signature},body:payload});
 assert.equal((await webhook()).status,200);const deadline=(await store.getOrder(id))!.dueAt;
 const callbacks=await Promise.all([webhook(),webhook()]);assert.ok(callbacks.every(r=>r.status===200));assert.equal((await store.getOrder(id))!.dueAt,deadline);
 const a=(await store.getOrder(id))!;const b=(await store.getOrder(id))!;a.internalNote='first';await store.saveOrder(a);b.internalNote='stale';await assert.rejects(store.saveOrder(b),/changed/);
 // Simultaneous email workers share one lease across instances.
 const claims=await Promise.all([store.claimMail(id),store.claimMail(id)]);assert.equal(claims.filter(Boolean).length,1);await store.releaseMail(id);
 const upload=new FormData();upload.append('file',new Blob([pdf],{type:'application/pdf'}),'report.pdf');
 assert.equal((await call('/admin/orders/'+id+'/report','POST',upload)).status,200);assert.equal(uploads,1);
 assert.match((await store.getOrder(id))!.reportFile!,/^cloud:/);
 assert.equal((await call('/orders/'+id+'/report','GET',undefined,access)).status,404);
 assert.equal((await call('/admin/orders/'+id+'/deliver','POST',{confirmed:true})).status,200);
 const download=await call('/orders/'+id+'/report','GET',undefined,access);assert.equal(download.status,200);assert.deepEqual(Buffer.from(await download.arrayBuffer()),pdf);
 const publicOrder=await (await call('/orders/'+id,'GET',undefined,access)).json();assert.equal(publicOrder.reportFile,undefined);assert.equal(publicOrder.internalNote,undefined);
 assert.equal((await call('/admin/orders/'+id,'PATCH',{status:'refunded',refundReference:'completed-refund'})).status,200);
 assert.equal((await call('/orders/'+id+'/report','GET',undefined,access)).status,404);
 await call('/admin/password','POST',{current:'unique-test-password',password:'another-unique-password'});assert.equal((await call('/admin/settings')).status,401);
 // Reconnecting does not re-seed a removed report or reset edited prices.
 await store.deleteEntry('products',product.id);await closeMongo();assert.equal((await store.entries('products')).length,8);
 assert.equal(await (await mongo()).collection('orders').countDocuments(),1);
 process.env.MONGODB_URI='';process.env.VERCEL='1';
 const unavailable=await call('/public');assert.equal(unavailable.status,503);assert.match((await unavailable.json()).error,/MONGODB_URI/);
 delete process.env.VERCEL;
});
