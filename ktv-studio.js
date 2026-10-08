/* V1.5.7.02: combined mobile AV permission, lean audio path, explicit background status. */
(function(){'use strict';
const $=id=>document.getElementById(id); const el=$('ktvStudio');if(!el)return;
const canvas=$('studioCanvas'),ctx=canvas.getContext('2d');const stage=$('ktvPlayerStage'),float=$('ktvCamFloat'),preview=$('ktvCamPreview');canvas.width=1280;canvas.height=720;const mobileCapture=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const video=document.createElement('video'),cam=preview; video.muted=true;video.playsInline=true;video.loop=true;cam.muted=true;cam.playsInline=true;cam.autoplay=true;cam.setAttribute('playsinline','');
let camStream=null,micStream=null,screenStream=null,recorder=null,chunks=[],blob=null,blobURL=null,recording=false,raf=0,audioCtx=null,audioDestination=null,sourceNodes=[],musicGain=null,micGain=null,voiceFilter=null,echoDelay=null,echoGain=null, startTime=0,overlay={x:.71,y:.57,w:.26},drag=false,library=null,saved=false;
let bgImg=null,bgVideoUrl=null,title='我的 KTV 作品';
// V1.5.6.91: visibly report recording duration, active audio sources and output format.
let ktvRecordTimer=null;
let lastDrawTime=0;
function setKtvRecordState(active, message){
 const host=$('ktvRecordLiveStatus'), label=$('ktvRecordLiveText'),clock=$('ktvRecordLiveClock');
 if(!host)return;
 host.classList.toggle('is-recording',active);
 if(message)label.textContent=message;
 if(ktvRecordTimer){clearInterval(ktvRecordTimer);ktvRecordTimer=null;}
 if(active){const tick=()=>{const sec=Math.max(0,Math.floor((Date.now()-startTime)/1000));clock.textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')};tick();ktvRecordTimer=setInterval(tick,500)}
}
function setRecordSummary(b){
 const summary=$('ktvRecordedSummary');if(!summary)return;
 const tracks=Number(b?.size||0)/1048576;
 const seconds=Math.round((Date.now()-startTime)/1000);
 summary.textContent='錄製長度：約 '+Math.max(0,seconds)+' 秒｜格式：'+extension(b).toUpperCase()+'｜檔案：'+tracks.toFixed(1)+' MB。請播放確認聲音與畫面。';
}

const maskCanvas=document.createElement('canvas'),maskCtx=maskCanvas.getContext('2d',{willReadFrequently:true});let segmenter=null,segmentBusy=false,segmentReady=false,segmentTimer=null,cutoutFrame=null,cutoutCanvas=document.createElement('canvas'),cutoutCtx=cutoutCanvas.getContext('2d');cutoutCanvas.width=640;cutoutCanvas.height=360;const liveCutout=document.createElement('canvas');liveCutout.id='ktvLiveCutout';liveCutout.width=640;liveCutout.height=360;float.appendChild(liveCutout);const liveCtx=liveCutout.getContext('2d');let cutoutFailures=0;
function updateMirror(){float.classList.toggle('ktv-no-mirror',!$('ktvMirrorCamera').checked)}
function updateCutoutUI(){float.classList.toggle('ktv-cutout-on',!!($('ktvRemoveBackground').checked&&cutoutFrame));float.setAttribute('data-cutout-status',$('ktvRemoveBackground').checked?(cutoutFrame?'ready':'loading'):'off');}
function pauseKtvOnStop(){
 // This is the KTV-specific YouTube iframe, not the general video player.
 try{if(typeof pauseActiveKtvSong==='function')pauseActiveKtvSong();else{
 const f=$('ktvPlayerFrame');if(f?.contentWindow)f.contentWindow.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}), 'https://www.youtube.com');
 }}catch(e){console.warn('KTV pause failed',e)}
 try{if($('studioBackground').value==='video')video.pause()}catch(e){}
}
function syncCameraRatio(){
 const w=cam.videoWidth||0,h=cam.videoHeight||0;
 if(w&&h){float.style.aspectRatio=w+' / '+h;float.style.height='auto';float.dataset.cameraRatio=(w/h).toFixed(4);}
}
cam.addEventListener('loadedmetadata',syncCameraRatio);
window.addEventListener('orientationchange',()=>setTimeout(syncCameraRatio,200));
$('ktvMirrorCamera').addEventListener('change',updateMirror);updateMirror();
function drawCamera(x,y,w,h,cutout){
 const source=cutout&&cutoutFrame?cutoutCanvas:cam;
 if(!source || (!cutoutFrame&&cam.readyState<2))return;
 ctx.save();const sw=source.videoWidth||source.width||640,sh=source.videoHeight||source.height||480;const scale=Math.min(w/sw,h/sh),dw=sw*scale,dh=sh*scale,dx=x+(w-dw)/2,dy=y+(h-dh)/2;if($('ktvMirrorCamera').checked){ctx.translate(x+w,0);ctx.scale(-1,1);ctx.drawImage(source,x+w-(dx+dw),dy,dw,dh)}else ctx.drawImage(source,dx,dy,dw,dh);ctx.restore();
}
async function initCutout(){
 if(segmentReady)return true;
 if(!navigator.onLine)throw Error('目前離線，無法載入人物去背模型');
 if(!window.SelfieSegmentation){await new Promise((resolve,reject)=>{const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/selfie_segmentation.js';sc.onload=resolve;sc.onerror=()=>reject(Error('人物去背模型下載失敗'));document.head.appendChild(sc)})}
 segmenter=new window.SelfieSegmentation({locateFile:f=>'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/'+f});
 segmenter.setOptions({modelSelection:1,selfieMode:false});
 segmenter.onResults(r=>{try{
 const w=Math.min(cam.videoWidth||640,640),h=Math.round(w*(cam.videoHeight||480)/(cam.videoWidth||640));
 if(cutoutCanvas.width!==w||cutoutCanvas.height!==h){cutoutCanvas.width=liveCutout.width=maskCanvas.width=w;cutoutCanvas.height=liveCutout.height=maskCanvas.height=h}
 // Smooth minor background artifacts and contract soft borders so stray outlines disappear.
 maskCtx.clearRect(0,0,w,h);maskCtx.save();maskCtx.filter='blur(2px)';maskCtx.drawImage(r.segmentationMask,0,0,w,h);maskCtx.restore();
 const mask=maskCtx.getImageData(0,0,w,h),px=mask.data;
 for(let i=0;i<px.length;i+=4){const m=px[i]/255;const t=Math.max(0,Math.min(1,(m-.22)/.66));const a=t*t*(3-2*t);px[i]=px[i+1]=px[i+2]=255;px[i+3]=Math.round(a*255)}
 maskCtx.putImageData(mask,0,0);
 cutoutCtx.clearRect(0,0,w,h);cutoutCtx.globalCompositeOperation='source-over';cutoutCtx.drawImage(r.image,0,0,w,h);cutoutCtx.globalCompositeOperation='destination-in';cutoutCtx.drawImage(maskCanvas,0,0,w,h);cutoutCtx.globalCompositeOperation='source-over';
 liveCtx.clearRect(0,0,w,h);liveCtx.drawImage(cutoutCanvas,0,0,w,h);const sample=cutoutCtx.getImageData(Math.floor(w/2),Math.floor(h/2),1,1).data;cutoutFrame=sample[3]>2;cutoutFailures=0;updateCutoutUI();$('ktvCutoutHint').textContent=cutoutFrame?'✅ 人像去背已啟用。':'⏳ 尚未偵測到人物，暫時顯示原始鏡頭。';
 }catch(e){cutoutFrame=false;updateCutoutUI();$('ktvCutoutHint').textContent='⚠️ 去背處理失敗：'+e.message}});
 segmentReady=true;segmentTimer=setInterval(async()=>{if(!camStream||cam.readyState<2||!cam.videoWidth||segmentBusy||!$('ktvRemoveBackground').checked)return;segmentBusy=true;try{await segmenter.send({image:cam})}catch(e){if(++cutoutFailures>=3){cutoutFrame=false;updateCutoutUI();$('ktvCutoutHint').textContent='⚠️ 去背模型暫停：'+e.message}}finally{segmentBusy=false}},mobileCapture?240:160);return true;
}
$('ktvRemoveBackground').addEventListener('change',async e=>{
 if(e.target.checked){try{if(!camStream){$('ktvCutoutHint').textContent='✅ 已選擇人像去背。請另外點「開啟鏡頭」，不會自動開始錄影。';return;} $('ktvCutoutHint').textContent='⏳ 人物去背模型載入中…';await initCutout();$('studioOverlay').checked=true;if(!cutoutFrame)$('ktvCutoutHint').textContent='⏳ 模型已載入，正在辨識人物…';}catch(err){e.target.checked=false;cutoutFrame=false;updateCutoutUI();$('ktvQuickCutout').checked=false;$('ktvCutoutHint').textContent='⚠️ '+err.message;status('去背無法啟動：'+err.message)}}
 else{cutoutFrame=false;updateCutoutUI();$('ktvCutoutHint').textContent='去背已關閉，使用一般自拍小視窗。'}
});
const status=s=>$('studioStatus').textContent=s;
function updateMixer(){if(musicGain)musicGain.gain.value=Number($('ktvMusicVolume').value)/100;if(micGain)micGain.gain.value=Number($('ktvMicVolume').value)/100;$('ktvMusicRead').textContent=$('ktvMusicVolume').value+'%';$('ktvMicRead').textContent=$('ktvMicVolume').value+'%';if(voiceFilter){const v=$('ktvVoiceEffect').value;voiceFilter.type=v==='warm'?'lowshelf':v==='bright'?'highshelf':'peaking';voiceFilter.frequency.value=v==='warm'?250:v==='bright'?3000:1000;voiceFilter.gain.value=v==='warm'?4:v==='bright'?5:0;if(echoGain)echoGain.gain.value=v==='echo'?.23:0}}
['ktvMusicVolume','ktvMicVolume','ktvVoiceEffect'].forEach(id=>$(id).addEventListener('input',updateMixer));
[['ktvLiveMusic','ktvMusicVolume'],['ktvLiveMic','ktvMicVolume']].forEach(([live,setting])=>{$(live).addEventListener('input',()=>{$(setting).value=$(live).value;updateMixer()});$(setting).addEventListener('input',()=>{$(live).value=$(setting).value})});
const mime=()=>{for(const t of ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4;codecs=h264,aac','video/mp4','video/webm;codecs=vp8,opus','video/webm;codecs=vp9,opus','video/webm'])if(MediaRecorder.isTypeSupported(t))return t;return '';};
function explainFormat(b){const mp4=b?.type?.includes('mp4');$('studioFormatNote').textContent=mp4?'✅ 目前成品為 MP4，通常可直接在 iPhone／Android 相簿播放。':'⚠️ 此瀏覽器未提供 MP4 錄製，成品為 WebM；部分手機相簿不能直接播放。建議使用支援 MP4 錄製的 Safari 或其他裝置，或另行轉檔。更改副檔名無法轉成 MP4。';$('studioShare').style.display=(navigator.canShare&&navigator.share)?'':'none';}
function drawCover(src){const sw=src.videoWidth||src.naturalWidth,sh=src.videoHeight||src.naturalHeight;if(!sw||!sh)return;const k=Math.max(canvas.width/sw,canvas.height/sh);ctx.drawImage(src,(canvas.width-sw*k)/2,(canvas.height-sh*k)/2,sw*k,sh*k)}
function frame(now=0){raf=requestAnimationFrame(frame);if(mobileCapture&&recording&&now-lastDrawTime<50)return;lastDrawTime=now;const bg=$('studioBackground').value;ctx.fillStyle='#132039';ctx.fillRect(0,0,1280,720);if(bg==='gradient'){const g=ctx.createLinearGradient(0,0,1280,720);g.addColorStop(0,'#151641');g.addColorStop(.5,'#7d2e69');g.addColorStop(1,'#14112e');ctx.fillStyle=g;ctx.fillRect(0,0,1280,720)}else if(bg==='stage'){const g=ctx.createRadialGradient(640,170,20,640,400,850);g.addColorStop(0,'#a35e9d');g.addColorStop(.4,'#39275b');g.addColorStop(1,'#080b1e');ctx.fillStyle=g;ctx.fillRect(0,0,1280,720);for(let i=0;i<7;i++){ctx.strokeStyle='rgba(255,210,255,.13)';ctx.lineWidth=24;ctx.beginPath();ctx.moveTo((i*220)-200,0);ctx.lineTo(640+(i-3)*70,720);ctx.stroke()}}else if(bg==='photo'&&bgImg)drawCover(bgImg);else if(bg==='video'&&video.readyState>=2)drawCover(video);else if(bg==='screen'&&video.readyState>=2)drawCover(video);
if(bg==='camera'&&cam.readyState>=2)drawCover(cam);
if(float&&!float.classList.contains('hidden')&&cam.readyState>=2) {const r=stage.getBoundingClientRect(); if(r.width){float.style.width=(overlay.w*100)+'%';float.style.left=(Math.min(overlay.x,1-overlay.w)*100)+'%';float.style.top=(Math.min(overlay.y,Math.max(0,1-(overlay.w*(cam.videoHeight||720)/(cam.videoWidth||1280))*r.width/r.height))*100)+'%';}}
if($('studioOverlay').checked&&cam.readyState>=2&&bg!=='camera') {
 const cutout=$('ktvRemoveBackground').checked&&segmentReady&&cutoutFrame;
 // Sharing this same browser tab already captures the ordinary floating camera.
 // Compositing it again would create the user's duplicated / opposite-direction image.
 const inCapturedTab=(bg==='screen'&&screenStream&&screenStream.active&&!float.classList.contains('hidden')); // Avoid duplicate camera on shared KTV page
 if(!inCapturedTab){
 const w=overlay.w*1280,h=Math.min(720,w*(cam.videoHeight||720)/(cam.videoWidth||1280)),x=Math.max(0,Math.min(1280-w,overlay.x*1280)),y=Math.max(0,Math.min(720-h,overlay.y*720));
 ctx.save();if(!cutout){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,18);else ctx.rect(x,y,w,h);ctx.clip()}
 drawCamera(x,y,w,h,cutout);ctx.restore();if(!cutout){ctx.strokeStyle='#e8c5fa';ctx.lineWidth=4;ctx.strokeRect(x,y,w,h)}
 }
}
ctx.textAlign='left';ctx.shadowColor='rgba(0,0,0,.75)';ctx.shadowBlur=8;ctx.font='bold 28px sans-serif';ctx.fillStyle='white';ctx.fillText(($('studioTitle').value||'我的 KTV').slice(0,35),26,54);ctx.shadowBlur=0;
if(recording){ctx.fillStyle='#f04468';ctx.beginPath();ctx.arc(1195,42,12,0,Math.PI*2);ctx.fill();ctx.font='24px sans-serif';ctx.fillStyle='white';ctx.fillText(Math.floor((Date.now()-startTime)/1000)+'s',1100,85)}}
function stopStream(s){if(s)s.getTracks().forEach(t=>t.stop())}
function setMedia(file,type){if(!file)return;const u=URL.createObjectURL(file);if(type==='image'){const im=new Image();im.onload=()=>{bgImg=im};im.src=u}else{if(bgVideoUrl)URL.revokeObjectURL(bgVideoUrl);bgVideoUrl=u;video.src=u;video.play().catch(()=>status('影片已載入；請點擊預覽或播放以啟用影片。'))}}
$('studioPhoto').onchange=e=>{setMedia(e.target.files[0],'image');$('studioBackground').value='photo'};
$('studioVideo').onchange=e=>{setMedia(e.target.files[0],'video');$('studioBackground').value='video'};
$('studioCamera').onclick=async()=>{try{
 if(!navigator.mediaDevices?.getUserMedia)throw Error('此瀏覽器無法使用攝影機，或網頁不是 HTTPS');
 stopStream(camStream);camStream=null;cam.pause();cam.srcObject=null;cutoutFrame=false;updateCutoutUI();
 const newStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:24,max:30}},audio:false});
 camStream=newStream;cam.srcObject=newStream;cam.muted=true;cam.autoplay=true;cam.playsInline=true;
 await cam.play();
 if(!cam.videoWidth||!cam.videoHeight){await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('攝影機未提供有效影像')),4500);const ready=()=>{if(cam.videoWidth&&cam.videoHeight){clearTimeout(timer);cam.removeEventListener('loadeddata',ready);resolve()}};cam.addEventListener('loadeddata',ready);ready()})}
 float.classList.remove('hidden','ktv-hide-from-capture');syncCameraRatio();if($('ktvRemoveBackground').checked){$('ktvCutoutHint').textContent='⏳ 人像去背載入中…';try{await initCutout()}catch(err){$('ktvCutoutHint').textContent='⚠️ 人像去背不可用：'+err.message}}$('ktvCamToggle').textContent='📷 關閉鏡頭';$('ktvQuickCamera').textContent='📷 關閉鏡頭';$('studioOverlay').checked=true;status('鏡頭已開啟；可以在畫面中拖動人物框，使用大小滑桿調整比例。')}catch(e){status('無法使用鏡頭：'+e.message)}};
