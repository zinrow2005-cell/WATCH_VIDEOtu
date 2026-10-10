(()=>{'use strict';
const $=id=>document.getElementById(id);const elt=id=>$(id);const stage=$('ktvPlayerStage'), cameraBox=$('ktvCamFloat'), camera=$('ktvCamPreview');if(!stage||!camera)return;
let micMonitorCtx=null,micMonitorTimer=null,micMonitorSource=null;let canvasStream=null,recordOut=null;let reviewSong={title:'',artist:''};window.addEventListener('ktv-song-changed',e=>{if(!recording&&!starting)reviewSong={title:e.detail?.title||'',artist:e.detail?.artist||''}});let camStream=null,micStream=null,tabStream=null,recorder=null,canvas=null,raf=0,audioCtx=null,recorded=[],mime='',recordURL='',recordBlob=null,recording=false,starting=false,finishing=false,photo=null,lastFile='',ready=false,stopWatchdog=null;
const status=t=>{const e=$('simpleStatus');if(e)e.textContent=t};
const isMobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<1100);
const backgroundSelect=$('simpleBackground'), presetSelect=$('simplePreset');
const bgPrefsKey='simpleKtvBackgroundV3';
function storePrefs(){try{localStorage.setItem(bgPrefsKey,JSON.stringify({mode:backgroundSelect.value,preset:presetSelect.value}))}catch{}}
function updateBackgroundUI(){const mode=backgroundSelect.value;$('simplePresetWrap').hidden=mode!=='gradient';$('simplePhotoWrap').hidden=mode!=='photo';storePrefs()}
try{const v=JSON.parse(localStorage.getItem(bgPrefsKey)||'{}');if(v.preset&&[...presetSelect.options].some(x=>x.value===v.preset))presetSelect.value=v.preset;if(v.mode&&[...backgroundSelect.options].some(x=>x.value===v.mode))backgroundSelect.value=v.mode;else backgroundSelect.value=isMobile?'camera':'tab'}catch{backgroundSelect.value=isMobile?'camera':'tab'}
if(isMobile&&backgroundSelect.value==='tab')backgroundSelect.value='camera';
if(isMobile){backgroundSelect.querySelector('[value="tab"]').disabled=true;}
$('simpleDeviceTip').textContent=isMobile?'📱 手機／平板：先選鏡頭、預設舞台或相簿照片，再開始錄影。':'🖥 電腦：預設擷取目前 KTV 分頁。錄製時請勾選分享分頁音訊；目前頁面的鏡頭小視窗會一併錄入。';
backgroundSelect.addEventListener('change',updateBackgroundUI);presetSelect.addEventListener('change',storePrefs);updateBackgroundUI();
// Store selected background locally (IndexedDB); never upload to a server.
function photoStore(operation, blob){return new Promise((resolve,reject)=>{if(!('indexedDB'in window))return reject(Error('不支援本機照片儲存'));const request=indexedDB.open('ktvBackgroundPhotoV1',1);request.onupgradeneeded=()=>request.result.createObjectStore('photos');request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('photos',operation==='get'?'readonly':'readwrite'),os=tx.objectStore('photos');let req=operation==='put'?os.put(blob,'background'):operation==='delete'?os.delete('background'):os.get('background');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close()}})}
let photoURL='';
async function applyPhotoBlob(blob){if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(blob);const img=new Image();img.src=photoURL;await img.decode();photo=img;$('simplePhotoThumb').src=photoURL;$('simplePhotoThumb').hidden=false;$('simplePhotoState').textContent='✓ 已儲存背景照片';}
photoStore('get').then(async blob=>{if(blob)await applyPhotoBlob(blob);if(backgroundSelect.value==='photo'&&!photo)status('請選擇背景照片')}).catch(()=>{});
$('simplePhotoClear').onclick=async()=>{photo=null;if(photoURL)URL.revokeObjectURL(photoURL);photoURL='';$('simplePhotoThumb').hidden=true;$('simplePhotoState').textContent='尚未選擇背景照片';$('simplePhoto').value='';try{await photoStore('delete')}catch{}status('已清除背景照片')};

