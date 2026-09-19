import 'dotenv/config';
import {existsSync,writeFileSync} from 'node:fs';
import {randomBytes,randomUUID} from 'node:crypto';

import {passwordHash} from '../server/security';
async function main(){
if(process.env.MONGODB_URI)throw new Error('For MongoDB, use npm run admin:create instead of local setup.');
const {db}=await import('../server/db');
if(process.env.NODE_ENV==='production')throw new Error('Local setup cannot run in production.');
if(!existsSync('.env'))writeFileSync('.env','APP_ORIGIN=http://localhost:3000\nDATA_DIR=./data\nCASHFREE_ENV=sandbox\n');
if(!db.prepare('SELECT id FROM users LIMIT 1').get()){
 const password=randomBytes(18).toString('base64url');const email='admin@numeroveda.local';
 db.prepare('INSERT INTO users VALUES(?,?,?)').run(randomUUID(),email,passwordHash(password));
 writeFileSync('local-access.txt',`NumeroVeda local admin access\n\nWebsite: http://localhost:3000\nAdmin: http://localhost:3000/admin\nEmail: ${email}\nPassword: ${password}\n\nKeep this file private. Change the password in Admin > Settings before deployment.\n`);
 console.log('Local administrator created. Credentials saved in ignored local-access.txt.');
}else console.log('Existing administrator preserved.');

}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