$('studioScreen').onclick=async()=>{try{await requestTabCapture()}catch(e){status('畫面分享無法啟動：'+e.message)}};
async function requestTabCapture(){if(!navigator.mediaDevices?.getDisplayMedia)throw Error('此瀏覽器沒有分頁擷取功能；請用電腦版 Chrome／Edge。');stopStream(screenStream);screenStream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:24},audio:{echoCancellation:false,noiseSuppression:false},preferCurrentTab:true,selfBrowserSurface:'include',surfaceSwitching:'exclude',systemAudio:'include'});const track=screenStream.getVideoTracks()[0],info=track?.getSettings?.()||{};video.srcObject=screenStream;await video.play();$('studioBackground').value='screen';track.onended=()=>{if(recording)stopRecording();status('KTV 分頁分享已結束。')};if(screenStream.getAudioTracks().length===0)status('⚠️ 已取得影像，但沒有分頁音訊！請重新分享「目前分頁」並勾選「分享分頁音訊」。');else status('已取得分頁畫面與音訊；擷取來源：'+(info.displaySurface||'瀏覽器分頁')+'。');return screenStream}
$('studioScale').oninput=e=>overlay.w=Number(e.target.value)/100;

$('ktvCamToggle').onclick=async()=>{if(camStream){stopStream(camStream);camStream=null;cam.pause();cam.srcObject=null;cutoutFrame=false;updateCutoutUI();float.classList.add('hidden');$('ktvCamToggle').textContent='📷 開啟鏡頭';$('ktvQuickCamera').textContent='📷 開啟鏡頭';return}await $('studioCamera').onclick()};
$('ktvQuickCamera').addEventListener('click',()=> $('ktvCamToggle').click());
// V1.5.6.91: recording preflight distinguishes media recording from KTV tab capture.
function deviceCapabilities(){
 const display=!!navigator.mediaDevices?.getDisplayMedia;
 const media=!!navigator.mediaDevices?.getUserMedia;
 const rec=typeof MediaRecorder!=='undefined'&&!!canvas.captureStream;
 const secure=window.isSecureContext || location.hostname==='localhost';
 const mp4=typeof MediaRecorder!=='undefined'&&['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4'].some(t=>MediaRecorder.isTypeSupported?.(t));
 return {display,media,rec,secure,mp4};
}
function capabilityDescription(){
 const c=deviceCapabilities();
 if(!c.secure)return '⚠️ 必須以 HTTPS 開啟，才可授權鏡頭與麥克風。';
 if(!c.media||!c.rec)return '⚠️ 此瀏覽器不支援目前的鏡頭／錄影功能。可播放 KTV，但不能用這個錄影器錄製。';
 if(!c.display)return '📱 此瀏覽器沒有分頁擷取：可選擇「我的照片／影片／預設背景」錄製麥克風和人物，但無法直接錄入 YouTube KTV 畫面與伴奏。'+(c.mp4?' 支援 MP4 錄製。':' 錄影格式需依裝置支援判定。');
 return '💻 可嘗試分頁擷取：請選「目前分頁」並勾選分享分頁音訊。'+(c.mp4?' 可嘗試 MP4。':' 錄影可能是 WebM，手機相簿未必能直接播放。');
}
function refreshCapabilities(){const msg=capabilityDescription();$('ktvCapabilityNote').textContent=msg;$('studioDeviceNote').textContent=msg;}
$('ktvPreflight').onclick=()=>{refreshCapabilities();$('ktvCapabilityNote').scrollIntoView({behavior:'smooth',block:'nearest'});};
refreshCapabilities();
$('studioBackground').addEventListener('change',refreshCapabilities);
$('ktvRecordStart').onclick=()=>startRecording();
$('ktvRecordStop').onclick=stopRecording;
$('ktvRecordingOptions').onclick=()=>openCompactSettings();
let pointerId=null,offsetX=0,offsetY=0;
float.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;pointerId=e.pointerId;const r=float.getBoundingClientRect();offsetX=e.clientX-r.left;offsetY=e.clientY-r.top;float.setPointerCapture(e.pointerId);e.preventDefault()});
float.addEventListener('pointermove',e=>{if(pointerId!==e.pointerId)return;const r=stage.getBoundingClientRect(),w=float.getBoundingClientRect().width,h=float.getBoundingClientRect().height;overlay.x=Math.max(0,Math.min((r.width-w)/r.width,(e.clientX-r.left-offsetX)/r.width));overlay.y=Math.max(0,Math.min((r.height-h)/r.height,(e.clientY-r.top-offsetY)/r.height));e.preventDefault()});
float.addEventListener('pointerup',()=>pointerId=null);float.addEventListener('pointercancel',()=>pointerId=null);

