import {createInterface} from 'node:readline/promises';
import {randomUUID} from 'node:crypto';
import {db} from '../server/db';
import {passwordHash} from '../server/security';
async function main(){
const rl=createInterface({input:process.stdin,output:process.stdout});
const email=(await rl.question('Administrator email: ')).trim().toLowerCase();
const password=process.env.ADMIN_PASSWORD;
rl.close();
if(!/^\S+@\S+\.\S+$/.test(email)||!password||password.length<12)throw new Error('Provide a valid email and set ADMIN_PASSWORD to a unique password of at least 12 characters.');
db.prepare('INSERT INTO users VALUES(?,?,?)').run(randomUUID(),email,passwordHash(password));console.log('Administrator created.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
