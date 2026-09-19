import type {RequestHandler} from 'express';
import rateLimit from 'express-rate-limit';
import {createHash} from 'node:crypto';
import {mongo,usesMongo} from './mongo';
export function requestLimit(scope:string,limit:number):RequestHandler{
 const local=rateLimit({windowMs:15*60*1000,limit,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Too many requests. Please try again in 15 minutes.'}});
 return async(req,res,next)=>{
  if(!usesMongo())return local(req,res,next);
  const duration=15*60*1000;const bucket=Math.floor(Date.now()/duration);
  // Only trust the forwarding header on Vercel, where the edge supplies it.
  const address=process.env.VERCEL?String(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim():req.ip||'unknown';
  const key=createHash('sha256').update(scope+':'+address+':'+bucket).digest('hex');
  const c=(await mongo()).collection<{_id:string;count:number;expiresAt:Date}>('limits');
  const row=await c.findOneAndUpdate({_id:key},{$inc:{count:1},$setOnInsert:{expiresAt:new Date((bucket+2)*duration)}},{upsert:true,returnDocument:'after'});
  if(row&&row.count>limit){res.setHeader('Retry-After',Math.ceil(((bucket+1)*duration-Date.now())/1000));res.status(429).json({error:'Too many requests. Please try again in 15 minutes.'});return;}
  next();
 };
}