canvas.addEventListener('pointerdown',e=>{if(!$('studioOverlay').checked)return;drag=true;canvas.setPointerCapture(e.pointerId);move(e)});canvas.addEventListener('pointermove',e=>{if(drag)move(e)});canvas.addEventListener('pointerup',()=>drag=false);
function move(e){const r=canvas.getBoundingClientRect();overlay.x=Math.max(0,Math.min(1-overlay.w,(e.clientX-r.left)/r.width-overlay.w/2));overlay.y=Math.max(0,Math.min(.8,(e.clientY-r.top)/r.height-.1))}
function connectAudio(stream,kind){if(stream&&stream.getAudioTracks().length){const n=audioCtx.createMediaStreamSource(stream);if(kind==='music'){musicGain=audioCtx.createGain();n.connect(musicGain);musicGain.connect(audioDestination);sourceNodes.push(n,musicGain)}else{micGain=audioCtx.createGain();voiceFilter=audioCtx.createBiquadFilter();n.connect(voiceFilter);voiceFilter.connect(micGain);micGain.connect(audioDestination);echoDelay=audioCtx.createDelay(.8);echoDelay.delayTime.value=.23;echoGain=audioCtx.createGain();voiceFilter.connect(echoDelay);echoDelay.connect(echoGain);echoGain.connect(micGain);sourceNodes.push(n,voiceFilter,micGain,echoDelay,echoGain)}updateMixer()}}
function resetResult(){exitPreviewTheatre();$('studioPlaybackBack').classList.add('studio-hidden');$('studioPlayback').pause();if(document.fullscreenElement=== $('studioPlayback'))document.exitFullscreen().catch(()=>{});if(blobURL)URL.revokeObjectURL(blobURL);blobURL=null;blob=null;saved=false;$('studioResult').classList.add('studio-hidden');$('studioPlayback').removeAttribute('src');$('studioPlayback').load()}
const audioProfiles={balanced:{echoCancellation:true,noiseSuppression:false,autoGainControl:false,description:'平衡：抑制手機喇叭回音，保留人聲細節'},voice:{echoCancellation:true,noiseSuppression:true,autoGainControl:false,description:'人聲優先：壓低環境伴奏，但可能使歌聲變薄'},raw:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,description:'原音保留：減少聲音被切掉，可能收進喇叭回音'}};
const speakerModeEl=$('ktvSpeakerMode');
function selectedAudioProfile(){return audioProfiles[speakerModeEl?.value]||audioProfiles.balanced}
if(speakerModeEl){speakerModeEl.addEventListener('change',()=>{$('ktvAudioModeHint').textContent=selectedAudioProfile().description;});}
async function getStableMicrophone(){
 const settings=selectedAudioProfile();
 // Use broadly-supported audio constraints; do not force sample rate or ultra-low latency.
 const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:settings.echoCancellation,noiseSuppression:settings.noiseSuppression,autoGainControl:false,channelCount:{ideal:1}},video:false});
 const track=stream.getAudioTracks()[0];const actual=track?.getSettings?.()||{};
 const el=$('ktvMicDeviceStatus');if(el)el.textContent='🎤 錄音設定：'+(speakerModeEl?.selectedOptions?.[0]?.textContent||'平衡')+'；回音消除 '+(actual.echoCancellation===undefined?'依裝置':actual.echoCancellation?'開':'關')+'、降噪 '+(actual.noiseSuppression===undefined?'依裝置':actual.noiseSuppression?'開':'關')+'。';
 return stream;
}
async function startRecording(){if(recording)return;if(!window.MediaRecorder||!canvas.captureStream){status('本裝置不支援此錄影方式。');return}try{let bg=$('studioBackground').value;const caps=deviceCapabilities();
 if(!caps.secure||!caps.media){status(capabilityDescription());return}
 if(bg==='screen'&&!caps.display){
   const agreed=confirm('手機瀏覽器無法直接擷取 YouTube 嵌入的 KTV 畫面與伴奏。\n\n按「確定」會立即以演唱會背景開始錄製鏡頭＋麥克風；按「取消」可先在設定選擇自己的背景影片（含有權使用的音樂）。');
   if(!agreed){openCompactSettings(true);status('已取消錄製。請選擇可用的背景影片，或改為演唱會背景。');return;}
   bg='stage';$('studioBackground').value='stage';refreshCapabilities();
 }
 resetResult();if(bg==='screen'){if(!screenStream||!screenStream.active)await requestTabCapture();if(!screenStream.getAudioTracks().length){if(!confirm('⚠️ 沒有收到 KTV 分頁音訊，繼續錄影將只有麥克風聲。要繼續嗎？')){stopStream(screenStream);screenStream=null;status('已取消。請重新開始並勾選「分享分頁音訊」。');return}}}
// One user gesture requests both permissions. A previously-open camera is reused when possible.
let combinedStream=null;
if(mobileCapture && !camStream){
  const profile=selectedAudioProfile();
  combinedStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:20,max:24}},audio:{echoCancellation:profile.echoCancellation,noiseSuppression:profile.noiseSuppression,autoGainControl:false,channelCount:{ideal:1}}});
  camStream=new MediaStream(combinedStream.getVideoTracks());cam.srcObject=camStream;cam.muted=true;cam.playsInline=true;await cam.play();
  float.classList.remove('hidden');$('studioOverlay').checked=true;syncCameraRatio();
  $('ktvCamToggle').textContent='📷 關閉鏡頭';$('ktvQuickCamera').textContent='📷 關閉鏡頭';
  micStream=new MediaStream(combinedStream.getAudioTracks());
}else micStream=await getStableMicrophone();
const stream=canvas.captureStream(mobileCapture?18:24);
// For a mobile microphone-only recording, bypass WebAudio entirely; this avoids an unnecessary live mixer and keeps the original mic track.
const directMic=mobileCapture && !(['screen','video'].includes(bg)) && $('ktvVoiceEffect').value==='natural' && Number($('ktvMicVolume').value)===100;
if(directMic){micStream.getAudioTracks().forEach(t=>stream.addTrack(t));}
else{audioCtx=new (window.AudioContext||window.webkitAudioContext)({latencyHint:'playback'});await audioCtx.resume();audioDestination=audioCtx.createMediaStreamDestination();connectAudio(micStream,'mic');}if(!directMic && bg==='screen'&&screenStream?.getAudioTracks().length)connectAudio(screenStream,'music');if(!directMic && bg==='video'&&video.src&&!video.srcObject){try{const node=audioCtx.createMediaElementSource(video);musicGain=audioCtx.createGain();node.connect(musicGain);musicGain.connect(audioDestination);sourceNodes.push(node,musicGain);updateMixer()}catch(e){status('自訂影片音訊未能混合：'+e.message)}}if(!directMic)audioDestination.stream.getAudioTracks().forEach(t=>stream.addTrack(t));const type=mime();recorder=new MediaRecorder(stream,{...(type?{mimeType:type}:{}),videoBitsPerSecond:mobileCapture?1100000:3500000,audioBitsPerSecond:160000});chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onerror=e=>status('錄製失敗：'+(e.error?.message||'未知錯誤'));recorder.onstop=()=>{blob=new Blob(chunks,{type:recorder.mimeType||'video/webm'});if(!blob.size){setKtvRecordState(false,'錄製失敗');status('錄製沒有產生有效影片；請檢查裝置權限及錄影格式。');cleanupAudio();$('studioRec').disabled=false;$('ktvRecordStart').disabled=false;syncQuickButtons();return;}blobURL=URL.createObjectURL(blob);$('studioPlayback').src=blobURL;setRecordSummary(blob);setKtvRecordState(false,'錄製完成，請預覽確認');explainFormat(blob);$('studioResult').classList.remove('studio-hidden');$('studioRec').disabled=false;$('studioStop').disabled=true;$('ktvRecordStart').disabled=false;$('ktvRecordStop').disabled=true;syncQuickButtons();openCompactSettings(true);fsPanel.classList.remove('ktv-tools-open');updateFsUi();$('studioResult').scrollIntoView({behavior:'smooth',block:'nearest'});status('錄製完成（'+extension(blob).toUpperCase()+'），請先預覽確認影音，再選擇儲存或重唱。');cleanupAudio()};recorder.start(2000);recording=true;/* The shared tab already contains the live cutout camera; never hide it or add it twice. */startTime=Date.now();setKtvRecordState(true, bg==='screen'?'錄製中：分頁畫面＋'+(screenStream.getAudioTracks().length?'伴奏＋':'無伴奏＋')+'麥克風':'錄製中：自訂背景＋麥克風（僅本機影片可有背景音軌）');$('studioRec').disabled=true;$('studioStop').disabled=false;$('ktvRecordStart').disabled=true;$('ktvRecordStop').disabled=false;syncQuickButtons();status(bg==='screen'?'● 正在錄製 KTV 分享畫面＋'+(screenStream.getAudioTracks().length?'伴奏音訊':'未取得伴奏')+'＋麥克風；可調整混音滑桿。':'● 正在錄製自訂背景與麥克風，非分頁模式無法擷取 YouTube 伴奏；上傳本機影片可混入該影片聲音。為減少聲音回授，建議使用有線耳機。')}catch(e){setKtvRecordState(false,'無法開始錄影');cleanupAudio();status('啟動錄製失敗：'+e.message)}}
function cleanupAudio(){stopStream(micStream);micStream=null;sourceNodes.forEach(n=>{try{n.disconnect()}catch(e){}});sourceNodes=[];if(audioCtx)audioCtx.close().catch(()=>{});audioCtx=null;musicGain=micGain=voiceFilter=echoDelay=echoGain=null}
function stopRecording(){if(!recording)return;pauseKtvOnStop();recording=false;setKtvRecordState(false,'正在處理錄影檔案…');float.classList.remove('ktv-hide-from-capture');$('ktvRecordStop').disabled=true;syncQuickButtons();try{if(recorder&&recorder.state!=='inactive')recorder.stop()}catch(e){cleanupAudio();status(e.message)}}
$('studioRec').onclick=startRecording;$('studioStop').onclick=stopRecording;
$('studioRetry').onclick=()=>{resetResult();$('ktvPlayerStage').scrollIntoView({behavior:'smooth',block:'center'});status('已捨棄本次成品，可以重新開始錄製。')};$('studioDiscard').onclick=()=>{resetResult();$('ktvStudioDetails').open=false;status('已放棄本次錄製，沒有儲存。')};
const DB='watch-ktv-records-v1';function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('items',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function transaction(mode,fn){return new Promise(async(resolve,reject)=>{try{const db=await openDB(),tx=db.transaction('items',mode),store=tx.objectStore('items');const req=fn(store);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close()}catch(e){reject(e)}})}
function downloadFile(b,name){const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000)}
function extension(b){return b.type.includes('mp4')?'mp4':'webm'}
function makeFilename(b){const name=($('studioTitle').value||'KTV作品').replace(/[\\/:*?"<>|]/g,'_');return name+'_'+new Date().toISOString().replace(/[:.]/g,'-')+'.'+extension(b)}
$('studioShare').onclick=async()=>{if(!blob||!navigator.share)return;const file=new File([blob],makeFilename(blob),{type:blob.type});try{if(navigator.canShare&&!navigator.canShare({files:[file]})){status('本裝置不支援分享此影片檔案，請使用下載。');return}await navigator.share({files:[file],title:'我的 KTV 作品'});status('已送出分享，是否存入相簿取決於你在手機分享選單的選擇。')}catch(e){if(e.name!=='AbortError')status('分享失敗：'+e.message)}};
async function saveRecord(){if(!blob)return;const file=makeFilename(blob),name=($('studioTitle').value||'KTV作品');const data={id:Date.now(),name,file,date:new Date().toLocaleString('zh-TW'),size:blob.size,blob};try{await transaction('readwrite',s=>s.put(data));saved=true;downloadFile(blob,file);await renderHistory();status('已儲存在此裝置的瀏覽器作品紀錄，並下載影片。手機請從下載項目使用「分享／儲存影片」存到相簿；並非自動存入相簿。')}catch(e){downloadFile(blob,file);status('已下載影片，但瀏覽器儲存紀錄失敗（空間或私人模式限制）：'+e.message)}}
$('studioSave').onclick=saveRecord;
function closePlayback(){exitPreviewTheatre();const v=$('studioPlayback');v.pause();if(document.fullscreenElement){document.exitFullscreen?.().catch(()=>{});}try{v.webkitExitFullscreen?.()}catch(e){}$('studioResult').classList.add('studio-hidden');$('ktvPlayerStage').scrollIntoView({behavior:'smooth',block:'center'});}
const previewWrap=$('studioPreviewTheatre');
// A fixed element cannot escape a transformed / isolated settings panel. Portal it to
// document.body for review, then restore the original DOM position afterwards.
const previewHome=previewWrap?.parentNode, previewNext=previewWrap?.nextSibling;
let previewTheatreActive=false;
function exitPreviewTheatre(){
 if(!previewWrap)return;
 previewTheatreActive=false;
 previewWrap.classList.remove('ktv-preview-theatre');
 document.body.classList.remove('ktv-preview-open');
 if(previewHome&&previewWrap.parentNode!==previewHome)previewHome.insertBefore(previewWrap,previewNext);
 $('studioPreviewFullscreen').textContent='⛶ 全螢幕預覽';
 $('studioPreviewFullscreen').setAttribute('aria-pressed','false');
}
async function togglePreviewTheatre(){
 if(!previewWrap)return;
 if(previewTheatreActive){exitPreviewTheatre();return;}
 // If a native fullscreen element exists, body-level overlays cannot display over it.
 if(document.fullscreenElement){try{await document.exitFullscreen()}catch(e){}}
 previewTheatreActive=true;
 document.body.appendChild(previewWrap);
 previewWrap.classList.add('ktv-preview-theatre');
 document.body.classList.add('ktv-preview-open');
 $('studioPreviewFullscreen').textContent='⤢ 縮小預覽';
 $('studioPreviewFullscreen').setAttribute('aria-pressed','true');
 // No scrollIntoView here: it scrolls the KTV player beneath the full-screen review.
}
$('studioPreviewFullscreen').onclick=togglePreviewTheatre;
$('studioPreviewExit').onclick=exitPreviewTheatre;
document.addEventListener('keydown',e=>{if(e.key==='Escape')exitPreviewTheatre()});
$('studioClosePreview').onclick=closePlayback;
$('studioPlaybackBack').onclick=closePlayback;
$('studioPlayback').addEventListener('play',()=>{$('studioPlaybackBack').classList.remove('studio-hidden')});
$('studioPlayback').addEventListener('ended',()=>{$('studioPlaybackBack').classList.remove('studio-hidden')});
async function renderHistory(){const wrap=$('studioHistory');try{const records=await transaction('readonly',s=>s.getAll());records.sort((a,b)=>b.id-a.id);wrap.replaceChildren();if(!records.length){wrap.textContent='尚無作品。紀錄存放在此瀏覽器，清除網站資料後可能消失。';return}records.forEach(v=>{const box=document.createElement('div');box.className='studio-history-item';const t=document.createElement('span');t.textContent=v.name+'｜'+v.date+'｜'+(v.size/1048576).toFixed(1)+' MB';const play=document.createElement('button');play.textContent='▶ 預覽';play.onclick=()=>{closeMyRecordings();openCompactSettings(true);resetResult();blob=v.blob;blobURL=URL.createObjectURL(blob);$('studioPlayback').src=blobURL;explainFormat(blob);$('studioResult').classList.remove('studio-hidden');$('studioResult').scrollIntoView({behavior:'smooth',block:'nearest'})};const save=document.createElement('button');save.textContent='↓ 再次下載';save.onclick=()=>downloadFile(v.blob,v.file);const del=document.createElement('button');del.textContent='刪除紀錄';del.onclick=async()=>{if(confirm('刪除此瀏覽器的作品及影片備份？不會刪除已下載的影片。')){await transaction('readwrite',s=>s.delete(v.id));renderHistory()}};box.append(t,play,save,del);wrap.appendChild(box)})}catch(e){wrap.textContent='此裝置無法開啟本機作品紀錄：'+e.message}}

$('ktvStudioDetails').addEventListener('toggle',()=>{if($('ktvStudioDetails').open)renderHistory()});
// Independent recording library, separate from the settings layout.
const recordingLibrary=document.createElement('div');
recordingLibrary.id='ktvRecordingLibrary';recordingLibrary.className='ktv-library-hidden';
recordingLibrary.setAttribute('role','dialog');recordingLibrary.setAttribute('aria-modal','true');
recordingLibrary.setAttribute('aria-label','我的錄影作品');
recordingLibrary.innerHTML='<div class="ktv-library-backdrop"></div><section class="ktv-library-card"><header><h2>📁 我的錄影作品</h2><button type="button" id="ktvLibraryClose">✕ 關閉</button></header><p class="ktv-library-tip">作品保存在此瀏覽器的本機紀錄，並不等於手機相簿。可點預覽、重新下載或刪除。</p><div id="ktvLibrarySlot"></div><footer><button type="button" id="ktvLibraryRefresh">↻ 更新作品</button></footer></section>';
$('ktvPlayerPanel').appendChild(recordingLibrary);
$('ktvLibrarySlot').appendChild($('studioHistory'));
function closeMyRecordings(){recordingLibrary.classList.add('ktv-library-hidden')}
function openMyRecordings(){openCompactSettings(false);fsPanel.classList.remove('ktv-tools-open');updateFsUi();recordingLibrary.classList.remove('ktv-library-hidden');renderHistory()}
$('ktvMyRecordings').addEventListener('click',openMyRecordings);
$('ktvMyRecordingsTools').addEventListener('click',openMyRecordings);
$('ktvLibraryClose').addEventListener('click',closeMyRecordings);
recordingLibrary.querySelector('.ktv-library-backdrop').addEventListener('click',closeMyRecordings);
$('ktvLibraryRefresh').addEventListener('click',renderHistory);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!recordingLibrary.classList.contains('ktv-library-hidden'))closeMyRecordings()});

