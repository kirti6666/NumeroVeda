export async function api<T>(path:string,options:RequestInit={}):Promise<T>{
 const response=await fetch('/api'+path,{...options,headers:{...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...options.headers},cache:'no-store'});
 const data=await response.json().catch(()=>({error:'The server could not be reached. Please try again.'}));
 if(!response.ok)throw new Error(data.error||'Something went wrong. Please try again.');return data;
}
