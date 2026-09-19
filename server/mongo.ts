import 'dotenv/config';
import {MongoClient, type Db} from 'mongodb';
import {reportCatalog} from '../lib/report-catalog';
import {defaultSettings} from './defaults';

let connection:Promise<Db>|undefined;
let activeClient:MongoClient|undefined;
export async function closeMongo(){await activeClient?.close();activeClient=undefined;connection=undefined;}
export const usesMongo=()=>!!process.env.MONGODB_URI;
export async function localDb(){
 if(process.env.VERCEL)throw Object.assign(new Error('Configure MONGODB_URI in Vercel environment variables and redeploy.'),{status:503});
 return import('./db');
}
export function mongo():Promise<Db>{
 if(!connection)connection=connect().catch(error=>{connection=undefined;throw error;});
 return connection;
}
async function connect(){
 if(!process.env.MONGODB_URI)throw Object.assign(new Error('MongoDB is not configured.'),{status:503});
 const client=new MongoClient(process.env.MONGODB_URI,{maxPoolSize:5,minPoolSize:0,maxIdleTimeMS:60000,serverSelectionTimeoutMS:8000});
 try{
  await client.connect();const db=client.db(process.env.MONGODB_DB||'numeroveda');
  await Promise.all([
   ...['users','orders','mail'].map(name=>db.collection(name).createIndex({id:1},{unique:true})),
   ...['settings','migrations'].map(name=>db.collection(name).createIndex({name:1},{unique:true})),
   db.collection('sessions').createIndex({hash:1},{unique:true}),
   db.collection('content').createIndex({kind:1,id:1},{unique:true}),
   db.collection('users').createIndex({email:1},{unique:true}),
   db.collection('content').createIndex({kind:1,naturalKey:1},{unique:true}),
   db.collection('sessions').createIndex({expiresAt:1},{expireAfterSeconds:0}),
   db.collection('limits').createIndex({expiresAt:1},{expireAfterSeconds:0}),
   db.collection('orders').createIndex({'data.paymentId':1},{unique:true,partialFilterExpression:{'data.paymentId':{$type:'string'}}}),
  ]);
  if(!await db.collection('migrations').findOne({name:'catalog-v2'})){
   await client.withSession(session=>session.withTransaction(async()=>{
    if(await db.collection('migrations').findOne({name:'catalog-v2'},{session}))return;
    await db.collection('settings').updateOne({name:'site'},{$setOnInsert:{data:defaultSettings}},{upsert:true,session});
    for(const [order,{fields,...p}] of reportCatalog.entries())await db.collection('content').updateOne({kind:'products',id:p.id},{$setOnInsert:{kind:'products',id:p.id,naturalKey:p.id,version:1,data:{...p,price:49900,published:true,order,version:1}}},{upsert:true,session});
    await db.collection('migrations').insertOne({name:'catalog-v2'},{session});
   }));
  }
  activeClient=client;return db;
 }catch(error){await client.close();throw error;}
}
