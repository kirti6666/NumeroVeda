import nodemailer from 'nodemailer';
import {randomUUID} from 'node:crypto';
import {db,settings} from './db';
import type {Order} from '../lib/types';
export const mailConfigured=()=>!!(process.env.SMTP_HOST&&process.env.MAIL_FROM);
const pending=new Map<string,Promise<boolean>>();
export function mailContent(order:Order,kind:'payment'|'delivery'){
 const brand=settings().brand;
 const link=`${process.env.APP_ORIGIN||'http://localhost:3000'}/track?order=${order.id}`;
 const intro=kind==='payment'?`Thank you for choosing ${brand}. We have successfully received your payment for the ${order.productName} report.\n\nOne of our expert numerologists will carefully review the information and questions you have shared and prepare a personalised report for you. Your PDF report will be ready within 12–24 hours of your successful payment.\n\nWe will send you another email as soon as your report is ready to download.`:'Your personalised report has been carefully prepared and reviewed, and is now ready to download.';
 return {subject:kind==='payment'?`${brand} — Payment confirmed | Your personal report is underway`:`${brand} — Your personal report is ready`,text:`Dear ${order.name},\n\n${intro}\n\nReport: ${order.productName}\nOrder number: ${order.id}\nTrack your report: ${link}\nUse the private access code saved at checkout to access your report.\n\n${settings().email?'For assistance, contact '+settings().email+' and include your order number.\n\n':''}Warm regards,\nThe ${brand} Team`};
}
export function sendMail(order:Order,kind:'payment'|'delivery'):Promise<boolean>{
 if(kind==='payment'&&!order.paidAt)return Promise.resolve(false);
 const key=order.id+':'+kind;
 if(pending.has(key))return pending.get(key)!;
 if(kind==='payment'&&db.prepare("SELECT id FROM mail WHERE order_id=? AND kind='payment' AND status='sent'").get(order.id))return Promise.resolve(true);
 const work=deliver(order,kind).finally(()=>pending.delete(key));pending.set(key,work);return work;
}
async function deliver(order:Order,kind:'payment'|'delivery'){
 const id=kind==='payment'?'payment-'+order.id:randomUUID();const at=new Date().toISOString();
 const record=(status:string,error:string|null=null)=>db.prepare('INSERT INTO mail VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,at=excluded.at,error=excluded.error').run(id,order.id,kind,status,at,error);
 if(!mailConfigured()){record('not_configured');return false;}
 record('sending');
 try{const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_PORT==='465',connectionTimeout:10000,socketTimeout:15000,auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}:undefined});await transport.sendMail({from:process.env.MAIL_FROM,to:order.email,...mailContent(order,kind),messageId:kind==='payment'?`<payment-${order.id}@numeroveda.local>`:undefined});record('sent');return true;}catch{record('failed','Email delivery failed. Check SMTP configuration.');return false;}
}
