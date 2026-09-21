import {randomUUID} from 'node:crypto';
import path from 'node:path';
import {createUser,findUser,changePassword} from './store';
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
