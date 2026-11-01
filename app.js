/* K3 Active Break - versi prototipe lokal. Tidak ada API atau autentikasi server. */
(() => {
  'use strict';
  const STORAGE = 'k3_ile_bura_v1';
  const ZONE = 'Asia/Makassar';
  /* Nama dan profesi dari Infografik Data Kepegawaian Puskesmas Ile Bura 2026.
     Hanya nama & kategori profesi, tidak memuat NIP atau data pribadi lain.
     Catatan: daftar ini tampil pada situs publik GitHub Pages. */
  const PEGAWAI_2026 = `Perawat|Yohanes Noda Kwuta
Perawat|Wilhelmus Feko Mare
Perawat|Lodovika Hahu
Perawat|Yohana Fransiska Salan Uran
Perawat|Antonia Lete Hokeng
Perawat|Wemi Efria Toulasik
Perawat|Maria Ice Domaking
Perawat|Yohana Jawa Wain
Perawat|Hendrikus Hali Pehan
Perawat|Timoteus Geu
Perawat|Maria Imakulata Soge Nayan
Perawat|Sesilia Ade Irma Mukin
Perawat|Paulus Marianus S. Da Silva
Perawat|Yustina Elisabeth Barek Ritan
Perawat|Emiliana Halen Uran
Perawat|Rosalia Agustina Makin
Perawat|Dionisia Nini Ola Lamanepa
Perawat|Maria Yosefina Mona Lewuk
Perawat|Valentina Hore Witi
Perawat|Siprianus Doma Leba
Perawat|Donatus Lengo
Bidan|Sesilia Serly Kebo
Bidan|Mathildis Kedang
Bidan|Maria Bali Blolon
Bidan|Maria Imakulata Nogo Ritan
Bidan|Yasinta Tristianty
Bidan|Maria Yuvensia
Bidan|Lusia Meylania Wain Boru
Bidan|Soviana Virgonia A. Sonia Kleden
Bidan|Fransiska Bispanti Nurak
Bidan|Rosalinda Lete Puor
Bidan|Maria Lelo Hurint
Bidan|Marjorie Jane
Bidan|Marselina Yohana Habu Namang
Bidan|Veronika Berlindis Myro Liwu
Bidan|Beatrix Seinhora Letek Kromen
Bidan|Anastasia Rowan Darang
Bidan|Maria Fatima Marsiana Penaten Ola
Bidan|Mariana Susanty Tuto Wurin
Bidan|Brigita Maria Redempta
Bidan|Emirensiana Eda Ritan
Bidan|Yuliana Barek Hoda
Bidan|Serlina Jawa Mukin
Bidan|Rosalia Jaja Weking
Bidan|Maria Anjelina Lodan Lebao
Bidan|Benedikta Roja Kwuta
Bidan|Herlina Lering Kedang
Bidan|Yosefina Dawan Uran
Kefarmasian|Yuliana Bte Hendrik
Kefarmasian|Maria Halmina Rume
Kefarmasian|Adrianus Kopong Tadon
Fisioterapis|Salvatrix Intan Apryani Ubas
ATLM|Frederikus Domi Goo
ATLM|Maria Petronela N. Nona Thalar
ATLM|Yohanes Baptista Seri De Ornay
Sanitarian|Hendrikus Helun Welan
Sanitarian|Antonius Wao Blolon
Promosi Kesehatan|Yosefina Ene Blolon
Promosi Kesehatan|Marselina Lepan
Promosi Kesehatan|Maria Magdalena Wunga Payong
Epidemiolog|Klara Mona Bara
Gizi|Maria Maru Wora
Gizi|Elisabet Weka Leba
Gizi|Margaretha Beatrix Rua
Arsiparis|Elisabet Katarina Golan Wain
Administrasi Kesehatan|Stefanus Tarabao Darang
Administrasi Kesehatan|Yanuarius Meang Tupen
Operator Layanan|Matheus Naya De Ornay
Operator Layanan|Mikael Gerardus I. F. Riberu
Operator Layanan|Lidia Gete Kwure
Administrasi|Getrudis Kilu Kwuta
Administrasi|Selerina Dai Bte Simon Ola
Dokter|dr. Lodvianes Subanraya Lewar
Dokter Gigi|Agustina Oartansia Tita Riberu`.split('\n').map((line,i)=>{
    const [profesi,nama]=line.split('|');
    return {id:'pegawai-2026-'+String(i+1).padStart(3,'0'),nama,profesi,unit:''};
  });
  /* Pilihan utama: tautan diperiksa dari kanal/laman resmi atau hasil YouTube.
     Video tetap di YouTube dan diputar melalui embed bila pemilik mengizinkan. */
  const DEFAULT_VIDEOS = [
    {id:'vFLPkKmCCLU',title:'Panduan Gerakan Senam Peregangan',category:'utama',desc:'Kementerian PANRB • Panduan gerakan peregangan untuk pegawai di tempat kerja',length:'Sekitar 5 menit'},
    {id:'7qK9d6zSVeM',title:'Video Peregangan di Tempat Kerja',category:'utama',desc:'Kementerian PANRB • Ikuti gerakan peregangan bersama saat jeda kerja',length:'Ikuti sesuai video'},
    {id:'_-josZw_cpw',title:'Senam Peregangan RSCM',category:'utama',desc:'RSUPN Cipto Mangunkusumo • Gerakan peregangan di sela kesibukan',length:'Ikuti sesuai video'},
    {id:'PeqWuQY-1CM',title:'Senam Peregangan Dinamis • Versi 1',category:'utama',desc:'Puskesmas Goranggareng Taji • Peregangan dinamis untuk variasi kegiatan',length:'Ikuti sesuai video'},
    {id:'qwKO4fmptg0',title:'Senam Peregangan Dinamis • Versi 2',category:'utama',desc:'Puskesmas Goranggareng Taji • Alternatif gerakan dinamis',length:'Ikuti sesuai video'},
    {id:'N50xlk-EgU4',title:'Peregangan Statis di Tempat Kerja',category:'utama',desc:'Puskesmas Goranggareng Taji • Gerakan peregangan statis',length:'Ikuti sesuai video'},
    {id:'NkOl3371PL0',title:'Senam Peregangan untuk Pemula',category:'utama',desc:'SKWAD Fitness • Peregangan ringan untuk pemula dan sesudah duduk lama',length:'5 menit'}
  ];
  const SCHEDULE = [
    {time:'07:00',title:'Pemanasan sebelum bekerja',duration:'3 menit',icon:'☀'},
    {time:'08:30',title:'Peregangan leher dan bahu',duration:'3 menit',icon:'◌'},
    {time:'10:00',title:'Senam ringan bersama',duration:'5 menit',icon:'✦'},
    {time:'11:30',title:'Relaksasi mata dan punggung',duration:'3 menit',icon:'◉'},
    {time:'13:00',title:'Senam penyegar tubuh',duration:'5 menit',icon:'♪'},
    {time:'14:15',title:'Peregangan sebelum pulang',duration:'3 menit',icon:'✓'}
  ];
  const $ = (id) => document.getElementById(id);
  const initial = {employees:[],videos:[],history:[],userId:null};
  let state;
  try { state = {...initial,...JSON.parse(localStorage.getItem(STORAGE)||'{}')}; } catch { state = {...initial}; }
  if (!Array.isArray(state.employees)) state.employees=[];
  if (!Array.isArray(state.videos)) state.videos=[];
  if (!Array.isArray(state.history)) state.history=[];
  let currentVideo = null;
  let videoFilter = 'semua';
  let toastTimer;
  const save = () => {try {localStorage.setItem(STORAGE,JSON.stringify(state));} catch {notify('Penyimpanan browser penuh atau diblokir.');}};
  const getEmployees = () => state.employees.length ? state.employees : PEGAWAI_2026;
  const getVideos = () => [...DEFAULT_VIDEOS, ...state.videos];
  const getUser = () => getEmployees().find(p=>p.id===state.userId) || null;
  const localParts = () => {
    const parts = new Intl.DateTimeFormat('en-GB',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    const p = Object.fromEntries(parts.map(v=>[v.type,v.value]));
    return {date:`${p.year}-${p.month}-${p.day}`,time:`${p.hour}:${p.minute}`};
  };
  const formatDate = () => new Intl.DateTimeFormat('id-ID',{timeZone:ZONE,day:'numeric',month:'long',year:'numeric',weekday:'long'}).format(new Date());
  const text = (selector,value) => {$(selector).textContent=value;};
  function notify(message){const el=$('toast');el.textContent=message;el.classList.add('shown');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('shown'),3300);}
  function safe(t){return String(t ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function yid(input){
    try {const u=new URL(input);const host=u.hostname.toLowerCase().replace(/^www\./,'');let id='';
      if(host==='youtu.be') id=u.pathname.slice(1).split('/')[0];
      else if(host==='youtube.com'||host==='m.youtube.com'||host==='youtube-nocookie.com') id=u.searchParams.get('v')||u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1]||'';
      return /^[A-Za-z0-9_-]{11}$/.test(id)?id:null;
    } catch{return null;}
  }
  const videoThumb=id=>`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
  function loginOptions(){
    const professions=[...new Set(getEmployees().map(x=>x.profesi))].sort((a,b)=>a.localeCompare(b,'id'));
    const old=$('profession').value;
    $('profession').innerHTML='<option value="">Pilih profesi terlebih dahulu</option>'+professions.map(p=>`<option value="${safe(p)}">${safe(p)}</option>`).join('');
    if(professions.includes(old)) $('profession').value=old;
    updateEmployeeOptions();
    $('demo-note').classList.toggle('hidden',state.employees.length>0);
  }
  function updateEmployeeOptions(){
    const prof=$('profession').value;
    const options=getEmployees().filter(x=>x.profesi===prof).sort((a,b)=>a.nama.localeCompare(b.nama,'id'));
    $('employee').disabled=!prof;
    $('employee').innerHTML=`<option value="">${prof?'Pilih nama pegawai':'Pilih profesi terlebih dahulu'}</option>`+options.map(x=>`<option value="${safe(x.id)}">${safe(x.nama)}${x.unit?' • '+safe(x.unit):''}</option>`).join('');
    $('login-btn').disabled=true;
  }
  function showApp(){
    const user=getUser();
    $('login-screen').classList.toggle('hidden',!!user);
    $('app-screen').classList.toggle('hidden',!user);
    $('change-user').classList.toggle('hidden',!user);
    if (!user){loginOptions();return;}
    text('greeting-name',user.nama.split(' ')[0]);
    text('greeting-detail',`${user.profesi}${user.unit?' • '+user.unit:''} | Tetap utamakan pelayanan pasien.`);
    text('today-date',formatDate());
    text('total-schedule',SCHEDULE.length);
    text('employee-count',`${getEmployees().length} pegawai ${state.employees.length?'hasil impor':'data kepegawaian 2026'} tersedia di perangkat ini.`);
    renderFeatured();renderVideos();renderSchedule();renderHistory();updateClock();navigate(location.hash.slice(1)||'beranda');
  }
  function updateClock(){
    const {date,time}=localParts();
    text('wita-clock',`${time} WITA`);
    const remaining=SCHEDULE.find(x=>x.time>time);
    text('next-time',remaining?.time??'Selesai');
    text('next-title',remaining?.title??'Jadwal hari ini telah selesai');
    text('today-count',state.history.filter(x=>x.userId===state.userId&&x.date===date).length);
  }
  function renderFeatured(){
    const v=getVideos().find(x=>x.category==='utama')||getVideos()[0];
    if(!v){$('featured-video').innerHTML='<p>Belum ada video.</p>';return;}
    $('featured-video').innerHTML=`<div class="thumb"><img src="${videoThumb(v.id)}" alt="Cuplikan video ${safe(v.title)}" loading="lazy"><span class="thumb-play">▶</span></div><div><span class="pill">Senam utama</span><h3>${safe(v.title)}</h3><p>${safe(v.desc)}</p><p>Durasi: ${safe(v.length||'Sesuai video')}</p><button class="primary" data-play="${v.id}">▶ Putar senam sekarang</button></div>`;
  }
  function renderVideos(){
    const videos=videoFilter==='saya'?state.videos:getVideos().filter(v=>videoFilter==='semua'||v.category===videoFilter);
    const output=$('videos-list');
    if(!videos.length){output.innerHTML='<div class="empty-state">Belum ada video untuk kategori ini. Anda bisa menambahkan video di halaman Pengaturan.</div>';return;}
    output.innerHTML=videos.map(v=>`<article class="video-card"><div class="thumb"><img src="${videoThumb(v.id)}" alt="Cuplikan video ${safe(v.title)}" loading="lazy"><span class="thumb-play">▶</span></div><div class="video-card-body"><span class="pill">${v.category==='utama'?'Senam utama':'Senam hiburan'}</span><h3>${safe(v.title)}</h3><p>${safe(v.desc)}${v.length?' • '+safe(v.length):''}</p><button class="primary" data-play="${v.id}">▶ Putar di aplikasi</button></div></article>`).join('');
  }
  function renderSchedule(){
    const {time}=localParts();
    $('schedule-list').innerHTML=SCHEDULE.map(s=>`<div class="schedule-row"><span class="schedule-time">${s.time}</span><span class="schedule-icon" aria-hidden="true">${s.icon}</span><div class="schedule-main"><strong>${safe(s.title)}</strong><span>${safe(s.duration)}</span></div><span class="schedule-status">${s.time<time?'Lewat':s.time===time?'Saat ini':'Terjadwal'}</span></div>`).join('');
  }
  function renderHistory(){
    const data=state.history.filter(x=>x.userId===state.userId).slice().sort((a,b)=>b.at.localeCompare(a.at));
    text('history-total',data.length);
    text('history-days',new Set(data.map(x=>x.date)).size);
    $('history-list').innerHTML=data.length?data.map(x=>`<div class="history-item"><div class="history-icon">✓</div><div><strong>${safe(x.videoTitle)}</strong><span>${safe(x.date)} • ${safe(x.time)} WITA</span></div><span>Konfirmasi mandiri</span></div>`).join(''):'<div class="empty-state">Belum ada riwayat. Mulai video, lakukan gerakan sesuai kemampuan, lalu tekan “Saya sudah mengikuti senam”.</div>';
  }
  function navigate(page){
    if(!['beranda','video','riwayat','pengaturan'].includes(page)) page='beranda';
    document.querySelectorAll('.app-page').forEach(el=>el.classList.toggle('hidden',el.id!==`page-${page}`));
    document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.go===page));
    if(page==='riwayat')renderHistory();
    if(page==='pengaturan')updateQr();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function openPlayer(id){
    const v=getVideos().find(x=>x.id===id);
    if(!v)return;
    currentVideo=v;
    text('player-title',v.title);
    text('player-description',v.desc);
    const iframe=document.createElement('iframe');
    iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&playsinline=1`;
    iframe.title=`Pemutar video: ${v.title}`;
    iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    iframe.allowFullscreen=true;
    $('video-frame').replaceChildren(iframe);
    $('player-dialog').showModal();
  }
  function closePlayer(){$('player-dialog').close();$('video-frame').replaceChildren();currentVideo=null;}
  function saveActivity(){
    if(!currentVideo||!getUser())return;
    const {date,time}=localParts();
    const v=currentVideo;
    const duplicate=state.history.some(x=>x.userId===state.userId&&x.date===date&&x.videoId===v.id&&x.time===time);
    if(duplicate){notify('Kegiatan ini sudah tercatat pada menit yang sama.');return;}
    state.history.push({userId:state.userId,employeeName:getUser().nama,profession:getUser().profesi,unit:getUser().unit,date,time,videoId:v.id,videoTitle:v.title,at:new Date().toISOString()});
    save();closePlayer();renderHistory();updateClock();notify('Konfirmasi aktivitas berhasil dicatat di perangkat ini.');
  }
  // Browser-only reminder: notifications do not run when the tab or browser is fully closed.
  function checkReminder(){
    if(!getUser())return;
    const {date,time}=localParts();
    const session=SCHEDULE.find(s=>s.time===time);
    if(!session)return;
    const key='k3_reminder_'+date+'_'+time;
    if(sessionStorage.getItem(key))return;
    sessionStorage.setItem(key,'1');
    notify(`Waktu K3: ${session.title}. Sesuaikan dengan pelayanan pasien.`);
    if('Notification' in window&&Notification.permission==='granted')new Notification('K3 Active Break',{body:`${session.title} • ${session.duration}. Jika pelayanan memungkinkan.`,icon:'assets/icon.svg'});
  }
  function updateQr(){
    const isWeb=location.protocol==='https:'||location.hostname==='localhost';
    $('qr-image').classList.toggle('hidden',!isWeb);
    $('qr-placeholder').classList.toggle('hidden',isWeb);
    if(isWeb){const url=new URL('./',location.href).href;$('qr-image').src=`https://api.qrserver.com/v1/create-qr-code/?size=170x170&margin=8&data=${encodeURIComponent(url)}`;}
  }
  function parseCSV(s){
    s=s.replace(/^\uFEFF/,'');
    const first=s.split(/\r?\n/,1)[0];
    const delim=first.includes(';')&&!first.includes(',')?';':',';
    const rows=[];let row=[],field='',quoted=false;
    for(let i=0;i<s.length;i++){
      const c=s[i];
      if(c==='"'){if(quoted&&s[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
      else if(c===delim&&!quoted){row.push(field);field='';}
      else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&s[i+1]==='\n')i++;row.push(field);if(row.some(x=>x.trim()))rows.push(row);row=[];field='';}
      else field+=c;
    }
    row.push(field);if(row.some(x=>x.trim()))rows.push(row);
    return rows;
  }
  function importCsv(csv){
    const rows=parseCSV(csv);
    if(rows.length<2)throw Error('File harus memiliki baris judul dan setidaknya satu pegawai.');
    const keys=rows.shift().map(x=>x.trim().toLowerCase());
    const cols=['nama','profesi','unit'].map(x=>keys.indexOf(x));
    if(cols.some(i=>i<0))throw Error('Kolom wajib adalah nama,profesi,unit.');
    const people=rows.map((r,i)=>({id:`pegawai-${i+1}`,nama:(r[cols[0]]||'').trim(),profesi:(r[cols[1]]||'').trim(),unit:(r[cols[2]]||'').trim()})).filter(x=>x.nama&&x.profesi);
    if(!people.length)throw Error('Tidak ditemukan nama dan profesi yang valid.');
    const unique=new Set(people.map(p=>p.nama.toLowerCase()+'|'+p.profesi.toLowerCase()+'|'+p.unit.toLowerCase()));
    if(unique.size!==people.length)throw Error('Ada baris nama, profesi, dan unit yang sama persis. Periksa data duplikat.');
    state.employees=people;
    state.userId=null;
    save();showApp();notify(`${people.length} pegawai berhasil diimpor ke browser ini.`);
  }
  function csvQuote(s){
    let v=String(s??'');
    if(/^[=+@\-]/.test(v))v="'"+v; // cegah formula injection saat dibuka di spreadsheet
    return '"'+v.replace(/"/g,'""')+'"';
  }
  function exportHistory(){
    const user=getUser();if(!user)return;
    const rows=state.history.filter(x=>x.userId===user.id);
    const data=[['Tanggal','Waktu WITA','Nama Pegawai','Profesi','Unit','Video','Keterangan'],...rows.map(x=>[x.date,x.time,x.employeeName,x.profession,x.unit,x.videoTitle,'Konfirmasi mandiri'])];
    const csv='\uFEFF'+data.map(r=>r.map(csvQuote).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=`riwayat-k3-${localParts().date}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('profession').addEventListener('change',updateEmployeeOptions);
  $('employee').addEventListener('change',()=>{$('login-btn').disabled=!$('employee').value;});
  $('login-btn').addEventListener('click',()=>{const id=$('employee').value;if(!getEmployees().some(x=>x.id===id))return;state.userId=id;save();showApp();});
  $('change-user').addEventListener('click',()=>{state.userId=null;save();showApp();});
  document.addEventListener('click',e=>{
    const go=e.target.closest('[data-go]');if(go){location.hash=go.dataset.go;navigate(go.dataset.go);}
    const play=e.target.closest('[data-play]');if(play)openPlayer(play.dataset.play);
  });
  window.addEventListener('hashchange',()=>{if(getUser())navigate(location.hash.slice(1));});
  $('close-player').addEventListener('click',closePlayer);
  $('close-player-2').addEventListener('click',closePlayer);
  $('player-dialog').addEventListener('close',()=>{$('video-frame').replaceChildren();currentVideo=null;});
  $('finish-video').addEventListener('click',saveActivity);
  document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{videoFilter=el.dataset.filter;document.querySelectorAll('[data-filter]').forEach(c=>c.classList.toggle('active',c===el));renderVideos();}));
  $('export-csv').addEventListener('click',exportHistory);
  $('notification-btn').addEventListener('click',async()=>{
    if(!('Notification' in window)){notify('Browser tidak mendukung notifikasi.');return;}
    try {const status=await Notification.requestPermission();text('notification-status',status==='granted'?'Izin diberikan. Pengingat hanya berjalan selama halaman terbuka.':'Izin belum diberikan.');}catch{notify('Notifikasi tidak dapat diaktifkan di perangkat ini.');}
  });
  $('share-app').addEventListener('click',async()=>{const url=new URL('./',location.href).href;if(location.protocol==='file:'){notify('Publikasikan situs dulu untuk mendapat tautan QR.');return;}try{if(navigator.share)await navigator.share({title:'K3 Active Break',url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);notify('Tautan aplikasi disalin.');}else notify(url);}catch(e){if(e.name!=='AbortError')notify('Tidak bisa membagikan tautan.');}});
  $('csv-input').addEventListener('change',async(e)=>{const f=e.target.files?.[0];if(!f)return;try {importCsv(await f.text());} catch(err){notify(err.message);}e.target.value='';});
  $('video-form').addEventListener('submit',e=>{
    e.preventDefault();const title=$('video-name').value.trim(),id=yid($('video-url').value.trim()),category=$('video-category').value;
    if(!id){notify('Gunakan tautan video YouTube yang valid.');return;}
    if(getVideos().some(v=>v.id===id)){notify('Video ini sudah ada dalam daftar.');return;}
    state.videos.push({id,title,category,desc:'Video pilihan pegawai • Tautan YouTube',length:'Sesuai video'});
    save();e.target.reset();renderVideos();renderFeatured();notify('Video ditambahkan di perangkat ini.');
  });
  $('clear-local').addEventListener('click',()=>{
    if(!confirm('Hapus semua data pegawai impor, video tambahan, identitas, dan riwayat pada browser ini?'))return;
    localStorage.removeItem(STORAGE);state={...initial};videoFilter='semua';showApp();notify('Data lokal berhasil dihapus.');
  });
  showApp();
  setInterval(()=>{if(getUser()){updateClock();renderSchedule();checkReminder();}else{const {time}=localParts();text('wita-clock',`${time} WITA`);}},20000);
  if('serviceWorker' in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
