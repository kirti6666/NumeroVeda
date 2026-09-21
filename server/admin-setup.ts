import {randomUUID} from 'node:crypto';
import path from 'node:path';
import {createUser,findUser,changePassword,adminCount,audit} from './store';
import {usesMongo} from './mongo';
import {passwordHash} from './security';
// Name the database an administrator is written to. A silent write to local
// SQLite is the usual reason a deployed admin sign-in keeps failing.
export function storeTarget(){
 if(!usesMongo())return 'the local SQLite database at '+path.resolve(process.env.DATA_DIR||'data','numeroveda.sqlite');
 let host='the configured cluster';
 try{host=new URL(process.env.MONGODB_URI||'').host||host;}catch{}
 return `MongoDB database "${process.env.MONGODB_DB||'numeroveda'}" on ${host}`;
}
export async function provisionAdmin({email,password,reset=false}:{email:string;password:string;reset?:boolean}){
 const address=String(email||'').trim().toLowerCase();
 const target=storeTarget();
 if(!/^\S+@\S+\.\S+$/.test(address))throw new Error('Provide a valid administrator email in ADMIN_EMAIL.');
 if(!password||password.length<12)throw new Error('Set ADMIN_PASSWORD to a unique password of at least 12 characters.');
 const existing=await findUser(address);
 if(existing&&!reset)throw new Error(`An administrator with ${address} already exists in ${target}. Re-run with ADMIN_RESET=true (npm run admin:reset) to set a new password.`);
 if(existing){await changePassword(existing.id,passwordHash(password));return {email:address,target,action:'reset' as const};}
 await createUser({id:randomUUID(),email:address,password:passwordHash(password)});
 return {email:address,target,action:'created' as const};
}
// Deployments without shell access create their first administrator from
// ADMIN_EMAIL/ADMIN_PASSWORD on the first sign-in attempt. This never touches an
// existing account: once any administrator exists the variables are ignored, so
// remove ADMIN_PASSWORD and redeploy once you are signed in.
export const bootstrapReady=()=>!!(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD);
export async function ensureBootstrapAdmin(){
 if(!bootstrapReady()||await adminCount())return false;
 try{await provisionAdmin({email:process.env.ADMIN_EMAIL||'',password:process.env.ADMIN_PASSWORD||''});}
 catch(error){
  // A parallel first sign-in may have won the unique index; anything else is a
  // misconfigured variable the operator has to see.
  if(await adminCount())return true;
  throw Object.assign(new Error('The ADMIN_EMAIL/ADMIN_PASSWORD set on this deployment cannot create an administrator. '+(error as Error).message),{status:503});
 }
 await audit('admin.bootstrap',String(process.env.ADMIN_EMAIL||'').trim().toLowerCase());
 return true;
}
