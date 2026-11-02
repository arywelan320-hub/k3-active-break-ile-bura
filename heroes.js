/* K3 Active Heroes: portal statistik lokal + data bersama setelah backend diterbitkan. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const SESSIONS=['09:00','11:00','13:00'];
 const STORE='k3_ile_bura_v1';
 let person=null,remote=null,connected=false,pending=false;
 const endpoint=()=>String(window.K3_BACKEND_URL||'').trim();
 const codeKey=id=>'k3_access_code_'+id;
 const accessCode=()=>person?sessionStorage.getItem(codeKey(person.id))||'':'';
 const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const tnow=()=>{const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Makassar',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const t=Object.fromEntries(p.map(x=>[x.type,x.value]));return t.year+'-'+t.month+'-'+t.day};
 const localData=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}};
 function mine(){
  const date=tnow(),rows=localData().history||[];
  const unique=new Set();
  for(const r of rows){
   if(r.userId!==person?.id||r.participated!==true||!SESSIONS.includes(r.session)||!r.date)continue;
   unique.add(r.date+'|'+r.session);
  }
  let week=0,month=0,today=0;
  const dt=new Date(date+'T12:00:00+08:00');
  const weekStart=new Date(dt);weekStart.setDate(dt.getDate()-((dt.getDay()+6)%7));
  for(const entry of unique){
   const [d,session]=entry.split('|');
   if(d===date)today++;
   if(d.startsWith(date.slice(0,7)))month+=10;
   if(d>=weekStart.toISOString().slice(0,10)&&d<=date)week+=10;
  }
  return {today,week,month};
 }
 async function request(action,other={}){
  if(!endpoint())throw Error('Integrasi Google Sheets belum diaktifkan oleh pengelola.');
  const code=accessCode();
  if(!person||!code)throw Error('Masukkan kode akses pegawai untuk sinkronisasi.');
  const res=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,employeeId:person.id,code,...other}),cache:'no-store'});
  const result=await res.json();
  if(!res.ok||!result.ok)throw Error(result.error||'Server tidak dapat dihubungi.');
  return result;
 }
 function setStatus(s){const el=$('heroes-status');if(el)el.textContent=s}
 function render(){
  if(!person)return;
  const local=mine();
  const stats=connected&&remote?.stats?remote.stats:null;
  const points=stats?.my||local;
  const label=stats?'Tersinkron ke Google Sheets':'Catatan perangkat ini saja';
  $('heroes-home')?.classList.remove('hidden');
  const heroHome=$('heroes-home');
  if(heroHome)heroHome.innerHTML='<div class="heroes-mini-head"><span class="heroes-mini-icon">🏆</span><div><strong>K3 Active Heroes</strong><small>'+safe(label)+'</small></div></div><div class="heroes-mini-numbers"><span><strong>'+points.today+'/3</strong><small>Sesi hari ini</small></span><span><strong>'+points.month+'</strong><small>Poin bulan ini</small></span></div><div class="heroes-mini-actions"><button class="outline small" data-go="heroes">Lihat Peringkat</button><button class="outline small" data-go="monitoring">Monitoring</button></div>';
  $('hero-my-week').textContent=points.week+' poin';
  $('hero-my-month').textContent=points.month+' poin';
  $('hero-my-today').textContent=points.today+' dari 3 sesi';
  $('heroes-sync-label').textContent=label;
  const items=stats?.leaderboard||[];
  const top=$('heroes-podium'),list=$('heroes-leaderboard');
  if(!items.length){
   top.innerHTML='<div class="empty-state">Belum ada peringkat bersama. Nama hanya tampil setelah pegawai memberikan persetujuan dan ada data yang tersinkron.</div>';
   list.replaceChildren();
  }else{
   const medals=['🥇','🥈','🥉'];
   top.innerHTML=items.slice(0,3).map((r,i)=>'<article class="hero-podium-person '+(i===0?'hero-champion':'')+'"><span class="hero-medal">'+medals[i]+'</span><strong>'+safe(r.alias)+'</strong><small>'+r.month+' poin bulan ini</small></article>').join('');
   list.innerHTML=items.slice(3).map((r,i)=>'<div class="hero-rank-row"><strong>#'+(i+4)+'</strong><span>'+safe(r.alias)+'</span><b>'+r.month+' poin</b></div>').join('');
  }
  $('monitor-today-login').textContent=stats?String(stats.todayLogins):'—';
  $('monitor-today-active').textContent=stats?String(stats.todayParticipants):'—';
  $('monitor-connection').textContent=stats?'Ringkasan terpusat hari ini':'Belum tersambung. Angka seluruh pegawai belum dapat ditampilkan.';
  if(!endpoint())setStatus('Integrasi pusat belum aktif. Catatan di HP ini tetap bisa digunakan.');
  else if(!connected)setStatus('Sambungkan kode akses untuk melihat peringkat bersama.');
  else setStatus('Data terhubung. Peringkat hanya menampilkan alias pegawai yang setuju.');
  $('heroes-access-wrap').classList.toggle('hidden',connected||!endpoint());
  $('heroes-connection-note').classList.toggle('hidden',!!endpoint());
 }
 async function update(){
  if(!person)return;
  render();
  if(!endpoint()||!accessCode()||pending)return;
  pending=true;
  try{const data=await request('snapshot');remote=data;connected=true}
  catch(e){connected=false;remote=null;setStatus(e.message)}
  finally{pending=false;render()}
 }
 async function verifyCode(){
  const code=$('heroes-access-input').value.trim().toUpperCase();
  if(!person||!code){setStatus('Isi kode akses dari pengelola.');return}
  if(!endpoint()){setStatus('Pengelola belum mengaktifkan sambungan server.');return}
  sessionStorage.setItem(codeKey(person.id),code);
  $('heroes-access-input').value='';
  pending=true;
  setStatus('Memverifikasi kode akses...');
  try{
   const d=await request('login');
   connected=true;remote=d;
  }catch(err){
   sessionStorage.removeItem(codeKey(person.id));connected=false;remote=null;setStatus(err.message);
  }finally{pending=false;render()}
 }
 async function onActivity(record){
  render();
  if(!endpoint()||!accessCode()||!person){setStatus('Aktivitas baru disimpan lokal. Sinkronisasi pusat belum aktif.');return}
  try{
   const d=await request('session',{session:record.session,participated:true,videoId:record.videoId,videoTitle:record.videoTitle,motion:record.motion===true?'active':'none'});
   connected=true;remote=d;
  }catch(err){setStatus('Aktivitas tersimpan lokal, tetapi belum berhasil dikirim ke server: '+err.message)}
  render();
 }
 async function adminSnapshot(){
  const adminCode=$('heroes-admin-input').value.trim();
  if(!adminCode){$('monitor-admin-output').textContent='Masukkan kode admin terlebih dahulu.';return}
  if(!connected){$('monitor-admin-output').textContent='Verifikasi kode pegawai sebelum membuka monitoring admin.';return}
  try{
   const result=await request('adminSnapshot',{adminCode});
   const rows=result.stats?.adminLogins||[];
   $('monitor-admin-output').innerHTML='<strong>Daftar login hari ini ('+rows.length+')</strong>'+rows.map(r=>'<div class="hero-rank-row"><span>'+safe(r.name)+' • '+safe(r.profesi)+'</span><b>'+safe(r.at)+' WITA</b></div>').join('');
  }catch(e){$('monitor-admin-output').textContent=e.message}
  $('heroes-admin-input').value='';
 }
 document.addEventListener('DOMContentLoaded',()=>{
  $('heroes-connect-btn').addEventListener('click',verifyCode);
  $('heroes-refresh-btn').addEventListener('click',update);
  $('monitor-refresh-btn').addEventListener('click',update);
  $('monitor-admin-btn').addEventListener('click',adminSnapshot);
  $('heroes-access-input').addEventListener('keydown',e=>{if(e.key==='Enter')verifyCode()});
 });
 window.K3Heroes={
  setUser(user){
   if(person?.id!==user?.id){connected=false;remote=null}
   person=user;
   if(!person)return;
   render();
   if(endpoint()&&accessCode())update();
  },
  refresh:render,
  onActivity,
  update,
  recordLogin(){
   if(endpoint()&&accessCode()&&person)request('login').then(d=>{remote=d;connected=true;render()}).catch(()=>{});
  }
 };
})();