function syncQuickButtons(){const a=$('ktvQuickStart'),b=$('ktvQuickStop');a.disabled=recording||$('ktvRecordStart').disabled;b.disabled=!recording;}
function openCompactSettings(force){const d=$('ktvStudioDetails');const next=typeof force==='boolean'?force:!d.open;d.open=next;$('ktvStudio').classList.toggle('ktv-settings-open',next);$('ktvCompactSettings').setAttribute('aria-expanded',String(next));if(next){$('ktvStudio').scrollTop=0}}
$('ktvCompactSettings').addEventListener('click',()=>openCompactSettings());$('ktvSettingsClose').addEventListener('click',()=>openCompactSettings(false));
$('ktvQuickStart').addEventListener('click',()=>startRecording());
$('ktvQuickStop').addEventListener('click',()=>stopRecording());
$('ktvQuickCutout').addEventListener('change',e=>{$('ktvRemoveBackground').checked=e.target.checked;$('ktvRemoveBackground').dispatchEvent(new Event('change',{bubbles:true}));});
$('ktvRemoveBackground').addEventListener('change',()=>{$('ktvQuickCutout').checked=$('ktvRemoveBackground').checked});
$('ktvStudioDetails').addEventListener('toggle',()=>{if(!$('ktvStudioDetails').open)$('ktvStudio').classList.remove('ktv-settings-open')});
syncQuickButtons();
const fsPanel=$('ktvPlayerPanel'),fsButton=$('ktvFullscreenBtn'),fsMenu=$('ktvFullscreenMenu');
fsPanel.appendChild($('ktvStudio'));
// Use in-page theatre mode instead of native iframe fullscreen: the exit buttons remain accessible.
function updateFsUi(){
 const active=fsPanel.classList.contains('ktv-ios-fullscreen');
 fsPanel.classList.toggle('ktv-fs-active',active);
 document.body.classList.toggle('ktv-theatre-open',active);
 fsButton.textContent=active?'✕ 退出全螢幕':'⛶ 全螢幕';
 fsButton.setAttribute('aria-pressed',String(active));
 fsMenu.textContent=fsPanel.classList.contains('ktv-tools-open')?'✕ 收合工具':'⚙ 工具';
 fsMenu.setAttribute('aria-expanded',String(fsPanel.classList.contains('ktv-tools-open')));
 if(!active){fsPanel.classList.remove('ktv-tools-open');fsMenu.setAttribute('aria-expanded','false');fsMenu.textContent='⚙ 工具'}
}
fsButton.addEventListener('click',()=>{fsPanel.classList.toggle('ktv-ios-fullscreen');updateFsUi()});
fsMenu.addEventListener('click',()=>{if(!fsPanel.classList.contains('ktv-ios-fullscreen'))fsPanel.classList.add('ktv-ios-fullscreen');fsPanel.classList.toggle('ktv-tools-open');updateFsUi()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&fsPanel.classList.contains('ktv-ios-fullscreen')){fsPanel.classList.remove('ktv-ios-fullscreen');updateFsUi()}});
$('ktvClosePlayerBtn')?.addEventListener('click',()=>{fsPanel.classList.remove('ktv-ios-fullscreen');updateFsUi()});
window.ktvEnterTheatre=()=>{fsPanel.classList.add('ktv-ios-fullscreen');fsPanel.classList.remove('ktv-tools-open');updateFsUi()};
window.ktvExitTheatre=()=>{fsPanel.classList.remove('ktv-ios-fullscreen','ktv-tools-open');updateFsUi()};
updateMixer();frame();window.addEventListener('pagehide',()=>{stopStream(camStream);stopStream(screenStream);stopStream(micStream);if(segmentTimer)clearInterval(segmentTimer);if(segmenter)segmenter.close?.();if(raf)cancelAnimationFrame(raf)});
})();
