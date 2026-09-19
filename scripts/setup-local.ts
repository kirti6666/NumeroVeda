import {existsSync,writeFileSync} from 'node:fs';
import {randomBytes,randomUUID} from 'node:crypto';
import {db} from '../server/db';
import {passwordHash} from '../server/security';
if(process.env.NODE_ENV==='production')throw new Error('Local setup cannot run in production.');
if(!existsSync('.env'))writeFileSync('.env','APP_ORIGIN=http://localhost:3000\nAPI_URL=http://127.0.0.1:4000\nAPI_HOST=127.0.0.1\nAPI_PORT=4000\nDATA_DIR=./data\nCASHFREE_ENV=sandbox\n');
if(!db.prepare('SELECT id FROM users LIMIT 1').get()){
 const password=randomBytes(18).toString('base64url');const email='admin@numeroveda.local';
 db.prepare('INSERT INTO users VALUES(?,?,?)').run(randomUUID(),email,passwordHash(password));
 writeFileSync('local-access.txt',`NumeroVeda local admin access\n\nWebsite: http://localhost:3000\nAdmin: http://localhost:3000/admin\nEmail: ${email}\nPassword: ${password}\n\nKeep this file private. Change the password in Admin > Settings before deployment.\n`);
 console.log('Local administrator created. Credentials saved in ignored local-access.txt.');
}else console.log('Existing administrator preserved.');
