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
  // Tautan pilihan pengelola Puskesmas, dibagikan ke semua perangkat lewat situs.
  // Judul dan durasi belum diverifikasi, jadi ditampilkan sebagai nomor pilihan.
  // Tidak ada video YouTube yang disalin atau di-host ulang.
  const SHARED_USER_VIDEOS = [
    {id:'3hKBZ_I3Dws',title:'Video Pilihan 01',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'f5N4VozNGvA',title:'Video Pilihan 02',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'LHDS3vOvWPg',title:'Video Pilihan 03',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'2f543yuRrVg',title:'Video Pilihan 04',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'Ww5vCKkcfSc',title:'Video Pilihan 05',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'xjeiUBfYRmA',title:'Video Pilihan 06',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'WZwrJGJP5wA',title:'Video Pilihan 07',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'LYx8mxXpkJg',title:'Video Pilihan 08',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'P99Q7OMTusk',title:'Video Pilihan 09',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'ftJwd9c20_A',title:'Video Pilihan 10',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'xupCaUkhCPA',title:'Video Pilihan 11',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'Wn12YAi-THU',title:'Video Pilihan 12',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'7pEjcBAfcvs',title:'Video Pilihan 13',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'ggg3yTNqaG0',title:'Video Pilihan 14',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'cSP48Syciy8',title:'Video Pilihan 15',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'TwRSVTvK7mY',title:'Video Pilihan 16',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'cp7e07aWs5s',title:'Video Pilihan 17',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'FzLH3jzvIqo',title:'Video Pilihan 18',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'},
    {id:'CFpm4vGtMOY',title:'Video Pilihan 19',category:'saya',desc:'Pilihan pengelola Puskesmas • Judul dan durasi mengikuti YouTube',length:'Sesuai video'}
  ];
  // Tiga jeda sukarela; satu video utama untuk setiap sesi.
  const SCHEDULE = [
    {time:'09:00',title:'Senam penyegar pagi',duration:'±5 menit',icon:'☀',videoId:'vFLPkKmCCLU',hint:'Peregangan ringan sebelum melanjutkan pelayanan'},
    {time:'11:00',title:'Relaksasi tubuh',duration:'3–5 menit',icon:'◌',videoId:'N50xlk-EgU4',hint:'Peregangan statis untuk leher, bahu dan tubuh'},
    {time:'13:00',title:'Senam penyegar siang',duration:'±5 menit',icon:'♪',videoId:'PeqWuQY-1CM',hint:'Gerakan dinamis ringan sesuai kemampuan'}
  ];
  const $ = (id) => document.getElementById(id);
  const initial = {employees:[],videos:[],history:[],userId:null};
  let state;
  try { state = {...initial,...JSON.parse(localStorage.getItem(STORAGE)||'{}')}; } catch { state = {...initial}; }
  if (!Array.isArray(state.employees)) state.employees=[];
  if (!Array.isArray(state.videos)) state.videos=[];
  if (!Array.isArray(state.history)) state.history=[];
  let currentVideo = null;
  let currentSession = null;
  let currentPlayerMode = 'standard';
  let motionUsed = false;
  let lastMotionReport = null;
  let youtubeWatch = {startedAt:0,watchedMs:0,completed:false,iframe:null};
  let alternativeSession = '09:00';
  let alternativeType = 'pilihan';
  let alternativePage = 0;
  let alternativeReturn = 'beranda';
  const ALTERNATIVE_PAGE_SIZE = 4;
  let toastTimer;
  const save = () => {try {localStorage.setItem(STORAGE,JSON.stringify(state));} catch {notify('Penyimpanan browser penuh atau diblokir.');}};
  const getEmployees = () => state.employees.length ? state.employees : PEGAWAI_2026;
  const getVideos = () => [...DEFAULT_VIDEOS, ...SHARED_USER_VIDEOS, ...state.videos];
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
    if (!user){const {time}=localParts();text('hero-wita-clock',`${time} WITA`);window.K3Heroes?.setUser(null);loginOptions();return;}
    text('greeting-name',user.nama.split(' ')[0]);
    text('greeting-detail',`${user.profesi}${user.unit?' • '+user.unit:''} | Tetap utamakan pelayanan pasien.`);
    text('today-date',formatDate());
    text('total-schedule',SCHEDULE.length);
    text('employee-count',`${getEmployees().length} pegawai ${state.employees.length?'hasil impor':'data kepegawaian 2026'} tersedia di perangkat ini.`);
    renderVideos();renderSchedule();renderHistory();updateClock();window.K3Heroes?.setUser(user);navigate(location.hash.slice(1)||'beranda');
  }
  function updateClock(){
    const {date,time}=localParts();
    text('wita-clock',`${time} WITA`);
    const remaining=SCHEDULE.find(x=>x.time>=time);
    text('next-time',remaining?.time??'Selesai');
    text('next-title',remaining?.title??'Jadwal hari ini telah selesai');
    const todaySessions=new Set(state.history.filter(x=>x.userId===state.userId&&x.date===date&&x.participated===true&&SCHEDULE.some(s=>s.time===x.session)).map(x=>x.session));
    text('today-count',todaySessions.size);
  }

  function getMainVideo(session){
    return DEFAULT_VIDEOS.find(v=>v.id===session.videoId);
  }
  function renderSchedule(){
    const currentTime=localParts().time;
    $('schedule-list').innerHTML=SCHEDULE.map(s=>{
      const v=getMainVideo(s);
      const status=s.time<currentTime?'Lewat':s.time===currentTime?'Saat ini':'Terjadwal';
      return '<article class="session-card '+(status==='Saat ini'?'session-current':'')+'">' +
        '<div class="session-top"><span class="session-time">'+safe(s.time)+' <small>WITA</small></span><span class="session-status">'+status+'</span></div>' +
        '<h3>'+safe(s.title)+'</h3><p class="session-hint">'+safe(s.hint)+' • '+safe(s.duration)+'</p>' +
        '<div class="session-video-title"><span class="pill">Senam utama</span><span>'+safe(v?.title||'Belum tersedia')+'</span></div>' +
        '<div class="session-actions session-actions-stacked"><button type="button" class="primary session-primary-action" data-play="'+safe(s.videoId)+'" aria-label="Mulai senam utama pukul '+safe(s.time)+'"><span class="session-action-symbol" aria-hidden="true">▶</span><span>Mulai Senam</span></button>' +
        '<button type="button" class="outline session-secondary-action" data-alt-session="'+safe(s.time)+'" aria-label="Lihat pilihan senam lain untuk pukul '+safe(s.time)+'"><span class="session-action-symbol" aria-hidden="true">▤</span><span>Pilihan Senam Lain</span><span class="action-chevron" aria-hidden="true">›</span></button></div></article>';
    }).join('');
  }
  function renderVideos(){
    $('videos-list').innerHTML=SCHEDULE.map(s=>{
      const v=getMainVideo(s);
      if(!v)return '';
      return '<article class="main-video-card"><img class="main-video-thumb" src="'+videoThumb(v.id)+'" alt="Cuplikan '+safe(v.title)+'" loading="lazy">' +
        '<div class="main-video-content"><span class="pill">'+safe(s.time)+' WITA • Senam utama</span><h3>'+safe(v.title)+'</h3>' +
        '<p>'+safe(s.title)+' • '+safe(v.desc)+'</p><div class="session-actions session-actions-stacked">' +
        '<button type="button" class="primary session-primary-action" data-play="'+safe(v.id)+'" aria-label="Mulai senam utama pukul '+safe(s.time)+'"><span class="session-action-symbol" aria-hidden="true">▶</span><span>Mulai Senam</span></button>' +
        '<button type="button" class="outline session-secondary-action" data-alt-session="'+safe(s.time)+'" aria-label="Lihat pilihan senam lain untuk pukul '+safe(s.time)+'"><span class="session-action-symbol" aria-hidden="true">▤</span><span>Pilihan Senam Lain</span><span class="action-chevron" aria-hidden="true">›</span></button></div></div></article>';
    }).join('');
  }
  function getAlternativeVideos(){
    const mainIds=new Set(SCHEDULE.map(s=>s.videoId));
    return alternativeType==='referensi' ?
      DEFAULT_VIDEOS.filter(v=>!mainIds.has(v.id)) :
      [...SHARED_USER_VIDEOS,...state.videos];
  }
  function renderAlternatives(){
    const session=SCHEDULE.find(s=>s.time===alternativeSession)||SCHEDULE[0];
    text('alt-session-time',session.time);
    const videos=getAlternativeVideos();
    const pages=Math.max(1,Math.ceil(videos.length/ALTERNATIVE_PAGE_SIZE));
    alternativePage=Math.max(0,Math.min(alternativePage,pages-1));
    const start=alternativePage*ALTERNATIVE_PAGE_SIZE;
    const items=videos.slice(start,start+ALTERNATIVE_PAGE_SIZE);
    $('alt-list').innerHTML=items.length?items.map(v=>
      '<article class="alt-video-card"><img src="'+videoThumb(v.id)+'" alt="Cuplikan '+safe(v.title)+'" loading="lazy">' +
      '<div class="alt-video-body"><h3>'+safe(v.title)+'</h3><p>'+safe(v.desc)+'</p>' +
      '<button type="button" class="primary small" data-play="'+safe(v.id)+'">▶ Putar di aplikasi</button></div></article>'
    ).join(''):'<div class="empty-state">Belum ada video pada bagian ini.</div>';
    text('alt-page-label','Halaman '+(alternativePage+1)+' dari '+pages);
    $('alt-prev').disabled=alternativePage===0;
    $('alt-next').disabled=alternativePage>=pages-1;
    document.querySelectorAll('[data-alt-type]').forEach(btn=>{
      const selected=btn.dataset.altType===alternativeType;
      btn.classList.toggle('active',selected);
      btn.setAttribute('aria-pressed',String(selected));
    });
  }
  function openAlternatives(time){
    if(!SCHEDULE.some(s=>s.time===time))return;
    alternativeSession=time;
    alternativeReturn=$('page-video').classList.contains('hidden')?'beranda':'video';
    alternativeType='pilihan';
    alternativePage=0;
    location.hash='alternatif';
    navigate('alternatif');
  }
  function renderHistory(){
    const data=state.history.filter(x=>x.userId===state.userId).slice().sort((a,b)=>b.at.localeCompare(a.at));
    text('history-total',data.filter(x=>x.participated!==false).length);
    text('history-days',new Set(data.map(x=>x.date)).size);
    $('history-list').innerHTML=data.length?data.map(x=>`<div class="history-item"><div class="history-icon">✓</div><div><strong>${safe(x.videoTitle)}</strong><span>${safe(x.date)} • ${safe(x.time)} WITA</span></div><span>Konfirmasi mandiri</span></div>`).join(''):'<div class="empty-state">Belum ada riwayat. Mulai video, lakukan gerakan sesuai kemampuan, lalu tekan “Saya sudah mengikuti senam”.</div>';
  }

  function navigate(page){
    if(!['beranda','video','alternatif','heroes','monitoring','riwayat','pengaturan'].includes(page))page='beranda';
    document.querySelectorAll('.app-page').forEach(el=>el.classList.toggle('hidden',el.id!=='page-'+page));
    const selectedNav=page==='alternatif'?'video':page;
    document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.go===selectedNav));
    if(page==='riwayat')renderHistory();
    if(page==='alternatif')renderAlternatives();
    if(page==='pengaturan')updateQr();
    if(page==='heroes'||page==='monitoring')window.K3Heroes?.refresh();
    window.scrollTo({top:0,behavior:'instant'});
  }
  // Pemutar YouTube berada di dalam dialog aplikasi. Gunakan pemutar standar
  // dahulu; jika browser memblokirnya, pengguna bisa beralih ke mode privasi.
  // Catatan: kebijakan penyematan tetap ditentukan oleh pemilik video/YouTube.
  function setPlayerMode(mode){
    if(!currentVideo)return;
    const id=currentVideo.id;
    const host=mode==='private'?'www.youtube-nocookie.com':'www.youtube.com';
    const params=new URLSearchParams({rel:'0',playsinline:'1',origin:location.origin});
    const frame=document.createElement('iframe');
    params.set('enablejsapi','1');
    frame.src='https://'+host+'/embed/'+encodeURIComponent(id)+'?'+params.toString();
    frame.title='Pemutar YouTube: '+currentVideo.title;
    frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.allowFullscreen=true;
    frame.loading='eager';
    const status=$('video-player-status');
    if(status)status.textContent='Memuat video di dalam aplikasi...';
    frame.addEventListener('load',()=>{
      if(frame.isConnected){
        try{frame.contentWindow?.postMessage(JSON.stringify({event:'listening',id:1,channel:'widget'}),'*')}catch{}
        if(status)status.textContent='Setelah video berakhir, apresiasi akan muncul. Bila tidak terdeteksi, gunakan konfirmasi manual.';
      }
    });
    frame.addEventListener('error',()=>{
      if(status&&frame.isConnected)status.textContent='Pemutar tidak berhasil dimuat. Coba mode pemutar lainnya.';
    });
    youtubeWatch.iframe=frame;
    currentPlayerMode=mode;
    $('video-frame').replaceChildren(frame);
    $('player-mode-standard')?.classList.toggle('active',mode==='standard');
    $('player-mode-private')?.classList.toggle('active',mode==='private');
    $('player-mode-standard')?.setAttribute('aria-pressed',String(mode==='standard'));
    $('player-mode-private')?.setAttribute('aria-pressed',String(mode==='private'));
  }

  function openPlayer(id){
    const v=getVideos().find(x=>x.id===id);
    if(!v)return;
    window.K3Motion?.stop();
    currentVideo=v;
    motionUsed=false;
    lastMotionReport=null;
    text('player-title',v.title);
    text('player-description',v.desc);
    const main=SCHEDULE.find(s=>s.videoId===id);
    currentSession=main?.time||(location.hash==='#alternatif'?alternativeSession:null);
    youtubeWatch={startedAt:0,watchedMs:0,completed:false,iframe:null};
    const backup=$('player-fallback-link');
    if(backup)backup.href='https://www.youtube.com/watch?v='+encodeURIComponent(id);
    $('motion-choice-dialog').showModal();
  }
  async function beginVideo(withCamera){
    if(!currentVideo)return;
    $('motion-choice-dialog').close();
    $('player-dialog').showModal();
    setPlayerMode('standard');
    if(withCamera){
      motionUsed=true;
      const started=await window.K3Motion?.start();
      if(!started&&currentVideo&&$('player-dialog').open){
        notify('Deteksi tidak tersedia atau izin ditolak. Video tetap bisa ditonton tanpa kamera.');
      }
    }else{
      motionUsed=false;
      window.K3Motion?.stop();
    }
  }
  function cancelVideoChoice(){
    $('motion-choice-dialog').close();
    currentVideo=null;currentSession=null;
    window.K3Motion?.stop();
  }
  function stopWatchClock(){
    if(youtubeWatch.startedAt){
      youtubeWatch.watchedMs+=Date.now()-youtubeWatch.startedAt;
      youtubeWatch.startedAt=0;
    }
  }
  function closePlayer(){
    lastMotionReport=window.K3Motion?.summary()||null;
    window.K3Motion?.stop();
    stopWatchClock();
    $('player-dialog').close();
    $('video-frame').replaceChildren();
    currentVideo=null;
    currentSession=null;
  }
  const SUCCESS_TIPS={
    '09:00':'Peregangan ringan dapat membantu mengurangi kekakuan setelah duduk atau berdiri lama.',
    '11:00':'Jeda bergerak di tengah pekerjaan membantu mengubah posisi tubuh dan mengistirahatkan otot.',
    '13:00':'Bergerak sejenak setelah siang dapat menjadi penyegar sebelum melanjutkan pelayanan.'
  };
  function getSession(){
    return currentSession||SCHEDULE.find(s=>s.time===localParts().time)?.time||'09:00';
  }
  function showReward(ended){
    if(!currentVideo||!getUser())return;
    stopWatchClock();
    lastMotionReport=motionUsed?(window.K3Motion?.summary()||null):null;
    window.K3Motion?.stop();
    const note=$('reward-motion-report');
    if(note){
      note.classList.toggle('hidden',!motionUsed);
      note.textContent=!motionUsed?'':(lastMotionReport?.samples
        ? 'Deteksi kamera (perkiraan): '+lastMotionReport.status+' • '+lastMotionReport.seconds+' detik gerakan. Tidak membuktikan gerakan benar.'
        : 'Mode kamera dipilih, tetapi gerakan belum dapat dinilai. Tidak ada foto atau video yang disimpan.');
    }
    const session=getSession();
    const {date}=localParts();
    const already=state.history.some(x=>x.userId===state.userId&&x.date===date&&x.session===session&&x.participated===true);
    text('reward-title',ended?'Video selesai, '+getUser().nama.split(' ')[0]+'!':'Terima kasih, '+getUser().nama.split(' ')[0]+'!');
    text('reward-session',session+' WITA');
    text('reward-tip',SUCCESS_TIPS[session]);
    text('reward-context',ended?'Video sudah selesai. Apakah Anda ikut melakukan gerakannya?':'Konfirmasi mandiri: apakah Anda mengikuti gerakan senam?');
    text('reward-score',already?'Poin sesi ini sudah tercatat':'Konfirmasi gerakan: +10 poin lokal');
    const todaySessions=new Set(state.history.filter(x=>x.userId===state.userId&&x.date===date&&x.participated===true&&SCHEDULE.some(s=>s.time===x.session)).map(x=>x.session));
    text('reward-progress','Kemajuan hari ini: '+todaySessions.size+' dari 3 sesi');
    $('reward-progress-bar').style.width=(todaySessions.size/3*100)+'%';
    $('reward-participated').disabled=already;
    $('reward-participated').textContent=already?'Sudah tercatat hari ini':'Ya, saya ikut bergerak';
    $('player-dialog').close();
    $('video-frame').replaceChildren();
    $('reward-dialog').showModal();
    const confetti=$('reward-confetti');
    confetti.replaceChildren();
    if(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
      for(let i=0;i<28;i++){
        const piece=document.createElement('i');
        piece.className='reward-piece';
        piece.style.left=(4+(i*37%93))+'%';
        piece.style.animationDelay=(i%9*0.09)+'s';
        piece.style.background=['#e5b653','#36a88b','#9edbd4','#e38b74'][i%4];
        confetti.append(piece);
      }
    }
  }
  function finishReward(participated){
    const user=getUser(),v=currentVideo;
    if(!user||!v)return;
    const {date,time}=localParts(),session=getSession();
    const duplicate=state.history.some(x=>x.userId===state.userId&&x.date===date&&x.session===session&&x.participated===true);
    if(participated&&!duplicate){
      const record={userId:state.userId,employeeName:user.nama,profession:user.profesi,unit:user.unit,date,time,session,participated:true,points:10,videoId:v.id,videoTitle:v.title,motion:motionUsed===true&&!!lastMotionReport?.samples,at:new Date().toISOString()};
      state.history.push(record);
      save();
      window.K3Heroes?.onActivity(record);
    }
    $('reward-dialog').close();
    $('reward-confetti').replaceChildren();
    currentVideo=null;
    currentSession=null;
    motionUsed=false;lastMotionReport=null;
    youtubeWatch={startedAt:0,watchedMs:0,completed:false,iframe:null};
    renderHistory();updateClock();
    notify(participated?(duplicate?'Sesi ini sudah tercatat.':'Aktivitas tercatat: +10 poin lokal.'): 'Terima kasih sudah menonton. Tidak ada poin yang ditambahkan.');
  }
  // YouTube IFrame API mengirim pesan state. Hanya terima pesan dari iframe aktif.
  window.addEventListener('message',event=>{
    if(!currentVideo||!$('player-dialog').open)return;
    if(!['https://www.youtube.com','https://www.youtube-nocookie.com'].includes(event.origin))return;
    if(event.source!==youtubeWatch.iframe?.contentWindow)return;
    let data=event.data;
    if(typeof data==='string'){try{data=JSON.parse(data)}catch{return}}
    if(!data||data.event!=='onStateChange')return;
    const stateCode=Number(data.info);
    if(stateCode===1){
      if(!youtubeWatch.startedAt)youtubeWatch.startedAt=Date.now();
    }else if(stateCode===2||stateCode===0||stateCode===-1){
      stopWatchClock();
    }
    if(stateCode===0&&!youtubeWatch.completed){
      youtubeWatch.completed=true;
      // Peristiwa ended berasal dari YouTube, bukan tebakan berdasarkan timer.
      showReward(true);
    }
  });
  // Browser-only reminder: notifications do not run when the tab or browser is fully closed.

  function checkReminder(){
    // Pengingat ringan hanya ketika aplikasi terbuka, tidak memulai video otomatis.
    if(!getUser()||document.hidden||$('player-dialog').open)return;
    const {date,time}=localParts();
    const session=SCHEDULE.find(s=>s.time===time);
    if(!session)return;
    const key='k3_reminder_'+date+'_'+time;
    if(sessionStorage.getItem(key))return;
    sessionStorage.setItem(key,'1');
    notify('Jeda K3 '+session.time+': '+session.title+'. Jika melayani pasien, boleh dilewati.');
    if('Notification' in window&&Notification.permission==='granted'){
      new Notification('Pengingat K3 (opsional)',{
        body:session.title+'. Lakukan hanya jika pelayanan memungkinkan.',
        icon:'assets/icon.svg',silent:true
      });
    }
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
  $('change-user').addEventListener('click',()=>{window.K3Motion?.stop();state.userId=null;save();showApp();});

  document.addEventListener('click',e=>{
    const play=e.target.closest('[data-play]');
    if(play){openPlayer(play.dataset.play);return;}
    const alt=e.target.closest('[data-alt-session]');
    if(alt){openAlternatives(alt.dataset.altSession);return;}
    const type=e.target.closest('[data-alt-type]');
    if(type){alternativeType=type.dataset.altType;alternativePage=0;renderAlternatives();return;}
    const paging=e.target.closest('[data-alt-page]');
    if(paging){alternativePage+=Number(paging.dataset.altPage);renderAlternatives();return;}
    const back=e.target.closest('[data-alt-back]');
    if(back){location.hash=alternativeReturn;navigate(alternativeReturn);return;}
    const go=e.target.closest('[data-go]');
    if(go){location.hash=go.dataset.go;navigate(go.dataset.go);}
  });
  window.addEventListener('hashchange',()=>{if(getUser())navigate(location.hash.slice(1));});
  $('player-mode-standard').addEventListener('click',()=>setPlayerMode('standard'));
  $('player-mode-private').addEventListener('click',()=>setPlayerMode('private'));
  $('motion-choose-normal').addEventListener('click',()=>beginVideo(false));
  $('motion-choose-camera').addEventListener('click',()=>beginVideo(true));
  $('motion-choose-cancel').addEventListener('click',cancelVideoChoice);
  $('motion-choice-dialog').addEventListener('cancel',e=>{e.preventDefault();cancelVideoChoice();});
  $('motion-stop-camera').addEventListener('click',()=>{
    window.K3Motion?.stop();
    notify('Kamera dimatikan. Senam dapat dilanjutkan tanpa deteksi.');
  });
  $('close-player').addEventListener('click',closePlayer);
  $('close-player-2').addEventListener('click',closePlayer);
  $('player-dialog').addEventListener('close',()=>{
    window.K3Motion?.stop();
    stopWatchClock();
    $('video-frame').replaceChildren();
  });
  $('reward-participated').addEventListener('click',()=>finishReward(true));
  $('reward-watched').addEventListener('click',()=>finishReward(false));
  $('reward-close').addEventListener('click',()=>finishReward(false));
  $('reward-dialog').addEventListener('cancel',e=>{e.preventDefault();finishReward(false);});
  $('finish-video').addEventListener('click',()=>showReward(false));
  // Alternatif ditampilkan pada halaman tersendiri, empat video per halaman.
  $('export-csv').addEventListener('click',exportHistory);
  $('notification-btn').addEventListener('click',async()=>{
    if(!('Notification' in window)){notify('Browser tidak mendukung notifikasi.');return;}
    try {const status=await Notification.requestPermission();text('notification-status',status==='granted'?'Izin diberikan. Pengingat hanya berjalan selama halaman terbuka.':'Izin belum diberikan.');}catch{notify('Notifikasi tidak dapat diaktifkan di perangkat ini.');}
  });
  $('share-app').addEventListener('click',async()=>{const url=new URL('./',location.href).href;if(location.protocol==='file:'){notify('Publikasikan situs dulu untuk mendapat tautan QR.');return;}try{if(navigator.share)await navigator.share({title:'K3 Active Break',url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);notify('Tautan aplikasi disalin.');}else notify(url);}catch(e){if(e.name!=='AbortError')notify('Tidak bisa membagikan tautan.');}});
  $('csv-input').addEventListener('change',async(e)=>{const f=e.target.files?.[0];if(!f)return;try {importCsv(await f.text());} catch(err){notify(err.message);}e.target.value='';});
  $('video-form').addEventListener('submit',e=>{
    e.preventDefault();const title=$('video-name').value.trim(),id=yid($('video-url').value.trim());
    if(!id){notify('Gunakan tautan video YouTube yang valid.');return;}
    if(getVideos().some(v=>v.id===id)){notify('Video ini sudah ada dalam daftar.');return;}
    state.videos.push({id,title,category:'saya',desc:'Video tambahan di perangkat ini • Tautan YouTube',length:'Sesuai video'});
    save();e.target.reset();renderAlternatives();notify('Video alternatif ditambahkan di perangkat ini.');
  });
  $('clear-local').addEventListener('click',()=>{
    if(!confirm('Hapus semua data pegawai impor, video tambahan, identitas, dan riwayat pada browser ini?'))return;
    window.K3Motion?.stop();
    localStorage.removeItem(STORAGE);state={...initial};alternativeType='pilihan';alternativePage=0;showApp();notify('Data lokal berhasil dihapus.');
  });
  showApp();
  setInterval(()=>{if(getUser()){updateClock();renderSchedule();checkReminder();}else{const {time}=localParts();text('wita-clock',`${time} WITA`);text('hero-wita-clock',`${time} WITA`);}},20000);
  if('serviceWorker' in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
