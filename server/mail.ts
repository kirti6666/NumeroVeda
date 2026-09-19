import nodemailer from 'nodemailer';
import {randomUUID} from 'node:crypto';
import {settings,mailSent,claimMail,releaseMail,recordMail} from './store';
import type {Order} from '../lib/types';
export const mailConfigured=()=>!!(process.env.SMTP_HOST&&process.env.MAIL_FROM);
const pending=new Map<string,Promise<boolean>>();
export async function mailContent(order:Order,kind:'payment'|'delivery'){
 const brand=(await settings()).brand;
 const link=`${process.env.APP_ORIGIN||'http://localhost:3000'}/track?order=${order.id}`;
 const intro=kind==='payment'?`Thank you for choosing ${brand}. We have successfully received your payment for the ${order.productName} report.\n\nOne of our expert numerologists will carefully review the information and questions you have shared and prepare a personalised report for you. Your PDF report will be ready within 12–24 hours of your successful payment.\n\nWe will send you another email as soon as your report is ready to download.`:'Your personalised report has been carefully prepared and reviewed, and is now ready to download.';
 return {subject:kind==='payment'?`${brand} — Payment confirmed | Your personal report is underway`:`${brand} — Your personal report is ready`,text:`Dear ${order.name},\n\n${intro}\n\nReport: ${order.productName}\nOrder number: ${order.id}\nTrack your report: ${link}\nUse the private access code saved at checkout to access your report.\n\n${(await settings()).email?'For assistance, contact '+(await settings()).email+' and include your order number.\n\n':''}Warm regards,\nThe ${brand} Team`};
}
export async function sendMail(order:Order,kind:'payment'|'delivery'):Promise<boolean>{
 if(kind==='payment'&&!order.paidAt)return Promise.resolve(false);
 const key=order.id+':'+kind;
 if(pending.has(key))return pending.get(key)!;
 if(kind==='payment'&&await mailSent(order.id))return true;
 if(kind==='payment'&&!await claimMail(order.id))return false;
 if(pending.has(key))return pending.get(key)!;
 const work=deliver(order,kind).finally(async()=>{pending.delete(key);if(kind==='payment')await releaseMail(order.id);});pending.set(key,work);return work;
}
async function deliver(order:Order,kind:'payment'|'delivery'){
 const id=kind==='payment'?'payment-'+order.id:randomUUID();
 const record=(status:string,error:string|null=null)=>recordMail(id,order.id,kind,status,error);
 if(!mailConfigured()){await record('not_configured');return false;}
 await record('sending');
 try{const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_PORT==='465',connectionTimeout:10000,socketTimeout:15000,auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}:undefined});await transport.sendMail({from:process.env.MAIL_FROM,to:order.email,...await mailContent(order,kind),messageId:kind==='payment'?`<payment-${order.id}@numeroveda.local>`:undefined});await record('sent');return true;}catch{await record('failed','Email delivery failed. Check SMTP configuration.');return false;}
}
