import 'dotenv/config';
import {createInterface} from 'node:readline/promises';
import {provisionAdmin,storeTarget} from '../server/admin-setup';
import {usesMongo,closeMongo} from '../server/mongo';
const truthy=(value?:string)=>/^(1|true|yes|on)$/i.test(value||'');
async function main(){
 const reset=process.argv.includes('--reset')||truthy(process.env.ADMIN_RESET);
 console.log('Target: '+storeTarget());
 if(!usesMongo())console.warn('MONGODB_URI is not set, so this writes to local SQLite only. A Vercel deployment reads MongoDB and will not see this administrator.');
 let email=process.env.ADMIN_EMAIL;
 if(!email){const rl=createInterface({input:process.stdin,output:process.stdout});email=await rl.question('Administrator email: ');rl.close();}
 const result=await provisionAdmin({email,password:process.env.ADMIN_PASSWORD||'',reset});
 console.log(result.action==='reset'?`Password updated for ${result.email} in ${result.target}. All admin sessions were signed out.`:`Administrator ${result.email} created in ${result.target}.`);
}
main().then(async()=>{await closeMongo();process.exit(0);}).catch(async error=>{console.error(error.message);await closeMongo().catch(()=>{});process.exit(1);});
