/* K3 Smart Motion: analisis titik tubuh lokal, tanpa foto/rekaman/upload. */
(()=>{
  'use strict';
  const MP='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0';
  const MODEL='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
  const $=id=>document.getElementById(id);
  let stream=null,landmarker=null,token=0,tick=null,previous=null,lastTime=0;
  let movedMs=0,poseSamples=0,movingSamples=0,started=false;
  function status(message){const el=$('motion-status');if(el)el.textContent=message;}
  function summary(){
    return {active:started,seconds:Math.round(movedMs/1000),samples:poseSamples,movingSamples,status:poseSamples===0?'Belum dapat dianalisis':movingSamples>1?'Gerakan terdeteksi (perkiraan)':'Gerakan belum cukup terdeteksi'};
  }
  function stop(){
    token++;
    if(tick){clearTimeout(tick);tick=null;}
    if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
    const video=$('motion-camera-video');
    if(video){video.pause();video.srcObject=null;}
    $('motion-camera-panel')?.classList.add('hidden');
    started=false;previous=null;lastTime=0;
  }
  function positions(points){
    const indices=[11,12,13,14,15,16,23,24];
    if(!indices.every(i=>points[i]&&((points[i].visibility??1)>0.4)))return null;
    const center={x:(points[23].x+points[24].x)/2,y:(points[23].y+points[24].y)/2};
    const shoulderWidth=Math.max(.12,Math.hypot(points[11].x-points[12].x,points[11].y-points[12].y));
    return indices.map(i=>({x:(points[i].x-center.x)/shoulderWidth,y:(points[i].y-center.y)/shoulderWidth}));
  }
  async function start(){
    stop();
    const current=token;
    movedMs=0;poseSamples=0;movingSamples=0;lastTime=0;previous=null;
    const panel=$('motion-camera-panel'),video=$('motion-camera-video');
    if(!panel||!video)return false;
    panel.classList.remove('hidden');
    status('Meminta izin kamera...');
    try{
      if(!navigator.mediaDevices?.getUserMedia)throw Error('Browser tidak mendukung kamera pada halaman ini.');
      const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:360},height:{ideal:270}},audio:false});
      if(current!==token){media.getTracks().forEach(t=>t.stop());return false;}
      stream=media;video.srcObject=media;video.muted=true;video.playsInline=true;
      await video.play();
      status('Menyiapkan deteksi gerakan pada perangkat...');
      const mediapipe=await import(MP+'/vision_bundle.mjs');
      if(current!==token)return false;
      const files=await mediapipe.FilesetResolver.forVisionTasks(MP+'/wasm');
      if(current!==token)return false;
      if(!landmarker){
        landmarker=await mediapipe.PoseLandmarker.createFromOptions(files,{
          baseOptions:{modelAssetPath:MODEL,delegate:'CPU'},
          runningMode:'VIDEO',numPoses:1,
          minPoseDetectionConfidence:0.5,minPosePresenceConfidence:0.5,minTrackingConfidence:0.5
        });
      }
      if(current!==token)return false;
      started=true;
      status('Kamera aktif. Atur posisi tubuh agar bahu dan tangan terlihat.');
      const sample=()=>{
        if(current!==token||!stream||!started)return;
        if(!document.hidden&&video.readyState>=2){
          try{
            const now=performance.now();
            const result=landmarker.detectForVideo(video,now);
            const pose=result.landmarks?.[0];
            const points=pose?positions(pose):null;
            if(points){
              poseSamples++;
              if(previous){
                const diff=points.reduce((sum,p,i)=>sum+Math.hypot(p.x-previous[i].x,p.y-previous[i].y),0)/points.length;
                if(diff>0.12){
                  movingSamples++;
                  movedMs+=Math.min(900,Math.max(0,now-lastTime));
                }
              }
              previous=points;
              lastTime=now;
              const secs=Math.round(movedMs/1000);
              status('Kamera aktif • '+(movingSamples>1?'Gerakan terdeteksi':'Mencari gerakan...')+' • ±'+secs+' dtk gerakan');
            }else{
              previous=null;lastTime=0;
              status('Kamera aktif • Tubuh belum terlihat jelas. Mundurkan HP sedikit.');
            }
          }catch(e){status('Deteksi terkendala. Anda masih dapat melanjutkan senam biasa.');}
        }else{previous=null;lastTime=0;}
        tick=setTimeout(sample,650);
      };
      sample();
      return true;
    }catch(err){
      stop();
      const reason=err?.name==='NotAllowedError'?'Izin kamera ditolak. Gunakan mode Senam Biasa.':
        err?.name==='NotFoundError'?'Kamera tidak ditemukan. Gunakan mode Senam Biasa.':
        'Deteksi gerakan tidak dapat dimulai. Coba Senam Biasa.';
      status(reason);
      return false;
    }
  }
  window.K3Motion={start,stop,summary};
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&stream){stop();status('Kamera berhenti karena aplikasi tidak terlihat. Aktifkan kembali jika diperlukan.');}
  });
  window.addEventListener('pagehide',stop);
})();
