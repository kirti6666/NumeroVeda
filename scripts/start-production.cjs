const {spawn}=require('node:child_process');
require('dotenv').config({quiet:true});
if(!process.env.APP_ORIGIN?.startsWith('https://'))throw new Error('Production requires APP_ORIGIN=https://your-domain and an HTTPS reverse proxy.');
const env={...process.env,NODE_ENV:'production'};
const api=spawn(process.execPath,['--import','tsx','server/index.ts'],{stdio:'inherit',env,windowsHide:true});
const web=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname',process.env.WEB_HOST||'127.0.0.1'],{stdio:'inherit',env,windowsHide:true});
let stopping=false;function stop(code=0){if(stopping)return;stopping=true;api.kill();web.kill();process.exitCode=code;}
api.on('exit',code=>stop(code||0));web.on('exit',code=>stop(code||0));
api.on('error',()=>stop(1));web.on('error',()=>stop(1));
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