function buttonState(){ $('simpleCamera').textContent=camStream?'📷 關閉鏡頭':'📷 開啟鏡頭';$('simpleRecord').disabled=starting||recording||finishing;$('simpleStop').disabled=!recording||finishing;$('simpleRecord').textContent=finishing?'⏳ 正在完成…':starting?'⏳ 準備中…':recording?'🔴 錄製中':'🔴 開始錄影'; }
function stopTracks(stream){if(stream)stream.getTracks().forEach(t=>t.stop())}
let cameraOpening=false;
let ktvInactive=false;
let cleanupOnRecordEnd=false;
function releaseKtvDevices(){
 stopTracks(camStream);camStream=null;camera.pause();camera.srcObject=null;cameraBox.classList.add('hidden');cameraBox.style.display='none';
 stopMicMonitor();stopTracks(micStream);micStream=null;stopTracks(tabStream);tabStream=null;
 buttonState();
}
window.addEventListener('ktv-player-closed',()=>{if(!recording&&!starting&&!finishing)releaseKtvDevices()});
window.addEventListener('ktv-mode-entering',()=>{ktvInactive=false;cleanupOnRecordEnd=false});
window.addEventListener('ktv-mode-leaving',()=>{
 ktvInactive=true;cleanupOnRecordEnd=true;
 if(recording){stop();return;}
 if(starting||finishing)return;
 releaseKtvDevices();
});
async function openCamera(){
 if(cameraOpening)return false;
 cameraOpening=true;
 try{
  if(!navigator.mediaDevices?.getUserMedia)throw Error('此瀏覽器沒有提供攝影機權限，請使用 HTTPS 開啟並允許攝影機。');
  let current=camStream&&camStream.getVideoTracks().some(t=>t.readyState==='live');
  if(!current){
   stopTracks(camStream);camStream=null;
   const constraints=isMobile?{video:{facingMode:'user'},audio:false}:{video:{width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}},audio:false};
   status('正在取得攝影機權限…');
   try{camStream=await navigator.mediaDevices.getUserMedia(constraints)}
   catch(first){
     if(first.name==='OverconstrainedError'||first.name==='NotFoundError')camStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
     else throw first;
   }
  }
  if(ktvInactive){releaseKtvDevices();return false;}
  // Show the native video element before play(), and do not discard a live stream for an autoplay delay.
  cameraBox.classList.remove('hidden');cameraBox.style.setProperty('display','block','important');cameraBox.style.visibility='visible';cameraBox.style.opacity='1';
  // Camera may have been measured while the KTV panel was hidden (0px stage). Refit once visible.
  if(typeof refreshCameraOrientation==='function') refreshCameraOrientation();
  camera.setAttribute('playsinline','');camera.setAttribute('webkit-playsinline','');
  camera.playsInline=true;camera.autoplay=true;camera.muted=true;camera.defaultMuted=true;
  camera.style.display='block';camera.style.visibility='visible';camera.style.opacity='1';
  if(camera.srcObject!==camStream)camera.srcObject=camStream;
  // Avoid video.load(): on Safari it can detach a live srcObject and blank the preview.
  const tryPlay=async()=>{try{await camera.play();return true}catch(e){return false}};
  let played=await tryPlay();
  if(!played){await new Promise(resolve=>setTimeout(resolve,150));played=await tryPlay()}
  if(camera.readyState<2){await Promise.race([new Promise(resolve=>{camera.addEventListener('loadeddata',resolve,{once:true});camera.addEventListener('loadedmetadata',resolve,{once:true})}),new Promise(resolve=>setTimeout(resolve,1200))]);}
  if(!played&&!camera.videoWidth)status('已取得鏡頭，但影片尚未開始顯示。請再點一下鏡頭畫面以啟動播放。');
  else status('📷 鏡頭已開啟'+(camera.videoWidth?'（'+camera.videoWidth+'×'+camera.videoHeight+'）':''));
  buttonState();return true;
 }catch(e){
  status('鏡頭無法開啟：'+(e?.name||'')+' '+(e?.message||e));
  if(!camStream?.getVideoTracks().some(t=>t.readyState==='live')){stopTracks(camStream);camStream=null;camera.srcObject=null;cameraBox.classList.add('hidden');cameraBox.style.removeProperty('display')}
  buttonState();throw e;
 }finally{cameraOpening=false}
}function closeCamera(){if(recording)return;stopTracks(camStream);camStream=null;camera.srcObject=null;cameraBox.classList.add('hidden');cameraBox.style.display='none';status('已關閉鏡頭');buttonState()}
let lastCameraTap=0;
$('simpleCamera').addEventListener('click',async e=>{e.stopPropagation();lastCameraTap=Date.now();if(starting||recording||finishing)return;try{if(camStream)closeCamera();else await openCamera()}catch(e){status('無法開啟鏡頭：'+e.message);buttonState()}});
const opts=$('simpleOptions');$('simpleOptionsBtn').onclick=()=>{opts.hidden=!opts.hidden};$('simpleOptionsClose').onclick=()=>{opts.hidden=true};
// Microphone live input meter and safe cleanup (not connected to speakers).
function stopMicMonitor(){if(micMonitorTimer){clearInterval(micMonitorTimer);micMonitorTimer=null;}if(micMonitorCtx){const ctx=micMonitorCtx;micMonitorCtx=null;ctx.close().catch(()=>{});}const meter=$('simpleMicMeter');if(meter)meter.value=0;}
async function monitorMic(){stopMicMonitor();const meter=$('simpleMicMeter');if(!meter||!micStream)return;try{const ctx=new (window.AudioContext||window.webkitAudioContext)();micMonitorCtx=ctx;await ctx.resume();const source=ctx.createMediaStreamSource(micStream),analyser=ctx.createAnalyser();analyser.fftSize=1024;source.connect(analyser);const data=new Uint8Array(analyser.fftSize);micMonitorTimer=setInterval(()=>{if(!micStream)return;analyser.getByteTimeDomainData(data);let sum=0;for(const sample of data){const n=(sample-128)/128;sum+=n*n;}const rms=Math.sqrt(sum/data.length);meter.value=Math.min(100,Math.round(rms*450));const text=$('simpleMicSignal');if(text)text.textContent=rms<.006?'收音很小／請靠近麥克風':rms<.025?'麥克風有收音':'麥克風收音正常';},140);}catch(e){if($('simpleMicSignal'))$('simpleMicSignal').textContent='無法顯示收音音量（不影響錄製）';}}
$('simplePhoto').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{if(!f.type.startsWith('image/'))throw Error('檔案不是圖片');await applyPhotoBlob(f);backgroundSelect.value='photo';updateBackgroundUI();try{await photoStore('put',f)}catch{status('已載入照片，但瀏覽器無法永久保存。請勿清除網頁資料。');return}status('背景照片已保存，下次開啟可繼續使用');}catch(e){status('無法載入圖片：'+e.message)}};
function drawContain(ctx,img,w,h){const iw=img.videoWidth||img.naturalWidth||w,ih=img.videoHeight||img.naturalHeight||h;if(!iw||!ih)return;const z=Math.min(w/iw,h/ih);ctx.drawImage(img,(w-iw*z)/2,(h-ih*z)/2,iw*z,ih*z)}
function drawCover(ctx,img,w,h){const iw=img.videoWidth||img.naturalWidth||w,ih=img.videoHeight||img.naturalHeight||h;if(!iw||!ih)return;const z=Math.max(w/iw,h/ih);ctx.drawImage(img,(w-iw*z)/2,(h-ih*z)/2,iw*z,ih*z)}
function paint(){if(!recording||!canvas)return;const ctx=canvas.getContext('2d',{alpha:false}),w=canvas.width,h=canvas.height;ctx.fillStyle='#060914';ctx.fillRect(0,0,w,h);const mode=$('simpleBackground').value;
if(mode==='tab'&&tabStream){const tv=$('simpleTabVideo');if(tv?.readyState>=2)drawContain(ctx,tv,w,h)}
else if(mode==='photo'&&photo)drawCover(ctx,photo,w,h);
else if(mode==='camera'&&camera.readyState>=2)drawCover(ctx,camera,w,h);
else{const colors={night:['#102b62','#39235b','#080f31'],purple:['#48166d','#b74da8','#151049'],gold:['#6b3214','#cd9b4a','#25152a'],green:['#082b32','#327a59','#091f30']}[presetSelect.value]||['#102b62','#39235b','#080f31'];const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,colors[0]);g.addColorStop(.5,colors[1]);g.addColorStop(1,colors[2]);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
if(camStream&&camera.readyState>=2&&mode!=='camera'&&mode!=='tab'){
 const box=stage.getBoundingClientRect(),p=cameraBox.getBoundingClientRect();const sx=box.width?w/box.width:1,sy=box.height?h/box.height:1;
 // Stage-relative position; never crop camera when making output
 const x=Math.max(0,(p.left-box.left)*sx),y=Math.max(0,(p.top-box.top)*sy),cw=Math.min(w-x,p.width*sx),ch=Math.min(h-y,p.height*sy);
 if(cw>0&&ch>0){ctx.save();ctx.beginPath();ctx.roundRect(x,y,cw,ch,12);ctx.clip();drawImageIn(ctx,camera,x,y,cw,ch);ctx.restore()}
 }
 if(mode==='tab'&&tabStream){ /* tab already contains the on-screen camera, preventing duplicate overlay */ }
 raf=requestAnimationFrame(paint)
}
function drawImageIn(ctx,v,x,y,w,h){const iw=v.videoWidth||w,ih=v.videoHeight||h,z=Math.min(w/iw,h/ih);ctx.drawImage(v,x+(w-iw*z)/2,y+(h-ih*z)/2,iw*z,ih*z)}
async function start(){if(starting||recording||finishing||Date.now()-lastCameraTap<900)return;reviewSong={title:$('ktvPlayerTitle')?.textContent||'',artist:$('ktvPlayerArtist')?.textContent||''};starting=true;buttonState();try{
 const audioOnly=$('simpleRecordingType').value==='audio';const mode=audioOnly?'gradient':$('simpleBackground').value;
   if(isMobile){setImmersive(true);opts.hidden=true;}if(mode==='photo'&&!photo)throw Error('請先選擇背景照片，或改用預設背景');
 if($('simpleRecordingType').value!=='audio'&&!camStream)await openCamera();
 micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:true,channelCount:{ideal:1}},video:false});
 if(!micStream.getAudioTracks().some(t=>t.readyState==='live'&&t.enabled))throw Error('麥克風沒有可用的音軌，請檢查網站麥克風權限');
 await monitorMic();
 if(mode==='tab'){
 if(isMobile)throw Error('手機／平板不能直接擷取 KTV 分頁。請選自拍鏡頭、預設舞台或相簿照片');
 if(!navigator.mediaDevices.getDisplayMedia)throw Error('這個瀏覽器無法分享 KTV 分頁；請選擇預設背景或自選照片');
 status('瀏覽器將要求擷取 KTV 畫面：請選「目前 KTV 分頁」並開啟「分享分頁音訊」。這不會上傳到 GitHub。');// Ask Chrome to keep playing local KTV audio while allowing tab-audio capture.
 let displayConstraints={video:true,audio:{suppressLocalAudioPlayback:false,echoCancellation:false,noiseSuppression:false,autoGainControl:false}};
 try{tabStream=await navigator.mediaDevices.getDisplayMedia(displayConstraints)}
 catch(error){if(error?.name==='TypeError'||error?.name==='OverconstrainedError')tabStream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});else throw error;}
 const v=document.createElement('video');v.id='simpleTabVideo';v.muted=true;v.playsInline=true;v.srcObject=tabStream;v.style.display='none';document.body.appendChild(v);await v.play();tabStream.getVideoTracks()[0].addEventListener('ended',()=>{if(recording)stop()}, {once:true});
 }
 const useTab=mode==='tab'&&!!tabStream;
 // Desktop screen capture already contains the KTV video and visible webcam.
 // Record its ORIGINAL video track, not a 20 fps canvas redraw of that track.
 // This avoids a second compositor/canvas pass that can make the webcam flicker.
 canvas=null;
 if(!audioOnly&&!useTab&&mode!=='camera'){canvas=document.createElement('canvas');const mobilePortrait=isMobile&&window.innerHeight>window.innerWidth;canvas.width=mobilePortrait?720:960;canvas.height=mobilePortrait?1280:540;}
 // On phones, direct camera recording avoids the iOS Safari canvas.captureStream black/empty file issue.
 const directCamera=!audioOnly&&mode==='camera'&&!!camStream;
 canvasStream=canvas?canvas.captureStream(30):null;
 const captureVideoTrack=!audioOnly&&useTab?tabStream.getVideoTracks()[0]:directCamera?camStream.getVideoTracks()[0]:null;
 const out=new MediaStream(captureVideoTrack?[captureVideoTrack]:canvasStream?canvasStream.getVideoTracks():[]);
 recordOut=out;
 // iOS Safari: record native mic tracks without AudioContext mixing for reliable MP4 output.
 if(isMobile){
   // Default direct native microphone track on iOS: avoids audio-context silence.
   // Optional boost uses WebAudio only when the user explicitly enables it.
   const boost=$('simpleMicBoost')?.checked;
   if(boost&&window.AudioContext){try{
      audioCtx=new (window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();
      if(audioCtx.state!=='running')throw Error('音訊處理未啟動');
      const source=audioCtx.createMediaStreamSource(micStream),gain=audioCtx.createGain(),dest=audioCtx.createMediaStreamDestination();
      gain.gain.value=Math.max(1,Math.min(2.5,Number($('simpleMicVolume').value)/100));source.connect(gain).connect(dest);
      const track=dest.stream.getAudioTracks()[0];if(!track||track.readyState!=='live')throw Error('增強音軌無法使用');
      out.addTrack(track);status('🎤 麥克風增強已啟用，請先試錄 10 秒確認聲音');
   }catch(e){if(audioCtx){audioCtx.close().catch(()=>{});audioCtx=null;}micStream.getAudioTracks().forEach(t=>out.addTrack(t));status('🎤 增強模式不支援，已使用原始麥克風：'+e.message)}
   }else{micStream.getAudioTracks().forEach(t=>out.addTrack(t));}
 }
 else {audioCtx=new (window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();const dest=audioCtx.createMediaStreamDestination();
 const micSource=audioCtx.createMediaStreamSource(micStream),gain=audioCtx.createGain();gain.gain.value=Number($('simpleMicVolume').value)/100;micSource.connect(gain).connect(dest);
 if(tabStream?.getAudioTracks().length){audioCtx.createMediaStreamSource(tabStream).connect(dest)}
 dest.stream.getAudioTracks().forEach(t=>out.addTrack(t));}
 if(!out.getAudioTracks().length||out.getAudioTracks().every(t=>t.readyState!=='live'))throw Error('錄影沒有取得麥克風音軌，已取消錄製');
 const types=audioOnly?['audio/mp4','audio/mp4;codecs=mp4a.40.2','audio/webm;codecs=opus','audio/webm']:['video/mp4;codecs="avc1.42E01E,mp4a.40.2"','video/mp4','video/webm;codecs=vp8,opus','video/webm'];mime=types.find(t=>{try{return MediaRecorder.isTypeSupported(t)&&(!isMobile||!!document.createElement('video').canPlayType(t))}catch{return false}})||types.find(t=>{try{return MediaRecorder.isTypeSupported(t)}catch{return false}})||'';
 try{recorder=new MediaRecorder(out,mime?{mimeType:mime,videoBitsPerSecond:1800000,audioBitsPerSecond:128000}:undefined)}
 catch(e){recorder=new MediaRecorder(out);mime=recorder.mimeType||'';}recorded=[];
 recorder.ondataavailable=e=>{if(e.data?.size)recorded.push(e.data)};
 let completed=false;
 async function completeRecording(){if(completed)return;completed=true;clearTimeout(stopWatchdog);stopWatchdog=null;document.documentElement.classList.remove('ktv-direct-capture');cancelAnimationFrame(raf);stopTracks(canvasStream);canvasStream=null;stopTracks(tabStream);tabStream=null;stopMicMonitor();stopTracks(micStream);micStream=null;stopTracks(recordOut);recordOut=null;document.getElementById('simpleTabVideo')?.remove();if(audioCtx){const closing=audioCtx;audioCtx=null;closing.close().catch(()=>{})}
 const t=recorder?.mimeType||mime||(audioOnly?'audio/webm':'video/webm');recordBlob=new Blob(recorded,{type:t});savedCurrentBlob=null;recording=false;starting=false;finishing=false;
 // Release the camera after a mobile recording to clear iOS camera-in-use indicator.
 if(isMobile){stopTracks(camStream);camStream=null;camera.pause();camera.srcObject=null;cameraBox.classList.add('hidden');cameraBox.style.display='none';}
 if(cleanupOnRecordEnd||ktvInactive){releaseKtvDevices();cleanupOnRecordEnd=false;}
 buttonState();if(isMobile)setImmersive(false);
 if(!recordBlob.size){
   $('simplePlayback').hidden=true;
   $('simpleReview').hidden=false;if(isMobile)$('simpleLyricsOpen').hidden=false;
   $('simpleReviewHint').textContent='這次錄影沒有產生檔案。已停止鏡頭與麥克風；可點「查看歌詞」或重唱。建議在錄製選項使用「自拍鏡頭」並以 Safari 開啟。';
   status('已停止錄影；但瀏覽器沒有產生可播放影片。可查看歌詞或重試。');
   window.dispatchEvent(new CustomEvent('ktv-recording-review-open',{detail:{title:reviewSong.title,artist:reviewSong.artist}}));
   return;
 }
 if(recordURL)URL.revokeObjectURL(recordURL);recordURL=URL.createObjectURL(recordBlob);
 const playback=$('simplePlayback');playback.hidden=false;playback.pause();playback.removeAttribute('src');playback.load();playback.src=recordURL;playback.muted=false;playback.controls=true;playback.playsInline=true;playback.load();
 $('simpleReview').hidden=false;if(isMobile)$('simpleLyricsOpen').hidden=false;status('✅ 已停止錄影，可預覽及儲存');$('simpleReviewHint').textContent='影片已完成，請播放確認人聲。若沒有聲音，請先試用錄製選項內的「麥克風增強」並確認收音指示。';
 window.dispatchEvent(new CustomEvent('ktv-recording-review-open',{detail:{title:reviewSong.title,artist:reviewSong.artist}}));
 }
 recorder.onstop=completeRecording;
 recorder.onerror=e=>{status('錄影發生錯誤：'+(e.error?.message||'未知錯誤'));if(finishing)completeRecording()};
 if(ktvInactive){recording=true;starting=false;cleanupOnRecordEnd=true;stop();return;}
 recording=true;starting=false;if(useTab)document.documentElement.classList.add('ktv-direct-capture');buttonState();recorder.start(isMobile?1000:1000);if(canvas)paint();status(useTab?'🔴 正直接錄製 KTV 分頁與鏡頭，無二次合成；點「停止」可預覽':'🔴 正在錄影；點「停止」可結束並預覽');
 }catch(e){if(isMobile)setImmersive(false);document.documentElement.classList.remove('ktv-direct-capture');recording=false;starting=false;stopTracks(tabStream);tabStream=null;document.getElementById('simpleTabVideo')?.remove();stopMicMonitor();stopTracks(micStream);micStream=null;if(audioCtx){audioCtx.close().catch(()=>{});audioCtx=null}if(isMobile){stopTracks(camStream);camStream=null;camera.pause();camera.srcObject=null;cameraBox.classList.add('hidden');cameraBox.style.display='none'}if(ktvInactive)releaseKtvDevices();status('無法開始錄影：'+e.message);buttonState()}}
