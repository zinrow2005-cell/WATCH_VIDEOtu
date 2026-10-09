(()=>{'use strict';
const $=id=>document.getElementById(id);const elt=id=>$(id);const stage=$('ktvPlayerStage'), cameraBox=$('ktvCamFloat'), camera=$('ktvCamPreview');if(!stage||!camera)return;
let camStream=null,micStream=null,tabStream=null,recorder=null,canvas=null,raf=0,audioCtx=null,recorded=[],mime='',recordURL='',recordBlob=null,recording=false,starting=false,photo=null,lastFile='',ready=false;
const status=t=>{const e=$('simpleStatus');if(e)e.textContent=t};
function buttonState(){ $('simpleCamera').textContent=camStream?'📷 關閉鏡頭':'📷 開啟鏡頭';$('simpleRecord').disabled=starting||recording;$('simpleStop').disabled=!recording;$('simpleRecord').textContent=starting?'⏳ 準備中…':recording?'🔴 錄製中':'🔴 開始錄影'; }
function stopTracks(stream){if(stream)stream.getTracks().forEach(t=>t.stop())}
async function openCamera(){if(camStream)return true;if(!navigator.mediaDevices?.getUserMedia)throw Error('瀏覽器不支援攝影機。請使用 HTTPS 頁面與新版瀏覽器。');camStream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}},audio:false});camera.srcObject=camStream;camera.muted=true;camera.setAttribute('playsinline','');cameraBox.classList.remove('hidden');cameraBox.style.display='block';camera.style.display='block';await camera.play();if(!camera.videoWidth)await new Promise(resolve=>{const timer=setTimeout(resolve,1800);camera.addEventListener('loadedmetadata',()=>{clearTimeout(timer);resolve()}, {once:true})});status('📷 鏡頭已開啟，可調整位置或開始錄影');buttonState();return true}
function closeCamera(){if(recording)return;stopTracks(camStream);camStream=null;camera.srcObject=null;cameraBox.classList.add('hidden');cameraBox.style.display='none';status('已關閉鏡頭');buttonState()}
$('simpleCamera').addEventListener('click',async()=>{if(starting)return;try{if(camStream)closeCamera();else await openCamera()}catch(e){status('無法開啟鏡頭：'+e.message);buttonState()}});
const opts=$('simpleOptions');$('simpleOptionsBtn').onclick=()=>{opts.hidden=!opts.hidden};$('simpleOptionsClose').onclick=()=>{opts.hidden=true};
$('simplePhoto').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const url=URL.createObjectURL(f);const img=new Image();img.src=url;await img.decode();photo=img;$('simpleBackground').value='photo';status('背景照片已選擇');}catch{status('無法載入圖片，請改選其他照片')}};
function drawContain(ctx,img,w,h){const iw=img.videoWidth||img.naturalWidth||w,ih=img.videoHeight||img.naturalHeight||h;if(!iw||!ih)return;const z=Math.min(w/iw,h/ih);ctx.drawImage(img,(w-iw*z)/2,(h-ih*z)/2,iw*z,ih*z)}
function drawCover(ctx,img,w,h){const iw=img.videoWidth||img.naturalWidth||w,ih=img.videoHeight||img.naturalHeight||h;if(!iw||!ih)return;const z=Math.max(w/iw,h/ih);ctx.drawImage(img,(w-iw*z)/2,(h-ih*z)/2,iw*z,ih*z)}
function paint(){if(!recording||!canvas)return;const ctx=canvas.getContext('2d',{alpha:false}),w=canvas.width,h=canvas.height;ctx.fillStyle='#060914';ctx.fillRect(0,0,w,h);const mode=$('simpleBackground').value;
if(mode==='tab'&&tabStream){const tv=$('simpleTabVideo');if(tv?.readyState>=2)drawContain(ctx,tv,w,h)}
else if(mode==='photo'&&photo)drawCover(ctx,photo,w,h);
else if(mode==='camera'&&camera.readyState>=2)drawContain(ctx,camera,w,h);
else{const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#102b62');g.addColorStop(.5,'#39235b');g.addColorStop(1,'#080f31');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
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
async function start(){if(starting||recording)return;starting=true;buttonState();try{
 const audioOnly=$('simpleRecordingType').value==='audio';const mode=audioOnly?'gradient':$('simpleBackground').value;if(mode==='photo'&&!photo)throw Error('請先選擇背景照片，或改用預設背景');
 if($('simpleRecordingType').value!=='audio'&&!camStream)await openCamera();
 micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:false,autoGainControl:false},video:false});
 if(mode==='tab'){
 if(!navigator.mediaDevices.getDisplayMedia)throw Error('這個瀏覽器無法分享 KTV 分頁；請選擇預設背景或自選照片');
 status('請選擇「目前分頁」，並勾選分享分頁音訊');tabStream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
 const v=document.createElement('video');v.id='simpleTabVideo';v.muted=true;v.playsInline=true;v.srcObject=tabStream;v.style.display='none';document.body.appendChild(v);await v.play();tabStream.getVideoTracks()[0].addEventListener('ended',()=>{if(recording)stop()}, {once:true});
 }
 const useTab=mode==='tab'&&tabStream,srcV=tabStream?.getVideoTracks()[0].getSettings();
 canvas=document.createElement('canvas');canvas.width=useTab?Math.min(srcV?.width||1280,1920):960;canvas.height=useTab?Math.min(srcV?.height||720,1080):540;
 const canvasStream=audioOnly?null:canvas.captureStream(20),out=new MediaStream(canvasStream?canvasStream.getVideoTracks():[]);
 audioCtx=new (window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();const dest=audioCtx.createMediaStreamDestination();
 const micSource=audioCtx.createMediaStreamSource(micStream),gain=audioCtx.createGain();gain.gain.value=Number($('simpleMicVolume').value)/100;micSource.connect(gain).connect(dest);
 if(tabStream?.getAudioTracks().length){audioCtx.createMediaStreamSource(tabStream).connect(dest)}
 dest.stream.getAudioTracks().forEach(t=>out.addTrack(t));
 const types=audioOnly?['audio/mp4;codecs=mp4a.40.2','audio/webm;codecs=opus','audio/webm']:['video/mp4;codecs="avc1.42E01E,mp4a.40.2"','video/webm;codecs=vp8,opus','video/webm'];mime=types.find(t=>MediaRecorder.isTypeSupported(t))||'';
 recorder=new MediaRecorder(out,mime?{mimeType:mime,videoBitsPerSecond:1800000,audioBitsPerSecond:128000}:undefined);recorded=[];
 recorder.ondataavailable=e=>{if(e.data?.size)recorded.push(e.data)};
 recorder.onstop=async()=>{cancelAnimationFrame(raf);stopTracks(canvasStream);stopTracks(tabStream);tabStream=null;stopTracks(micStream);micStream=null;document.getElementById('simpleTabVideo')?.remove();if(audioCtx){await audioCtx.close().catch(()=>{});audioCtx=null}const t=recorder.mimeType||mime||'video/webm';recordBlob=new Blob(recorded,{type:t});if(recordURL)URL.revokeObjectURL(recordURL);recordURL=URL.createObjectURL(recordBlob);$('simplePlayback').src=recordURL;recording=false;starting=false;buttonState();status('錄製完成，可預覽及儲存');$('simpleReview').hidden=false;};
 recorder.onerror=e=>status('錄影發生錯誤：'+(e.error?.message||'未知錯誤'));
 recording=true;starting=false;buttonState();recorder.start(1000);if(!audioOnly)paint();status('🔴 正在錄影；點「停止」可結束並預覽');
 }catch(e){recording=false;starting=false;stopTracks(tabStream);tabStream=null;document.getElementById('simpleTabVideo')?.remove();stopTracks(micStream);micStream=null;if(audioCtx){audioCtx.close().catch(()=>{});audioCtx=null}status('無法開始錄影：'+e.message);buttonState()}}
