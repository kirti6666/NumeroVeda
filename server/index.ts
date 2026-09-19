import 'dotenv/config';
import {createApp} from './app';
const port=Number(process.env.API_PORT||process.env.PORT||4000);
const server=createApp().listen(port,process.env.API_HOST||'127.0.0.1',()=>console.log(`NumeroVeda API ready on port ${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