function pauseSong(){try{const f=$('ktvPlayerFrame');if(f?.contentWindow)f.contentWindow.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}), '*')}catch{}}
function stop(){if(!recording||finishing)return;pauseSong();finishing=true;recording=false;buttonState();status('正在完成影片，請稍候…');cancelAnimationFrame(raf);
 try{if(recorder?.state==='recording'){if(!isMobile){try{recorder.requestData()}catch{}}recorder.stop()}else if(recorder?.state==='inactive'){recorder.onstop?.()}else throw Error('錄影器狀態異常')}catch(e){status('正在嘗試完成錄影：'+e.message);recorder?.onstop?.()}
 stopWatchdog=setTimeout(()=>{if(finishing){status('影片封裝超時，嘗試顯示已錄內容');recorder?.onstop?.()}},4500);
 }
$('simpleRecord').onclick=e=>{e.stopPropagation();if(e.currentTarget!==$('simpleRecord'))return;start()};$('simpleStop').onclick=stop;
const review=$('simpleReview');$('simplePlayback').addEventListener('error',()=>{if(recordBlob?.size)$('simpleReviewHint').textContent='此瀏覽器無法播放目前的錄影格式，影片仍可使用下方儲存按鈕下載。';});function reviewClose(){review.hidden=true;$('simplePlayback').pause();$('simpleLyricsPanel').hidden=true};$('simpleReviewClose').onclick=reviewClose;$('simpleRetry').onclick=()=>{reviewClose();start()};
function outputName(){const type=recordBlob?.type||'';const ext=type.includes('mp4')?'mp4':type.includes('ogg')?'ogg':type.startsWith('audio/')?'webm':'webm';return '我的KTV作品_'+new Date().toISOString().replace(/[:.]/g,'-')+'.'+ext}
// Confirmed saved works are kept as real Blob records, not filename-only logs.
function worksStore(mode, entry){return new Promise((resolve,reject)=>{if(!window.indexedDB)return reject(Error('瀏覽器無法保存作品'));const req=indexedDB.open('simpleKtvWorksV1',1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('works'))db.createObjectStore('works',{keyPath:'id'})};req.onerror=()=>reject(req.error||Error('無法開啟作品資料庫'));req.onsuccess=()=>{const db=req.result;const tx=db.transaction('works',mode==='list'?'readonly':'readwrite'),store=tx.objectStore('works');const r=mode==='put'?store.put(entry):mode==='delete'?store.delete(entry):store.getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('作品讀取失敗'));tx.oncomplete=()=>db.close();tx.onerror=()=>{db.close();reject(tx.error||Error('作品儲存失敗'))}}})}
let savedCurrentBlob=null;
async function saveLog(name){if(!recordBlob?.size)return false;if(savedCurrentBlob===recordBlob)return true;const entry={id:Date.now()+'-'+Math.random().toString(36).slice(2,8),name,time:Date.now(),size:recordBlob.size,type:recordBlob.type,blob:recordBlob,title:reviewSong.title||'',artist:reviewSong.artist||''};try{await worksStore('put',entry);savedCurrentBlob=recordBlob;lastFile=name;status('✅ 已儲存，並加入「我的作品」');return true}catch(e){status('影片已送出儲存，但無法加入我的作品：'+e.message);return false}}

