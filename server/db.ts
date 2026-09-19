import 'dotenv/config';
import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import type {Entry,Kind,Order,Settings} from '../lib/types';
import {reportCatalog} from '../lib/report-catalog';
export const dataDir=path.resolve(/* turbopackIgnore: true */ process.env.DATA_DIR||'data');
mkdirSync(dataDir,{recursive:true});mkdirSync(path.join(dataDir,'reports'),{recursive:true});mkdirSync(path.join(dataDir,'images'),{recursive:true});
export const db=new DatabaseSync(path.join(dataDir,'numeroveda.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS content(kind TEXT NOT NULL,id TEXT NOT NULL,natural_key TEXT NOT NULL,data TEXT NOT NULL,version INTEGER NOT NULL DEFAULT 1,PRIMARY KEY(kind,id),UNIQUE(kind,natural_key));
CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY CHECK(id=1),data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,access_hash TEXT NOT NULL,data TEXT NOT NULL,payment_id TEXT UNIQUE);
CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY,at TEXT NOT NULL,action TEXT NOT NULL,target TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS mail(id TEXT PRIMARY KEY,order_id TEXT NOT NULL,kind TEXT NOT NULL,status TEXT NOT NULL,at TEXT NOT NULL,error TEXT);
`);
import {defaultSettings} from './defaults';
export {defaultSettings} from './defaults';
if(!db.prepare('SELECT id FROM settings WHERE id=1').get()){
 db.prepare('INSERT INTO settings VALUES(1,?)').run(JSON.stringify(defaultSettings));
 const products=[{id:'personal-numerology',name:'Personal numerology',description:'Understand your birth number, life path and the themes in your personal numbers.',features:['Birth & life-path analysis','Personal interpretation','Answers to your questions','Expert-reviewed PDF']},{id:'name-analysis',name:'Name analysis',description:'Explore your name through a considered numerological interpretation.',features:['Name number calculation','Name & birth-date alignment','Clear written explanations','Expert-reviewed PDF']},{id:'business-name',name:'Business name analysis',description:'A thoughtful numerological perspective on the name behind your business.',features:['Business name interpretation','Your questions considered','Written observations','Expert-reviewed PDF']}];
 products.forEach((p,i)=>saveEntry('products',{...p,price:49900,published:true,order:i}));
}
export function settings():Settings{return {...defaultSettings,...JSON.parse((db.prepare('SELECT data FROM settings WHERE id=1').get() as {data:string}).data)};}
export function audit(action:string,target:string){db.prepare('INSERT INTO audit VALUES(?,?,?,?)').run(randomUUID(),new Date().toISOString(),action,target);}
export function entries(kind:Kind):Entry[]{return (db.prepare('SELECT data,version FROM content WHERE kind=?').all(kind) as {data:string;version:number}[]).map(r=>({...JSON.parse(r.data),version:r.version}));}
export function saveEntry(kind:Kind,item:Entry){const naturalKey=kind==='panchang'?`${item.date}:${String(item.city).trim().toLowerCase()}:${item.language}`:kind==='horoscopes'?`${item.date}:${item.sign}:${item.language}`:item.id;const prior=db.prepare('SELECT version FROM content WHERE kind=? AND id=?').get(kind,item.id) as {version:number}|undefined;if(prior&&item.version!==undefined&&item.version!==prior.version)throw Object.assign(new Error('This entry changed in another window. Reload before saving.'),{status:409});const version=(prior?.version||0)+1;db.prepare('INSERT INTO content(kind,id,natural_key,data,version) VALUES(?,?,?,?,?) ON CONFLICT(kind,id) DO UPDATE SET natural_key=excluded.natural_key,data=excluded.data,version=excluded.version').run(kind,item.id,naturalKey,JSON.stringify({...item,version}),version);return {...item,version};}
export function allOrders():Order[]{return (db.prepare('SELECT data FROM orders').all() as {data:string}[]).map(r=>JSON.parse(r.data)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export function getOrder(id:string):Order|undefined{const r=db.prepare('SELECT data FROM orders WHERE id=?').get(id) as {data:string}|undefined;return r?JSON.parse(r.data):undefined;}
export function saveOrder(order:Order){db.prepare('UPDATE orders SET data=?,payment_id=? WHERE id=?').run(JSON.stringify(order),order.paymentId,order.id);}

// Apply the expanded catalogue once; later admin edits and deletions are preserved.
db.exec('CREATE TABLE IF NOT EXISTS migrations(id TEXT PRIMARY KEY)');
if(!db.prepare('SELECT id FROM migrations WHERE id=?').get('report-catalog-v2')){
 db.exec('BEGIN IMMEDIATE');
 try{
  const existing=entries('products');
  reportCatalog.forEach((report,order)=>{const prior=existing.find(p=>p.id===report.id);const {fields,...product}=report;saveEntry('products',{...prior,...product,price:prior?.price??49900,published:prior?.published??true,order});});
  db.prepare('INSERT INTO migrations VALUES(?)').run('report-catalog-v2');db.exec('COMMIT');
 }catch(error){db.exec('ROLLBACK');throw error;}
}
