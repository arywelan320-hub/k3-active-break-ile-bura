/* K3 Active Break - Google Apps Script BACKEND
 * Spreadsheet ini privat. Deploy as Web App "Execute as me", access "Anyone",
 * HANYA melalui Cloudflare Worker (lihat backend/cloudflare-worker.js).
 * Kode pegawai diverifikasi di server, nama dropdown bukan autentikasi.
 * Zona waktu: Asia/Makassar. Jangan log/ekspos kode pegawai.
 */
const TZ='Asia/Makassar';
const SESSIONS=['09:00','11:00','13:00'];
const SPREADSHEET_ID='1zOQSTimUdUW2cLbfXRp5TGytsbXK9JLiaIL4E7nQF4o';
function wb(){return SpreadsheetApp.openById(SPREADSHEET_ID)}
function tab(name){return wb().getSheetByName(name)}
function nowParts(){const d=new Date();return {iso:d.toISOString(),date:Utilities.formatDate(d,TZ,'yyyy-MM-dd'),time:Utilities.formatDate(d,TZ,'HH:mm'),week:Utilities.formatDate(d,TZ,'YYYY-ww'),month:Utilities.formatDate(d,TZ,'yyyy-MM')}}
function digest(str){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(str),Utilities.Charset.UTF_8).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('')}
function asRows(name){return tab(name).getDataRange().getValues().slice(1)}
function ok(obj){return ContentService.createTextOutput(JSON.stringify({ok:true,...obj})).setMimeType(ContentService.MimeType.JSON)}
function fail(message){return ContentService.createTextOutput(JSON.stringify({ok:false,error:message})).setMimeType(ContentService.MimeType.JSON)}
function employeeFor(id,code){
  if(!/^pegawai-2026-\d{3}$/.test(String(id||''))||!/^\w{8,48}$/.test(String(code||'')))throw Error('Kode akses pegawai tidak valid.');
  const person=asRows('Pegawai').find(r=>String(r[0])===id&&r[5]==='YA');
  const record=asRows('Akses').find(r=>String(r[0])===id&&r[2]==='AKTIF');
  if(!person||!record||String(record[1])!==digest(code))throw Error('Identitas atau kode akses belum terverifikasi.');
  return {id,name:String(person[1]),profesi:String(person[2]),alias:String(person[3]||'').trim(),consent:person[4]==='YA'};
}
function adminAllowed(code){const expected=PropertiesService.getScriptProperties().getProperty('ADMIN_CODE_HASH');return !!expected&&String(code||'').length>=12&&digest(code)===expected}
function registerLogin(p,t){
  const rows=asRows('Login');
  if(rows.some(r=>String(r[2])===t.date&&String(r[4])===p.id))return;
  tab('Login').appendRow([Utilities.getUuid(),t.iso,t.date,t.time,p.id,p.name,p.profesi,'LOGIN']);
}
function recordSession(p,t,d){
  const ses=String(d.session||'');
  if(!SESSIONS.includes(ses))throw Error('Sesi tidak dikenal.');
  if(d.participated!==true)throw Error('Hanya konfirmasi gerakan yang dicatat sebagai partisipasi.');
  const rows=asRows('Aktivitas');
  if(rows.some(r=>String(r[2])===t.date&&String(r[4])===ses&&String(r[5])===p.id))return {already:true,points:0};
  const video=String(d.videoId||'').slice(0,16);
  if(!/^[A-Za-z0-9_-]{11}$/.test(video))throw Error('ID video tidak valid.');
  const title=String(d.videoTitle||'Video senam').slice(0,100).replace(/^[=+@-]/,"'");
  tab('Aktivitas').appendRow([Utilities.getUuid(),t.iso,t.date,t.time,ses,p.id,p.name,p.profesi,video,title,'YA',10,d.motion==='active'?'PERKIRAAN':'TANPA KAMERA','KONFIRMASI MANDIRI']);
  refreshRankingSheet(t);
  return {already:false,points:10};
}
function buildStats(p,t,admin){
  const logins=asRows('Login').filter(r=>String(r[2])===t.date);
  const active=asRows('Aktivitas').filter(r=>String(r[10])==='YA');
  const current=active.filter(r=>String(r[2])===t.date);
  const week=t.week,month=t.month;
  const byPerson={};
  active.forEach(r=>{
    const id=String(r[5]),date=String(r[2]),ses=String(r[4]);
    const key=date+'|'+ses;
    if(!byPerson[id])byPerson[id]={id,week:0,month:0,today:0,unique:new Set()};
    const k=byPerson[id];if(k.unique.has(key))return;k.unique.add(key);
    const day=new Date(date+'T12:00:00+08:00');
    const rw=Utilities.formatDate(day,TZ,'YYYY-ww');
    if(rw===week)k.week+=10;
    if(date.startsWith(month))k.month+=10;
    if(date===t.date)k.today+=1;
  });
  const persons=asRows('Pegawai').map(r=>({id:String(r[0]),name:String(r[1]),alias:String(r[3]||'').trim(),consent:r[4]==='YA'}));
  const leaderboard=persons.filter(x=>x.consent&&x.alias).map(x=>({alias:x.alias,week:byPerson[x.id]?.week||0,month:byPerson[x.id]?.month||0})).filter(x=>x.week||x.month).sort((a,b)=>b.month-a.month||b.week-a.week||a.alias.localeCompare(b.alias));
  const out={todayLogins:new Set(logins.map(r=>String(r[4]))).size,todayParticipants:new Set(current.map(r=>String(r[5]))).size,week,month,leaderboard,my:{today:byPerson[p.id]?.today||0,week:byPerson[p.id]?.week||0,month:byPerson[p.id]?.month||0},totalEmployees:persons.length};
  if(admin)out.adminLogins=logins.map(r=>({name:String(r[5]),profesi:String(r[6]),at:String(r[3])})).slice(-100);
  return out;
}
function refreshRankingSheet(t){
  const people=asRows('Pegawai').filter(r=>r[4]==='YA'&&String(r[3]||'').trim());
  const activities=asRows('Aktivitas').filter(r=>r[10]==='YA');
  const scores={};
  activities.forEach(r=>{
    const id=String(r[5]),date=String(r[2]),session=String(r[4]);
    if(!scores[id])scores[id]={week:0,month:0,sessions:0,keys:new Set()};
    const item=scores[id],key=date+'|'+session;
    if(item.keys.has(key))return;
    item.keys.add(key);
    if(date.startsWith(t.month)){item.month+=10;item.sessions++;}
    const wd=new Date(date+'T12:00:00+08:00');
    if(Utilities.formatDate(wd,TZ,'YYYY-ww')===t.week)item.week+=10;
  });
  const records=people.map(p=>[String(p[0]),String(p[3]),t.week,scores[String(p[0])]?.week||0,t.month,scores[String(p[0])]?.month||0,scores[String(p[0])]?.sessions||0])
    .filter(row=>row[3]||row[5]).sort((a,b)=>b[5]-a[5]||b[3]-a[3]);
  const sh=tab('Peringkat');sh.clearContents();
  sh.getRange(1,1,1,7).setValues([['ID Pegawai','Nama Tampilan','Minggu WITA','Poin Mingguan','Bulan WITA','Poin Bulanan','Sesi Bulan Ini']]);
  if(records.length)sh.getRange(2,1,records.length,7).setValues(records);
}
function doPost(e){
  try{
    if(!e||!e.postData||String(e.postData.contents||'').length>5000)return fail('Permintaan tidak valid.');
    const d=JSON.parse(e.postData.contents), action=String(d.action||'');
    if(!['login','session','snapshot','adminSnapshot','consent'].includes(action))return fail('Aksi tidak diizinkan.');
    const lock=LockService.getScriptLock();lock.waitLock(15000);
    try{
      const p=employeeFor(String(d.employeeId||''),String(d.code||''));
      const t=nowParts();
      if(action==='login'){registerLogin(p,t);return ok({message:'Masuk tercatat',stats:buildStats(p,t,false)})}
      if(action==='session'){const recorded=recordSession(p,t,d);return ok({recorded,stats:buildStats(p,t,false)})}
      if(action==='snapshot'){return ok({stats:buildStats(p,t,false)})}
      if(action==='consent'){
        const sheet=tab('Pegawai'),rows=asRows('Pegawai');
        const index=rows.findIndex(r=>String(r[0])===p.id);
        if(index<0)throw Error('Pegawai tidak ditemukan.');
        if(d.approve===true){
          const alias=String(d.alias||'').trim();
          if(alias.length<3||alias.length>26||!/^[\p{L}\p{N} .'-]+$/u.test(alias))throw Error('Alias harus 3-26 karakter dan tanpa simbol khusus.');
          sheet.getRange(index+2,4,1,2).setValues([[alias,'YA']]);
        }else{
          sheet.getRange(index+2,4,1,2).setValues([['','TIDAK']]);
        }
        refreshRankingSheet(t);
        return ok({stats:buildStats(p,t,false)});
      }
      if(action==='adminSnapshot'){
        if(!adminAllowed(d.adminCode))throw Error('Akses admin ditolak.');
        return ok({stats:buildStats(p,t,true)});
      }
    }finally{lock.releaseLock()}
  }catch(err){return fail(String(err.message||'Tidak dapat memproses permintaan.'))}
}
/* Jalankan fungsi ini sekali dari editor Apps Script. Kolom kode tetap privat!
 * Bagikan kode satu per satu, jangan kirim file Akses kepada seluruh pegawai.
 */
function buatKodeAksesPegawai(){
  const sh=tab('Akses'),persons=asRows('Pegawai');
  sh.clearContents();
  sh.getRange(1,1,1,5).setValues([['ID Pegawai','Hash Kode Akses','Status Aktivasi','Diperbarui Pada','KODE UNTUK DIBAGIKAN (RAHASIA)']]);
  const timestamp=new Date().toISOString();
  const rows=persons.map(p=>{
    const code=Utilities.getUuid().replace(/-/g,'').slice(0,16).toUpperCase();
    return [p[0],digest(code),'AKTIF',timestamp,code];
  });
  if(rows.length)sh.getRange(2,1,rows.length,5).setValues(rows);
}
function buatKodeAdmin(){
  const code=Utilities.getUuid().replace(/-/g,'').slice(0,24).toUpperCase();
  PropertiesService.getScriptProperties().setProperty('ADMIN_CODE_HASH',digest(code));
  Logger.log('SIMPAN KODE ADMIN DI TEMPAT AMAN: '+code);
}

// Jalankan setelah kode pegawai dan kode admin dibuat.
// Memastikan tab dan identitas file benar sebelum penerbitan Web App.
function cekKesiapan(){
  const required=['Pegawai','Akses','Login','Aktivitas','Peringkat'];
  const missing=required.filter(name=>!tab(name));
  if(missing.length)throw Error('Sheet belum tersedia: '+missing.join(', '));
  const staff=asRows('Pegawai');
  if(staff.length!==74)throw Error('Daftar pegawai tidak 74: '+staff.length);
  const codes=asRows('Akses');
  if(codes.length!==staff.length)throw Error('Kode akses pegawai belum dibuat.');
  if(!PropertiesService.getScriptProperties().getProperty('ADMIN_CODE_HASH'))throw Error('Kode admin belum dibuat.');
  Logger.log('SIAP: 74 pegawai, kode akses, dan kode admin telah dikonfigurasi.');
}
