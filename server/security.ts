import {randomBytes,scryptSync,timingSafeEqual,createHash} from 'node:crypto';
import type {Request,Response,NextFunction} from 'express';
import {db} from './db';
export const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
export function passwordHash(value:string){const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(value,salt,64).toString('hex');}
export function passwordMatches(value:string,saved:string){try{const [salt,key]=saved.split(':');return timingSafeEqual(Buffer.from(key,'hex'),scryptSync(value,salt,64));}catch{return false;}}
export function equal(a:string,b:string){return a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));}
export function requireAdmin(req:Request,res:Response,next:NextFunction){const token=req.cookies?.nv_admin;if(typeof token!=='string')return res.status(401).json({error:'Please sign in to your admin account.'});const session=db.prepare('SELECT user_id FROM sessions WHERE hash=? AND expires>?').get(hash(token),Date.now());if(!session)return res.status(401).json({error:'Your session expired. Please sign in again.'});next();}
export function originGuard(req:Request,res:Response,next:NextFunction){if(['GET','HEAD','OPTIONS'].includes(req.method))return next();const allowed=new Set([process.env.APP_ORIGIN||'http://localhost:3000']);if(process.env.NODE_ENV!=='production'){allowed.add('http://127.0.0.1:3000');allowed.add('http://localhost:3000');}if(!req.headers.origin||!allowed.has(req.headers.origin))return res.status(403).json({error:'Request origin is not allowed.'});next();}