function pauseSong(){try{const f=$('ktvPlayerFrame');if(f?.contentWindow)f.contentWindow.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}), '*')}catch{}}
function stop(){if(!recording)return;pauseSong();recording=false;buttonState();status('正在完成錄影檔…');if(recorder?.state==='recording')recorder.stop();else{stopTracks(tabStream);stopTracks(micStream)}}
$('simpleRecord').onclick=start;$('simpleStop').onclick=stop;
const review=$('simpleReview');function reviewClose(){review.hidden=true;$('simplePlayback').pause()};$('simpleReviewClose').onclick=reviewClose;$('simpleRetry').onclick=()=>{reviewClose();start()};
function save(){if(!recordBlob)return;const ext=recordBlob.type.includes('mp4')?'mp4':recordBlob.type.startsWith('audio/')?'webm':'webm';const name='我的KTV作品_'+new Date().toISOString().replace(/[:.]/g,'-')+'.'+ext;const a=document.createElement('a');a.href=recordURL;a.download=name;document.body.appendChild(a);a.click();a.remove();lastFile=name;try{const r=JSON.parse(localStorage.getItem('simpleKtvList')||'[]');r.unshift({name,time:Date.now(),size:recordBlob.size,type:recordBlob.type});localStorage.setItem('simpleKtvList',JSON.stringify(r.slice(0,50)))}catch{}$('simpleReviewHint').textContent='已送至瀏覽器下載。手機請到下載項目或分享選單儲存到相簿。';}
$('simpleSave').onclick=save;$('simpleShare').onclick=async()=>{if(!recordBlob)return;try{const file=new File([recordBlob],lastFile||'KTV作品.'+(recordBlob.type.includes('mp4')?'mp4':recordBlob.type.startsWith('audio/')?'webm':'webm'),{type:recordBlob.type});if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file]});else save()}catch(e){if(e.name!=='AbortError')status('分享失敗：'+e.message)}};
const library=$('simpleLibrary');$('simpleLibraryBtn').onclick=()=>{const div=$('simpleLibraryList');let items=[];try{items=JSON.parse(localStorage.getItem('simpleKtvList')||'[]')}catch{}div.replaceChildren();const intro=document.createElement('p');intro.textContent='這裡顯示下載紀錄；影片實際儲存在裝置下載位置，不會自動同步到其他裝置。';div.appendChild(intro);items.forEach(it=>{let el=document.createElement('p');el.textContent=`${new Date(it.time).toLocaleString()}　${it.name}`;div.appendChild(el)});if(!items.length)div.append('目前沒有儲存紀錄。');library.hidden=false};$('simpleLibraryClose').onclick=()=>{library.hidden=true};
// For no-crop control, keep the actual camera inside the stage and allow pointer drag.
let drag=null;cameraBox.style.touchAction='none';cameraBox.addEventListener('pointerdown',e=>{if(!camStream)return;const a=stage.getBoundingClientRect(),b=cameraBox.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,l:b.left-a.left,t:b.top-a.top};cameraBox.setPointerCapture(e.pointerId)});cameraBox.addEventListener('pointermove',e=>{if(!drag)return;const a=stage.getBoundingClientRect(),w=cameraBox.offsetWidth,h=cameraBox.offsetHeight;cameraBox.style.left=Math.max(0,Math.min(a.width-w,drag.l+e.clientX-drag.x))+'px';cameraBox.style.top=Math.max(0,Math.min(a.height-h,drag.t+e.clientY-drag.y))+'px';cameraBox.style.right='auto'});cameraBox.addEventListener('pointerup',()=>drag=null);cameraBox.addEventListener('pointercancel',()=>drag=null);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){opts.hidden=true;reviewClose();library.hidden=true}});

const fs=$('ktvFullscreenBtn');if(fs){fs.onclick=()=>{const panel=$('ktvPlayerPanel');panel.classList.toggle('simple-fullview');fs.textContent=panel.classList.contains('simple-fullview')?'✕ 退出全螢幕':'⛶ 全螢幕'};}

buttonState();ready=true;
})();
