/* Cloudflare Worker CORS proxy: konfigurasi rahasia APPS_SCRIPT_URL di Worker.
 * Browser → Worker → Apps Script. Tidak menaruh URL backend atau kunci admin di repo.
 */
const ALLOWED='https://arywelan320-hub.github.io';
export default {
 async fetch(request,env){
  const origin=request.headers.get('Origin')||'';
  const headers={'Access-Control-Allow-Origin':ALLOWED,'Vary':'Origin','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store'};
  if(origin!==ALLOWED)return new Response('Origin not allowed',{status:403});
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(request.method!=='POST')return new Response('POST only',{status:405,headers});
  const size=Number(request.headers.get('Content-Length')||0);
  if(size>5000)return new Response('Payload too large',{status:413,headers});
  if(!env.APPS_SCRIPT_URL||!/^https:\/\/script\.google\.com\/macros\/s\//.test(env.APPS_SCRIPT_URL))return Response.json({ok:false,error:'Backend belum diaktifkan'},{status:503,headers});
  try{
   const body=await request.text();
   if(body.length>5000)throw Error('Payload terlalu besar');
   const parsed=JSON.parse(body);
   if(!['login','session','snapshot','adminSnapshot'].includes(parsed.action))throw Error('Aksi tidak didukung');
   const upstream=await fetch(env.APPS_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(parsed),redirect:'follow'});
   const content=await upstream.text();
   const data=JSON.parse(content);
   return Response.json(data,{status:upstream.ok?200:502,headers});
  }catch(e){return Response.json({ok:false,error:'Server tidak dapat dihubungi atau permintaan tidak valid.'},{status:502,headers})}
 }
};