async function downloadRecording(){if(!recordBlob)return;const name=outputName();const a=document.createElement('a');a.href=recordURL;a.download=name;document.body.appendChild(a);a.click();a.remove();await saveLog(name);$('simpleReviewHint').textContent='已送至瀏覽器下載。請在下載項目查看；手機／平板可再從檔案 App 移到相簿。';status('已送至瀏覽器下載：'+name)}
async function saveToDevice(){if(!recordBlob)return;const name=outputName();if(!isMobile&&typeof window.showSaveFilePicker==='function'){
 try{const ext='.'+name.split('.').pop(),handle=await window.showSaveFilePicker({suggestedName:name,types:[{description:'KTV 錄製作品',accept:{[recordBlob.type||'application/octet-stream']:[ext]}}]});const writer=await handle.createWritable();await writer.write(recordBlob);await writer.close();await saveLog(handle.name||name);$('simpleReviewHint').textContent='✓ 已儲存到你選擇的位置：'+(handle.name||name);status('作品已儲存到指定位置');return}catch(e){if(e?.name==='AbortError'){status('已取消儲存');return}status('無法使用檔案選擇器，改用下載：'+(e.message||e))}
 }
 downloadRecording();}
async function saveToPhotos(){if(!recordBlob?.size){status('沒有可儲存的影片，請重新錄製');return;}const name=outputName();const file=new File([recordBlob],name,{type:recordBlob.type||'application/octet-stream'});
 if(navigator.canShare?.({files:[file]})&&typeof navigator.share==='function'){
 try{await navigator.share({files:[file],title:'儲存 KTV 作品'});await saveLog(name);$('simpleReviewHint').textContent='已開啟系統分享功能。iPhone／iPad 請選「儲存影片」（如有提供）；其他裝置請選擇相簿或檔案 App。';status('已開啟系統分享選單');return}catch(e){if(e?.name==='AbortError'){status('已取消儲存');return}status('無法使用系統分享：'+(e.message||e))}
 }
 downloadRecording();$('simpleReviewHint').textContent='這個瀏覽器不支援直接分享錄影檔。已下載檔案，請到下載項目或檔案 App 將影片存入相簿。';}
