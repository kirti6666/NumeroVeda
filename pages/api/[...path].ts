import type {NextApiRequest,NextApiResponse} from 'next';
import type {RequestListener} from 'node:http';
import {createApp} from '../../server/app';

// Preserve multipart uploads and the original Cashfree webhook bytes.
export const config={api:{bodyParser:false,externalResolver:true},maxDuration:60};
const app=createApp();
export default async function handler(req:NextApiRequest,res:NextApiResponse){
 await new Promise<void>((resolve,reject)=>{
  res.once('finish',resolve);res.once('close',resolve);
  try{(app as unknown as RequestListener)(req,res);}catch(error){reject(error);}
 });
}
