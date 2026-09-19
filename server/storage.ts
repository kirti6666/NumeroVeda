import {v2 as cloudinary,type UploadApiResponse} from 'cloudinary';
import {randomUUID} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {localDb,usesMongo} from './mongo';
export const uploadLimit=4*1024*1024;
export const cloudConfigured=()=>!!(process.env.CLOUDINARY_CLOUD_NAME&&process.env.CLOUDINARY_API_KEY&&process.env.CLOUDINARY_API_SECRET);
function cloud(){
 if(!cloudConfigured())throw Object.assign(new Error('Configure Cloudinary credentials before uploading files.'),{status:503});
 cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET,secure:true});
 return cloudinary;
}
function folder(){return process.env.CLOUDINARY_FOLDER||'numeroveda';}
const cloudMode=()=>usesMongo()||!!process.env.VERCEL||cloudConfigured();
export async function saveFile(kind:'images'|'reports',buffer:Buffer){
 const filename=randomUUID()+(kind==='images'?'.webp':'.pdf');
 if(!cloudMode()){await writeFile(path.join((await localDb()).dataDir,kind,filename),buffer);return filename;}
 const isReport=kind==='reports';const publicId=`${folder()}/${kind}/${isReport?filename:filename.replace(/\.webp$/,'')}`;
 const result=await new Promise<UploadApiResponse>((resolve,reject)=>{
  cloud().uploader.upload_stream({public_id:publicId,resource_type:isReport?'raw':'image',type:isReport?'authenticated':'upload',overwrite:false,timeout:20000},(error,result)=>error?reject(error):result?resolve(result):reject(new Error('Upload failed.'))).end(buffer);
 });
 if(isReport&&result.type!=='authenticated')throw new Error('Report storage must be authenticated.');
 return isReport?'cloud:'+result.public_id:filename;
}
export function portraitUrl(filename:string){return cloud().url(`${folder()}/images/${filename.replace(/\.webp$/,'')}`,{resource_type:'image',type:'upload',format:'webp',secure:true});}
export async function localImage(filename:string){return path.join((await localDb()).dataDir,'images',filename);}
export async function readReport(filename:string){
 if(!filename.startsWith('cloud:'))return readFile(path.join((await localDb()).dataDir,'reports',filename));
 // Never expose this URL: authorization is checked again for every app download.
 const url=cloud().utils.private_download_url(filename.slice(6),'',{resource_type:'raw',type:'authenticated',expires_at:Math.floor(Date.now()/1000)+60,attachment:true});
 const response=await fetch(url,{signal:AbortSignal.timeout(20000),cache:'no-store'});
 if(!response.ok)throw Object.assign(new Error('The report could not be downloaded. Please try again.'),{status:502});
 const buffer=Buffer.from(await response.arrayBuffer());
 if(buffer.length>uploadLimit)throw new Error('Report exceeds download size limit.');
 return buffer;
}
export const publicImagesOnCloud=cloudMode;