$('simpleSave').onclick=isMobile?saveToPhotos:saveToDevice;
$('simpleShare').onclick=saveToPhotos;
$('simpleSave').textContent=isMobile?'📱 儲存至相簿':'💾 選擇資料夾儲存';
$('simpleShare').textContent='📱 儲存至相簿／檔案';
$('simpleShare').hidden=true;
$('simpleReviewHint').textContent=isMobile?'錄製完成後可選「儲存至相簿／檔案」，若系統不支援請先下載。':'錄製完成後可選擇要儲存的檔名與資料夾；不支援時改用瀏覽器下載。';
const library=$('simpleLibrary');let libraryPlaybackURL='';
function clearLibraryPlayback(){const v=$('simpleLibraryPlayer');if(v){v.pause();v.removeAttribute('src');v.load();v.hidden=true}if(libraryPlaybackURL){URL.revokeObjectURL(libraryPlaybackURL);libraryPlaybackURL=''}}
async function renderLibrary(){const div=$('simpleLibraryList');div.replaceChildren();const intro=document.createElement('p');intro.textContent='這裡可直接播放已加入本機作品庫的錄影。影片只存在此瀏覽器；清除網站資料也會清除作品。';div.appendChild(intro);let items=[];try{items=await worksStore('list')}catch(e){div.append('無法讀取作品：'+e.message);return}items.sort((a,b)=>b.time-a.time);if(!items.length){div.append('目前沒有已儲存的作品。');return}items.forEach(it=>{const el=document.createElement('div');el.className='simple-work-item';const name=document.createElement('strong');name.textContent=it.title?it.title+' — '+it.name:it.name;const meta=document.createElement('small');meta.textContent=new Date(it.time).toLocaleString()+' · '+(it.size/1048576).toFixed(1)+' MB';const controls=document.createElement('div');controls.className='simple-work-actions';const play=document.createElement('button');play.type='button';play.textContent='▶ 播放';play.onclick=()=>{clearLibraryPlayback();libraryPlaybackURL=URL.createObjectURL(it.blob);const video=$('simpleLibraryPlayer');video.hidden=false;video.src=libraryPlaybackURL;video.load();video.play().catch(()=>{});video.scrollIntoView({block:'nearest',behavior:'smooth'});};const save=document.createElement('button');save.type='button';save.textContent='⬇ 下載';save.onclick=()=>{const url=URL.createObjectURL(it.blob),a=document.createElement('a');a.href=url;a.download=it.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)};const remove=document.createElement('button');remove.type='button';remove.textContent='刪除';remove.onclick=async()=>{if(!confirm('確定要從這台裝置的作品庫刪除？'))return;await worksStore('delete',it.id);clearLibraryPlayback();renderLibrary()};controls.append(play,save,remove);el.append(name,meta,controls);div.appendChild(el)})}
$('simpleLibraryBtn').onclick=async()=>{review.hidden=true;library.hidden=false;await renderLibrary()};
function closeLibrary(){clearLibraryPlayback();library.hidden=true;review.hidden=true;$('simpleLyricsPanel').hidden=true;if(isMobile)setImmersive(false);$('ktvPlayerPanel').scrollIntoView({block:'start',behavior:'instant'})}
$('simpleLibraryClose').onclick=closeLibrary;
// For no-crop control, keep the actual camera inside the stage and allow pointer drag.
let drag=null;cameraBox.style.touchAction='none';cameraBox.addEventListener('pointerdown',e=>{if(e.target.closest('#simpleCamSizeHandle'))return;if(!camStream)return;const a=stage.getBoundingClientRect(),b=cameraBox.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,l:b.left-a.left,t:b.top-a.top};cameraBox.setPointerCapture(e.pointerId)});cameraBox.addEventListener('pointermove',e=>{if(!drag)return;const a=stage.getBoundingClientRect(),w=cameraBox.offsetWidth,h=cameraBox.offsetHeight;cameraBox.style.left=Math.max(0,Math.min(a.width-w,drag.l+e.clientX-drag.x))+'px';cameraBox.style.top=Math.max(0,Math.min(a.height-h,drag.t+e.clientY-drag.y))+'px';cameraBox.style.right='auto'});cameraBox.addEventListener('pointerup',()=>drag=null);cameraBox.addEventListener('pointercancel',()=>drag=null);
const sizeHandle=document.createElement('button');sizeHandle.id='simpleCamSizeHandle';sizeHandle.type='button';sizeHandle.textContent='⤡';sizeHandle.setAttribute('aria-label','拖曳調整鏡頭大小');sizeHandle.title='拖曳調整鏡頭大小';cameraBox.appendChild(sizeHandle);
// Preview-only mirror switch: never restart the camera or change the original recording track.
const mirrorKey='simpleKtvCameraMirrorV1';
const mirrorButton=document.createElement('button');mirrorButton.type='button';mirrorButton.id='simpleCamMirror';
mirrorButton.setAttribute('aria-label','切換自拍鏡頭左右鏡像');mirrorButton.title='切換鏡頭左右方向';
let mirrorEnabled=false;
try{mirrorEnabled=localStorage.getItem(mirrorKey)==='true'}catch{}
function applyMirror(){
 camera.classList.toggle('simple-mirror-preview',mirrorEnabled);
 mirrorButton.textContent='⇄';mirrorButton.title=mirrorEnabled?'關閉左右鏡像':'開啟左右鏡像';mirrorButton.setAttribute('aria-label',mirrorButton.title);
 mirrorButton.setAttribute('aria-pressed',String(mirrorEnabled));
}
['pointerdown','pointermove','pointerup','pointercancel'].forEach(type=>mirrorButton.addEventListener(type,e=>e.stopPropagation()));
mirrorButton.addEventListener('click',e=>{e.stopPropagation();mirrorEnabled=!mirrorEnabled;applyMirror();try{localStorage.setItem(mirrorKey,String(mirrorEnabled))}catch{}status(mirrorEnabled?'已開啟自拍預覽左右鏡像':'已關閉自拍預覽左右鏡像')});
cameraBox.appendChild(mirrorButton);applyMirror();
camera.addEventListener('click',()=>{if(camStream&&camera.paused)camera.play().catch(()=>status('請允許瀏覽器播放鏡頭影像'))});
const cameraSize=$('simpleCameraSize');
// Separate computer size from the earlier mobile-shared preference.
const camPrefsKey=isMobile?'simpleKtvCamSizeV1':'simpleKtvDesktopCamSizeV2';
function cameraIsLandscape(){return window.matchMedia('(orientation: landscape)').matches && isMobile;}
function cameraAspect(){return isMobile?(cameraIsLandscape()?16/9:9/16):16/9;}
function setCameraWidth(pct,save=true){
 const wanted=Math.max(16,Math.min(58,Number(pct)|| (isMobile?28:40)));
 const bounds=stage.getBoundingClientRect();
 // A hidden stage has no usable dimensions; never replace the default with a 55px box.
 if(bounds.width<120 || bounds.height<60){if(cameraSize)cameraSize.value=Math.round(wanted);return;}
 const aspect=cameraAspect();
 // Landscape phone viewports can be very short. Fit the entire camera and its resize control.
 const maxWidthByHeight=bounds.height>0?(bounds.height*0.78*aspect):Infinity;
 const stageWidth=Math.max(1,bounds.width);
 const targetWidth=Math.max(55,Math.min(stageWidth*wanted/100,maxWidthByHeight,stageWidth*0.90));
 cameraBox.style.width=targetWidth+'px';cameraBox.style.minWidth='0';cameraBox.style.maxWidth='none';cameraBox.style.maxHeight='none';cameraBox.style.aspectRatio=aspect.toString();
 if(cameraSize)cameraSize.value=Math.round(wanted);
 if(save)try{localStorage.setItem(camPrefsKey,String(wanted))}catch{}
 if(camStream){
  const rect=cameraBox.getBoundingClientRect();
  // CSS right/top offsets may survive a rotation; normalize to stage-local coordinates.
  const left=Math.max(0,Math.min(Math.max(0,bounds.width-rect.width),rect.left-bounds.left));
  const top=Math.max(0,Math.min(Math.max(0,bounds.height-rect.height),rect.top-bounds.top));
  cameraBox.style.left=left+'px';cameraBox.style.top=top+'px';cameraBox.style.right='auto';
 }
}
if(cameraSize)cameraSize.addEventListener('input',()=>setCameraWidth(cameraSize.value));
let initialCameraWidth=isMobile?28:40;
try{initialCameraWidth=localStorage.getItem(camPrefsKey)||initialCameraWidth}catch{}
setCameraWidth(initialCameraWidth,false);
let resizeOrigin=null;
sizeHandle.addEventListener('pointerdown',e=>{
 e.preventDefault();e.stopPropagation();
 const r=cameraBox.getBoundingClientRect();
 resizeOrigin={x:e.clientX,y:e.clientY,width:r.width,height:r.height,pointer:e.pointerId};
 sizeHandle.setPointerCapture(e.pointerId);
});
sizeHandle.addEventListener('pointermove',e=>{
 if(!resizeOrigin||resizeOrigin.pointer!==e.pointerId)return;
 e.preventDefault();e.stopPropagation();
 const deltaX=e.clientX-resizeOrigin.x,deltaY=e.clientY-resizeOrigin.y;
 const aspect=cameraAspect();
 // Support diagonal/vertical finger movement when the phone is landscape.
 const delta=Math.abs(deltaX)>=Math.abs(deltaY)?deltaX:deltaY*aspect;
 const wanted=(resizeOrigin.width+delta)/Math.max(1,stage.getBoundingClientRect().width)*100;
 setCameraWidth(wanted);
});
['pointerup','pointercancel','lostpointercapture'].forEach(evt=>sizeHandle.addEventListener(evt,()=>resizeOrigin=null));
function refreshCameraOrientation(){
 const value=cameraSize?.value||initialCameraWidth;
 requestAnimationFrame(()=>setCameraWidth(value,false));
}
window.addEventListener('orientationchange',()=>setTimeout(refreshCameraOrientation,200));
window.addEventListener('resize',refreshCameraOrientation);
// ResizeObserver fires when the KTV stage becomes visible after initial page loading.
if(typeof ResizeObserver!=='undefined'){
 const stageSizeObserver=new ResizeObserver(entries=>{const r=entries[0]?.contentRect;if(r&&r.width>120&&r.height>60)refreshCameraOrientation();});
 stageSizeObserver.observe(stage);
}
// Returning to KTV after browsing channels can also reattach a previously hidden stage.
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshCameraOrientation()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){opts.hidden=true;reviewClose();closeLibrary()}});

const fs=$('ktvFullscreenBtn');function setImmersive(active){const panel=$('ktvPlayerPanel');if(!panel)return;panel.classList.toggle('simple-fullview',!!active);document.documentElement.classList.toggle('ktv-recording-immersive',!!active);if(fs)fs.textContent=active?'✕ 退出全螢幕':'⛶ 全螢幕';if(active)panel.scrollTop=0;}
 if(fs)fs.onclick=()=>setImmersive(!$('ktvPlayerPanel').classList.contains('simple-fullview'));

buttonState();ready=true;
})();
