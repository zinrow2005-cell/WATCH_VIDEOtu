(function(){
'use strict';
var STORAGE='familytube_v15626';
var OLD_KEYS=['familytube_v15625','familytube_v15624','familytube_v15623','familytube_v15622','familytube_v15621','familytube_v15620','familytube_v15619','familytube_v15618','familytube_v15617','familytube_v15616','familytube_v15615','familytube_v15614','familytube_v15613','familytube_v15612','familytube_v15611','familytube_v15610','familytube_v1569','familytube_v1568','familytube_v1567','familytube_v1566','familytube_v1565','familytube_v1564','familytube_v1563','familytube_v1562','familytube_v1561','familytube_v156','familytube_v155','familytube_v154','familytube_v153','familytube_v152','familytube_v151','familytube_v15','familytube_v14','familytube_v13','familytube_v12'];
var DEFAULT={
 videos:[{id:'M7lc1UVf-VE',title:'YouTube 播放測試',category:'學習',channel:'YouTube',recommended:true,addedAt:Date.now()}],
 profiles:{
  daughter:{name:'女兒',avatar:'👧',favorites:[],recent:[],progress:{},dailyLimit:60,usage:{}},
  son:{name:'兒子',avatar:'👦',favorites:[],recent:[],progress:{},dailyLimit:60,usage:{}}
 },
 activeProfile:'daughter',pin:'1234',
 bedtime:{enabled:false,start:'21:00',end:'07:00'},
 playback:{loopCurrent:false},
 whitelist:{enabled:false,channels:[]}
};
var state=load(),player=null,currentId=null,currentList=[],currentIndex=-1,parentOpen=false,kidMode=false,modalCb=null;
var usageTick=null,lastUsageStamp=0,selectedAvatar='👧',quickMeta={id:'',title:'',channel:''},immersiveFull=false,relatedBusy=false,relatedItems=[];
var ytApiReady=false,playerReady=false,pendingVideo=null,lastRelatedId='',playerCreating=false,playerMode='none',playerFallbackTimer=null;
var miniPlayerActive=false,miniPlayerSuppressed=false,miniScrollBound=false;

function $(id){return document.getElementById(id)}
function clone(v){return JSON.parse(JSON.stringify(v))}
function todayKey(){var d=new Date();return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())}
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function load(){
 try{
  var raw=localStorage.getItem(STORAGE);
  if(!raw){for(var i=0;i<OLD_KEYS.length;i++){raw=localStorage.getItem(OLD_KEYS[i]);if(raw)break}}
  var v=raw?JSON.parse(raw):clone(DEFAULT);
  if(!v.profiles)v.profiles=clone(DEFAULT.profiles);
  ['daughter','son'].forEach(function(k){
   if(!v.profiles[k])v.profiles[k]=clone(DEFAULT.profiles[k]);
   var p=v.profiles[k];
   if(!p.avatar)p.avatar=k==='daughter'?'👧':'👦';
   if(!p.favorites)p.favorites=[];
   if(!p.recent)p.recent=[];
   if(!p.progress)p.progress={};
   if(typeof p.dailyLimit!=='number')p.dailyLimit=60;
   if(!p.usage)p.usage={};
  });
  if(!v.bedtime)v.bedtime=clone(DEFAULT.bedtime);if(!v.playback)v.playback=clone(DEFAULT.playback);
  if(!v.whitelist)v.whitelist=clone(DEFAULT.whitelist);
  if(!v.videos)v.videos=[];
  v.videos.forEach(function(x,i){
   if(!x.addedAt)x.addedAt=Date.now()-i*1000;
   if(typeof x.recommended!=='boolean')x.recommended=false;
   if(!x.channel)x.channel='';
   if(!x.category)x.category='其他'
  });
  return Object.assign(clone(DEFAULT),v);
 }catch(e){return clone(DEFAULT)}
}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
function profile(){return state.profiles[state.activeProfile]}

var AUTO_CATEGORY_RULES=[
 {name:'英文',words:['abc','alphabet','phonics','english','英文','單字','vocabulary','letter','letters','spelling','learn english','英語']},
 {name:'兒歌',words:['兒歌','童謠','nursery rhyme','nursery rhymes','kids song','kids songs','baby song','baby songs','sing along','song for kids','cocomelon']},
 {name:'卡通',words:['卡通','動畫','cartoon','animation','animated','peppa','pororo','paw patrol','佩佩豬','巧虎','超級飛俠']},
 {name:'故事',words:['故事','童話','story','stories','bedtime story','fairy tale','繪本','睡前故事']},
 {name:'學習',words:['學習','教學','learning','learn','education','educational','數學','math','science','科學','認知','顏色','color','colors','shape','shapes','number','numbers','數字']},
 {name:'自然／動物',words:['恐龍','dinosaur','dinosaurs','動物','animal','animals','海洋','ocean','昆蟲','insect','insects','自然','nature','fish','shark','lion','tiger','elephant','zoo']}
];
function autoClassifyVideo(meta){
 meta=meta||{};
 var title=(meta.title||'').toLowerCase(),channel=(meta.channel||'').toLowerCase(),query=(meta.query||'').toLowerCase();
 var best='其他',bestScore=0,hits=[];
 AUTO_CATEGORY_RULES.forEach(function(rule){
  var score=0,ruleHits=[];
  rule.words.forEach(function(w){
   var k=String(w).toLowerCase(),add=0;
   if(title.indexOf(k)>=0)add=3;
   else if(query.indexOf(k)>=0)add=2;
   else if(channel.indexOf(k)>=0)add=1;
   if(add){score+=add;ruleHits.push(w)}
  });
  if(score>bestScore){bestScore=score;best=rule.name;hits=ruleHits}
 });
 var confidence=bestScore>=6?95:bestScore>=4?88:bestScore>=3?80:bestScore>=2?68:bestScore>=1?55:30;
 return {category:best,confidence:confidence,hits:hits};
}
function showAutoCategoryPreview(meta){
 var el=$('autoCategoryPreview');if(!el)return;
 var r=autoClassifyVideo(meta);
 el.innerHTML='<span>自動分類</span><span class="cat-pill">'+esc(r.category)+'</span><span class="confidence">信心 '+r.confidence+'%</span>';
 el.classList.remove('hidden');return r;
}
function applyAutoCategory(video,query){
 if(!video||video.categoryManual===true)return video;
 var r=autoClassifyVideo({title:video.title,channel:video.channel,query:query||video.searchQuery||''});
 video.category=r.category;video.autoCategory=true;video.categoryConfidence=r.confidence;video.categoryHits=r.hits;return video;
}

function migrateVideoCategoriesAfterInit(){
 try{
  if(!state||!Array.isArray(state.videos))return;
  state.videos.forEach(function(v){
   if((!v.category||v.category==='其他'||v.category==='YouTube 搜尋')&&!v.categoryManual){
    applyAutoCategory(v,v.searchQuery||'');
   }
  });
 }catch(e){}
}

function ytId(url){
 if(!url)return null;
 var m=url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
 return m?m[1]:(/^[A-Za-z0-9_-]{11}$/.test(url)?url:null);
}
function thumb(id){return 'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'}
function videoById(id){return state.videos.find(function(v){return v.id===id})}
function allowedVideo(v){
 if(!state.whitelist.enabled)return true;
 if(!v.channel)return false;
 var c=v.channel.trim().toLowerCase();
 return state.whitelist.channels.some(function(x){return x.trim().toLowerCase()===c});
}
function availableVideos(){return state.videos.filter(allowedVideo)}


var ytApiScriptRequested=false;
function loadYouTubeApiAsync(){
 if(ytApiScriptRequested)return;
 ytApiScriptRequested=true;

 // API may already exist because of browser cache or another script.
 if(window.YT && window.YT.Player){
  ytApiReady=true;
  return;
 }

 try{
  var s=document.createElement('script');
  s.src='https://www.youtube.com/iframe_api';
  s.async=true;
  s.defer=true;
  s.onerror=function(){
   // Do not break the UI. Playback will use the direct iframe fallback.
   ytApiReady=false;
  };
  document.head.appendChild(s);
 }catch(e){
  ytApiReady=false;
 }
}

window.onYouTubeIframeAPIReady=function(){
 ytApiReady=true;
 if(pendingVideo){
  var p=pendingVideo;
  pendingVideo=null;
  createVisiblePlayer(p.id);
 }
};
function playerVars(){
 var vars={playsinline:1,rel:0,modestbranding:1,autoplay:1};
 if(location.protocol==='http:'||location.protocol==='https:')vars.origin=location.origin;
 return vars;
}
function clearPlayerFallbackTimer(){
 if(playerFallbackTimer){clearTimeout(playerFallbackTimer);playerFallbackTimer=null}
}
function rebuildPlayerHost(){
 clearPlayerFallbackTimer();
 try{if(player&&player.destroy)player.destroy()}catch(e){}
 player=null;playerReady=false;playerCreating=false;playerMode='none';
 var old=$('player');
 if(old){var host=document.createElement('div');host.id='player';old.parentNode.replaceChild(host,old)}
}
function directEmbedUrl(id){
 var q=['playsinline=1','rel=0','autoplay=1','enablejsapi=1'];
 if(location.protocol==='http:'||location.protocol==='https:')q.push('origin='+encodeURIComponent(location.origin));
 return 'https://www.youtube.com/embed/'+encodeURIComponent(id)+'?'+q.join('&');
}
function createDirectIframe(id,reason){
 if(!id)return;
 showPlayer();
 clearPlayerFallbackTimer();
 try{if(player&&player.destroy)player.destroy()}catch(e){}
 player=null;playerReady=false;playerCreating=false;playerMode='iframe';
 var host=$('player');if(!host)return;
 host.innerHTML='';
 var f=document.createElement('iframe');
 f.id='ytDirectFrame';f.title='YouTube video player';f.src=directEmbedUrl(id);
 f.setAttribute('frameborder','0');f.setAttribute('allowfullscreen','');
 f.setAttribute('allow','autoplay; encrypted-media; picture-in-picture; web-share');
 f.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
 f.style.width='100%';f.style.height='100%';f.style.display='block';
 host.appendChild(f);
 $('playerSection').classList.remove('player-booting');
 if($('relatedStatus'))$('relatedStatus').textContent=reason==='timeout'?'已切換相容播放模式':'相容播放模式';
 lastRelatedId=id;
 setTimeout(function(){if(currentId===id)loadRelatedVideos(id)},900);
}
function scheduleDirectFallback(id){
 clearPlayerFallbackTimer();
 playerFallbackTimer=setTimeout(function(){
  if(currentId===id&&!playerReady)createDirectIframe(id,'timeout');
 },LEGACY_IPAD?2200:3500);
}
function createVisiblePlayer(id){
 if(!id)return;
 showPlayer();
 if(!ytApiReady||!window.YT||!YT.Player){pendingVideo={id:id};$('playerSection').classList.add('player-booting');scheduleDirectFallback(id);return}
 if(playerCreating)return;
 playerCreating=true;playerMode='api';
 $('playerSection').classList.add('player-booting');
 scheduleDirectFallback(id);
 try{
  player=new YT.Player('player',{
   height:'390',width:'640',videoId:id,playerVars:playerVars(),
   events:{
    onReady:function(e){
     if(currentId!==id)return;
     clearPlayerFallbackTimer();playerReady=true;playerCreating=false;playerMode='api';
     $('playerSection').classList.remove('player-booting');startUsageTracking();
     try{e.target.playVideo()}catch(ignore){}
    },
    onStateChange:onState,onError:onErr
   }
  });
 }catch(e){playerCreating=false;createDirectIframe(id,'create-error')}
}
function playSelectedId(id){
 if(!id)return;
 showPlayer();
 if(playerMode==='iframe'){
  var f=$('ytDirectFrame');
  if(f){f.src=directEmbedUrl(id);lastRelatedId=id;setTimeout(function(){if(currentId===id)loadRelatedVideos(id)},900);return}
 }
 if(!ytApiReady){pendingVideo={id:id};$('playerSection').classList.add('player-booting');scheduleDirectFallback(id);return}
 if(!player||!playerReady){rebuildPlayerHost();createVisiblePlayer(id);return}
 try{player.loadVideoById(id);setTimeout(function(){try{player.playVideo()}catch(e){}},80)}catch(e){createDirectIframe(id,'load-error')}
}
function sendDirectCommand(func){
 var f=$('ytDirectFrame');if(!f||!f.contentWindow)return;
 try{f.contentWindow.postMessage(JSON.stringify({event:'command',func:func,args:[]}), '*')}catch(e){}
}
function onState(e){
 if(e.data===YT.PlayerState.PLAYING){
  setTimeout(updateStoredVideoMetaFromPlayer,300);
  if(currentId&&lastRelatedId!==currentId){
   lastRelatedId=currentId;
   setTimeout(function(){loadRelatedVideos(currentId)},500);
  }
 }else if(e.data===YT.PlayerState.CUED){
  setTimeout(updateStoredVideoMetaFromPlayer,300);
 }
 if(e.data===YT.PlayerState.ENDED)handleVideoEnded();
}

function handleVideoEnded(){
 if(state.playback&&state.playback.loopCurrent){
  try{
   if(player&&player.seekTo){player.seekTo(0,true);player.playVideo();return}
  }catch(e){}
  if(currentId){playSelectedId(currentId);return}
 }
 var next=null;
 for(var i=0;i<relatedItems.length;i++){
  if(relatedItems[i]&&relatedItems[i].id!==currentId){next=relatedItems[i];break}
 }
 if(next){
  playInsideWatchVideo(next,relatedItems);
  return;
 }
 nextVideo();
}

function onErr(e){
 var msg='YouTube 播放錯誤：'+e.data;
 if(e.data===153)msg='錯誤 153：請從 GitHub Pages / HTTPS 網址開啟。';
 if(e.data===101||e.data===150)msg='這部影片的頻道禁止外部嵌入，請換另一部影片。';
 if(e.data===100)msg='影片不存在、已刪除或私人影片。';
 if($('relatedStatus'))$('relatedStatus').textContent=msg;
 alert(msg);
 if(e.data===2||e.data===5){var retry=currentId;if(retry)createDirectIframe(retry,'api-error')}
}

function isBedtime(){
 if(!state.bedtime.enabled)return false;
 var now=new Date(),cur=now.getHours()*60+now.getMinutes();
 function mins(t){var a=t.split(':');return parseInt(a[0],10)*60+parseInt(a[1],10)}
 var s=mins(state.bedtime.start),e=mins(state.bedtime.end);
 return s<e?(cur>=s&&cur<e):(cur>=s||cur<e);
}
function usageSeconds(){return profile().usage[todayKey()]||0}
function remainingSeconds(){var lim=profile().dailyLimit||0;return lim?Math.max(0,lim*60-usageSeconds()):Infinity}
function canPlay(){
 if(isBedtime()){alert('現在是睡前鎖定時間，請先休息。');return false}
 if(remainingSeconds()<=0){alert('今天的觀看時間已經用完了。');return false}
 return true;
}
function startUsageTracking(){
 if(usageTick)clearInterval(usageTick);
 lastUsageStamp=Date.now();
 usageTick=setInterval(function(){
  if(!player||!currentId){lastUsageStamp=Date.now();return}
  try{
   if(player.getPlayerState()===YT.PlayerState.PLAYING){
    var now=Date.now(),delta=Math.max(0,Math.min(3,Math.round((now-lastUsageStamp)/1000))),k=todayKey();
    profile().usage[k]=(profile().usage[k]||0)+delta;
    var dur=player.getDuration(),cur=player.getCurrentTime();
    if(dur>0&&cur>2)profile().progress[currentId]={current:Math.floor(cur),duration:Math.floor(dur),updated:Date.now()};
    save();updateUsageUI();
    if(remainingSeconds()<=0){player.pauseVideo();alert('今天的觀看時間到了，請休息一下。')}
   }
  }catch(e){}
  lastUsageStamp=Date.now();
 },1000);
}
function updateUsageUI(){
 var used=Math.floor(usageSeconds()/60),rem=remainingSeconds();
 if($('dailyUsed'))$('dailyUsed').textContent=used+' 分';
 if($('dailyRemain'))$('dailyRemain').textContent=rem===Infinity?'不限':Math.ceil(rem/60)+' 分';
 if($('watchStatus'))$('watchStatus').textContent='今日已看 '+used+' 分鐘'+(rem===Infinity?'':'，剩餘 '+Math.ceil(rem/60)+' 分鐘');
}


function isPlayerActuallyPlaying(){
 try{return !!(player&&player.getPlayerState&&player.getPlayerState()===YT.PlayerState.PLAYING)}catch(e){return !!currentId}
}
function setMiniPlayer(on){
 if(!$('playerSection')||!$('playerStage'))return;
 if(immersiveFull||miniPlayerSuppressed||!currentId)on=false;
 miniPlayerActive=!!on;
 $('playerSection').classList.toggle('mini-active',miniPlayerActive);
}
function updateMiniPlayerOnScroll(){
 if(!$('playerSection')||$('playerSection').classList.contains('hidden')){setMiniPlayer(false);return}
 if(immersiveFull||miniPlayerSuppressed||!currentId){setMiniPlayer(false);return}
 var stage=$('playerMiniSpacer')||$('playerStage');
 if(!stage)return;
 var rect=stage.getBoundingClientRect();
 var threshold=70;
 var leftViewport = rect.bottom < threshold;
 if(leftViewport && isPlayerActuallyPlaying())setMiniPlayer(true);
 else if(rect.top < window.innerHeight && rect.bottom > 0)setMiniPlayer(false);
}
function bindMiniPlayerScroll(){
 try{
  if(miniScrollBound)return;
  miniScrollBound=true;
  var ticking=false;
  function onScroll(){
   if(ticking)return;
   ticking=true;
   var raf=window.requestAnimationFrame||function(fn){return setTimeout(fn,16)};
   raf(function(){ticking=false;updateMiniPlayerOnScroll()});
  }
  try{window.addEventListener('scroll',onScroll,{passive:true})}
  catch(e){window.addEventListener('scroll',onScroll,false)}
  window.addEventListener('resize',onScroll,false);
 }catch(e){
  miniScrollBound=false;
 }
}
function closeMiniPlayer(){
 miniPlayerSuppressed=true;
 setMiniPlayer(false);
 try{if(player&&player.pauseVideo)player.pauseVideo()}catch(e){}
}


var sidebarFilter='favorites';

function sidebarItems(filter){
 var p=profile(),all=availableVideos(),list=[];
 if(filter==='favorites'){
  list=p.favorites.map(videoById).filter(function(v){return v&&allowedVideo(v)});
 }else if(filter==='recent'){
  list=p.recent.map(videoById).filter(function(v){return v&&allowedVideo(v)});
 }else if(filter==='recommended'){
  list=all.filter(function(v){return v.recommended});
 }else{
  list=all.filter(function(v){return v.category===filter});
 }
 return list.slice(0,30);
}

function renderSidebar(filter){
 if(filter)sidebarFilter=filter;
 var root=$('sidebarVideoList');
 if(!root)return;
 document.querySelectorAll('.side-filter').forEach(function(b){
  b.classList.toggle('active',b.dataset.sidefilter===sidebarFilter);
 });
 var list=sidebarItems(sidebarFilter);
 root.innerHTML='';
 if(!list.length){
  root.innerHTML='<div class="sidebar-empty">這個分類目前沒有影片</div>';
  return;
 }
 var frag=document.createDocumentFragment();
 list.forEach(function(v){
  var item=document.createElement('button');
  item.type='button';
  item.className='sidebar-video-item'+(v.id===currentId?' playing':'');
  item.innerHTML='<img src="'+thumb(v.id)+'" alt=""><span class="sidebar-video-copy"><b>'+esc(v.title)+'</b><small>'+esc(v.channel||v.category||'影片')+'</small></span>';
  item.onclick=function(){playInsideWatchVideo(v,list)};
  frag.appendChild(item);
 });
 root.appendChild(frag);
}

function bindSidebar(){
 document.querySelectorAll('.side-filter').forEach(function(b){
  b.onclick=function(){renderSidebar(b.dataset.sidefilter)};
 });
}

function showPlayer(){document.body.classList.add('watch-mode');miniPlayerSuppressed=false;$('kidsHome').classList.add('hidden');$('hero').classList.add('hidden');$('playerSection').classList.remove('hidden');renderSidebar(sidebarFilter);bindMiniPlayerScroll();setTimeout(updateMiniPlayerOnScroll,60);setTimeout(function(){if(currentId&&$('playerSection')&&!$('playerSection').classList.contains('hidden')){try{window.scrollTo(0,0)}catch(e){}}},0)}

function stopPlaybackForHome(){
 // 1) Normal YouTube IFrame API player.
 try{
  if(player && typeof player.stopVideo==='function'){
   player.stopVideo();
  }else if(player && typeof player.pauseVideo==='function'){
   player.pauseVideo();
  }
 }catch(e){}

 // 2) Direct/fallback iframe mode used on older Safari/iPad.
 try{
  var direct=document.getElementById('ytDirectFrame');
  if(direct){
   direct.src='about:blank';
   if(direct.parentNode)direct.parentNode.removeChild(direct);
  }
 }catch(e){}

 // 3) Any iframe still remaining inside the player host.
 try{
  var host=$('player');
  if(host){
   var frames=host.querySelectorAll('iframe');
   for(var i=0;i<frames.length;i++){
    try{frames[i].src='about:blank'}catch(e){}
   }
  }
 }catch(e){}

 pendingVideo=null;
 currentId=null;
 currentIndex=-1;
 lastRelatedId='';
 if($('nowPlaying'))$('nowPlaying').textContent='尚未選擇影片';
 if($('relatedGrid'))$('relatedGrid').innerHTML='';
 if($('relatedStatus'))$('relatedStatus').textContent='';
}

function showHome(){
 document.body.classList.remove('watch-mode');
 setMiniPlayer(false);miniPlayerSuppressed=false;
 stopPlaybackForHome();clearPlayerFallbackTimer();if(playerMode==='iframe')sendDirectCommand('pauseVideo');else if(player&&playerReady){try{player.pauseVideo()}catch(e){}}if($('playerSection'))$('playerSection').classList.remove('player-booting');if(immersiveFull)exitImmersiveFullscreen();if($('parentPanel'))$('parentPanel').classList.add('hidden');parentOpen=false;$('playerSection').classList.add('hidden');$('hero').classList.remove('hidden');$('kidsHome').classList.remove('hidden');renderRows();updateUsageUI()}
function playInsideWatchVideo(v,list){if(!v||!v.id)return;selectVideo(v.id,list&&list.length?list:[v])}
function selectVideo(id,list){
 if(!canPlay()||!id)return;

 // Search/related results are temporary playable items and should not be removed
 // by the saved-library channel whitelist.
 currentList=(list&&list.length?list.slice():availableVideos().slice());
 if(!currentList.some(function(v){return v&&v.id===id})){
  currentList=[{id:id,title:'YouTube 影片',channel:'',category:'YouTube 搜尋'}].concat(currentList);
 }
 currentIndex=currentList.findIndex(function(v){return v&&v.id===id});
 currentId=id;
 lastRelatedId='';
 showPlayer();

 var ctx=null;
 for(var i=0;i<currentList.length;i++){if(currentList[i]&&currentList[i].id===id){ctx=currentList[i];break}}
 var saved=videoById(id);
 var title=(saved&&saved.title)||(ctx&&ctx.title)||(quickMeta.id===id&&quickMeta.title)||'正在載入影片…';
 $('nowPlaying').textContent=title;
 if($('relatedStatus'))$('relatedStatus').textContent='影片開始播放後會載入相關影片';
 if($('relatedGrid'))$('relatedGrid').innerHTML='';

 // Playback gets priority. Related-video network work starts only after PLAYING.
 playSelectedId(id);

 addRecent(id);
 renderSidebar(sidebarFilter);
 updateFavBtn();
 updateLoopBtn();
 updateHero();
}
function addRecent(id){var p=profile();p.recent=p.recent.filter(function(x){return x!==id});p.recent.unshift(id);p.recent=p.recent.slice(0,40);save()}
function nextVideo(){if(!currentList.length)return;if(currentIndex<0)currentIndex=0;else currentIndex=(currentIndex+1)%currentList.length;selectVideo(currentList[currentIndex].id,currentList)}
function prevVideo(){if(!currentList.length)return;if(currentIndex<0)currentIndex=0;else currentIndex=(currentIndex-1+currentList.length)%currentList.length;selectVideo(currentList[currentIndex].id,currentList)}

var VIDEO_CATEGORIES=['英文','兒歌','卡通','故事','學習','自然／動物','其他'];

function ensureFavoriteId(id){
 if(!id)return;
 var p=profile();
 if(p.favorites.indexOf(id)<0)p.favorites.unshift(id);
}

function saveVideoAsFavorite(video,category){
 if(!video||!video.id)return null;
 var existing=videoById(video.id);
 if(!existing){
  existing={
   id:video.id,
   title:video.title||'YouTube 影片',
   channel:video.channel||'',
   category:category||video.category||'其他',
   recommended:false,
   addedAt:Date.now()
  };
  state.videos.push(existing);
 }else{
  if(video.title&&(!existing.title||existing.title==='YouTube 影片'))existing.title=video.title;
  if(video.channel&&!existing.channel)existing.channel=video.channel;
  if(category)existing.category=category;
 }
 if(category){
  existing.category=category;
  existing.categoryManual=true;
  existing.autoCategory=false;
 }else if(!existing.category||existing.category==='其他'||existing.category==='YouTube 搜尋'){
  applyAutoCategory(existing,video.searchQuery||'');
 }
 ensureFavoriteId(existing.id);
 save();
 renderRows();
 renderSidebar('favorites');
 updateFavBtn();
 return existing;
}

function categoryPickerHtml(selected){
 return '<div class="search-category-picker"><span>分類</span><select class="category-select">'+
  VIDEO_CATEGORIES.map(function(c){return '<option'+(c===selected?' selected':'')+'>'+esc(c)+'</option>'}).join('')+
  '</select><button class="category-save" type="button">確定</button></div>';
}

function toggleFav(){
 if(!currentId)return;
 var p=profile(),i=p.favorites.indexOf(currentId);
 if(i>=0){
  p.favorites.splice(i,1);
  save();
 }else{
  var saved=videoById(currentId),ctx=currentVideoContext(currentId);
  if(!saved&&ctx)saveVideoAsFavorite(ctx,null);
  else{ensureFavoriteId(currentId);save()}
 }
 updateFavBtn();renderRows();renderSidebar('favorites');
}

function updateLoopBtn(){
 var on=!!(state.playback&&state.playback.loopCurrent);
 if($('loopBtn')){
  $('loopBtn').textContent=on?'🔁 循環：開':'🔁 循環：關';
  $('loopBtn').classList.toggle('active',on);
  $('loopBtn').setAttribute('aria-pressed',on?'true':'false');
 }
}
function toggleLoopPlayback(){
 if(!state.playback)state.playback={loopCurrent:false};
 state.playback.loopCurrent=!state.playback.loopCurrent;
 if($('loopCurrentEnabled'))$('loopCurrentEnabled').checked=state.playback.loopCurrent;
 save();
 updateLoopBtn();
}

function updateFavBtn(){var yes=currentId&&profile().favorites.indexOf(currentId)>=0;$('favBtn').textContent=yes?'★ 已收藏':'☆ 最愛'}
function resumeVideo(id,list){var pr=profile().progress[id];selectVideo(id,list);if(pr&&pr.current>5&&player)setTimeout(function(){try{player.seekTo(pr.current,true)}catch(e){}},800)}
function makeCard(v,opts){
 opts=opts||{};var card=document.createElement('div');card.className='video-card';
 var p=profile().progress[v.id],pct=0;if(p&&p.duration>0)pct=Math.min(100,Math.round(p.current/p.duration*100));
 card.innerHTML='<div class="thumb-wrap"><img src="'+thumb(v.id)+'"><span class="badge">'+esc(opts.badge||v.category||'影片')+'</span></div>'+
 '<div class="body"><h3>'+esc(v.title)+'</h3><div class="card-meta">'+esc(v.channel||'')+(pct?' · 已觀看 '+pct+'%':'')+'</div>'+(v.autoCategory?'<span class="card-auto-cat">自動 · '+esc(v.category||'其他')+'</span>':'')+'</div>';
 card.onclick=function(){opts.resume?resumeVideo(v.id,opts.list):selectVideo(v.id,opts.list)};return card;
}
function addRow(title,list,sub,opts){
 if(!list||!list.length)return;var sec=document.createElement('section');sec.className='media-row';
 sec.innerHTML='<div class="row-head"><h2>'+esc(title)+'</h2><span>'+esc(sub||'')+'</span></div>';
 var car=document.createElement('div');car.className='carousel';list.forEach(function(v){car.appendChild(makeCard(v,Object.assign({list:list},opts||{})))});sec.appendChild(car);$('dynamicRows').appendChild(sec);
}
function renderRows(filter){
 var root=$('dynamicRows');root.innerHTML='';var p=profile(),all=availableVideos();
 if(filter==='recommended'){addRow('家長推薦',all.filter(function(v){return v.recommended}),'由家長挑選',{badge:'👍 推薦'});return}
 if(!filter||filter==='all'){
  var cont=p.recent.map(videoById).filter(function(v){if(!v||!allowedVideo(v))return false;var pr=p.progress[v.id];return pr&&pr.current>5&&pr.duration&&pr.current<pr.duration-10}).slice(0,12);
  addRow('繼續觀看',cont,'從上次看到的地方接著看',{resume:true,badge:'繼續'});
  addRow('家長推薦',all.filter(function(v){return v.recommended}).slice(0,16),'家長幫你挑好的內容',{badge:'👍 推薦'});
  addRow('我的最愛',p.favorites.map(videoById).filter(function(v){return v&&allowedVideo(v)}).slice(0,SEARCH_RENDER_LIMIT),'只屬於 '+p.name+' 的收藏',{badge:'★ 最愛'});
  addRow('最近觀看',p.recent.map(videoById).filter(function(v){return v&&allowedVideo(v)}).slice(0,16),'最近點過的影片',{badge:'最近看過'});
  addRow('最近加入',all.slice().sort(function(a,b){return (b.addedAt||0)-(a.addedAt||0)}).slice(0,16),'家長最近新增的內容',{badge:'新加入'});
  /* AUTO_CATEGORY_HOME_ROWS */
  ['英文','兒歌','卡通','故事','學習','自然／動物'].forEach(function(cat){
   var items=all.filter(function(v){return v.category===cat}).slice(0,SEARCH_RENDER_LIMIT);
   if(items.length)addRow(cat,items,'自動分類影片',{badge:cat});
  });
  ['英文','兒歌','卡通','故事','學習'].forEach(function(cat){addRow(cat+'專區',all.filter(function(v){return v.category===cat}).slice(0,SEARCH_RENDER_LIMIT),'',{badge:cat})});
 }else addRow(filter+'專區',all.filter(function(v){return v.category===filter}),'',{badge:filter});
 if(!root.children.length)root.innerHTML='<section class="media-row"><div class="row-head"><h2>目前沒有可顯示的影片</h2></div></section>';
}
function updateHero(){
 var p=profile(),v=p.recent.length?videoById(p.recent[0]):availableVideos()[0];
 $('heroTitle').textContent=v?('繼續看：'+v.title):'今天想看什麼？';$('heroText').textContent='選擇下方分類，或直接播放家長推薦。';updateUsageUI();
}
function renderProfile(){var p=profile();$('profileBtn').textContent=(p.avatar||'🙂')+' '+p.name;updateHero()}
function toggleProfile(){state.activeProfile=state.activeProfile==='daughter'?'son':'daughter';save();renderAll();showHome()}
function applyFilter(type){document.querySelectorAll('.category-chip').forEach(function(b){b.classList.toggle('active',b.dataset.filter===type)});renderRows(type)}



var searchPage=1,lastSearchInstance='',searchBusy=false,searchTapLocked=false;


function isLegacyIPadSafari(){
 var ua=navigator.userAgent||'';
 var isiPad=/iPad/.test(ua) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
 if(!isiPad)return false;
 var m=ua.match(/OS (\d+)_/);
 var major=m?parseInt(m[1],10):0;
 return !major || major<=15;
}
var LEGACY_IPAD=isLegacyIPadSafari();
var SEARCH_RENDER_LIMIT=LEGACY_IPAD?12:20;
var SEARCH_PARALLEL_LIMIT=LEGACY_IPAD?2:3;

function delayMs(ms){
 return new Promise(function(resolve){setTimeout(resolve,ms)});
}

function withTimeout(promise,ms,label){
 return new Promise(function(resolve,reject){
  var done=false;
  var timer=setTimeout(function(){
   if(done)return;
   done=true;
   reject(new Error(label||'搜尋逾時'));
  },ms);
  promise.then(function(v){
   if(done)return;
   done=true;
   clearTimeout(timer);
   resolve(v);
  },function(err){
   if(done)return;
   done=true;
   clearTimeout(timer);
   reject(err);
  });
 });
}
function pad2(n){n=String(n);return n.length<2?'0'+n:n}

function secondsText(sec){
 sec=parseInt(sec||0,10);if(!sec)return '';
 var h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
 return h?(h+':'+pad2(m)+':'+pad2(s)):(m+':'+pad2(s));
}

















var FALLBACK_INVIDIOUS_INSTANCES=[
 'https://inv.nadeko.net',
 'https://invidious.nerdvpn.de',
 'https://yt.chocolatemoo53.com',
 'https://invidious.tiekoetter.com',
 'https://invidious.f5.si'
];
var INVIDIOUS_REGISTRY_URL='https://api.invidious.io/instances.json?sort_by=cors';
var dynamicSearchInstances=[];
var instanceRegistryLoadedAt=0;

function normalizeInstanceRegistry(data){
 var out=[];
 if(!Array.isArray(data))return out;
 data.forEach(function(row){
  try{
   var host='',meta=null;
   if(Array.isArray(row)){
    host=String(row[0]||'');
    meta=row[1]||{};
   }else if(row&&typeof row==='object'){
    host=String(row.domain||row.host||row.name||'');
    meta=row;
   }
   if(!host)return;
   var uri=String((meta&&meta.uri)||('https://'+host));
   var apiOk=(meta&&typeof meta.api!=='undefined')?!!meta.api:true;
   var corsOk=(meta&&typeof meta.cors!=='undefined')?!!meta.cors:true;
   var typeOk=(!meta||!meta.type||meta.type==='https');
   if(apiOk&&corsOk&&typeOk&&uri.indexOf('https://')===0){
    out.push(uri.replace(/\/+$/,''));
   }
  }catch(e){}
 });
 // de-duplicate
 return out.filter(function(x,i,a){return a.indexOf(x)===i});
}

function loadDynamicInstances(force){
 var now=Date.now();
 if(!force && dynamicSearchInstances.length && now-instanceRegistryLoadedAt<30*60*1000){
  return Promise.resolve(dynamicSearchInstances.slice());
 }
 return fetchJsonTimeout(INVIDIOUS_REGISTRY_URL,3500).then(function(data){
  var list=normalizeInstanceRegistry(data);
  if(list.length){
   dynamicSearchInstances=list;
   instanceRegistryLoadedAt=Date.now();
   return list.slice();
  }
  dynamicSearchInstances=FALLBACK_INVIDIOUS_INSTANCES.slice();
  instanceRegistryLoadedAt=Date.now();
  return dynamicSearchInstances.slice();
 },function(){
  dynamicSearchInstances=FALLBACK_INVIDIOUS_INSTANCES.slice();
  instanceRegistryLoadedAt=Date.now();
  return dynamicSearchInstances.slice();
 });
}

var searchPage=1,lastSearchInstance='',searchBusy=false,searchTapLocked=false;

function normalizeSearchItems(j,base){
 var arr=Array.isArray(j)?j:[];
 return arr.filter(function(x){return x&&(!x.type||x.type==='video')&&x.videoId}).map(function(x){
  var id=x.videoId;
  var image='';
  if(x.videoThumbnails&&x.videoThumbnails.length){
   image=x.videoThumbnails[x.videoThumbnails.length-1].url||'';
   if(image.indexOf('//')===0)image='https:'+image;
   if(image.charAt(0)==='/')image=base+image;
  }
  return {
   id:id,
   title:x.title||'YouTube 影片',
   channel:x.author||'',
   seconds:parseInt(x.lengthSeconds||0,10)||0,
   image:image,
   fallback:thumb(id)
  };
 });
}





function fetchJsonTimeout(url,ms){
 return new Promise(function(resolve,reject){
  var done=false;
  var timer=setTimeout(function(){
   if(done)return;
   done=true;
   reject(new Error('timeout'));
  },ms||4500);
  fetch(url,{method:'GET',mode:'cors',cache:'no-store'}).then(function(r){
   if(!r.ok)throw new Error('HTTP '+r.status);
   return r.json();
  }).then(function(j){
   if(done)return;
   done=true;clearTimeout(timer);resolve(j);
  },function(err){
   if(done)return;
   done=true;clearTimeout(timer);reject(err);
  });
 });
}

function fetchInvidiousSearch(base,q,page){
 var query=q+' type:video',dur=$('searchDuration').value;
 if(dur)query+=' duration:'+dur;
 var url=base+'/api/v1/search?q='+encodeURIComponent(query)+'&page='+(page||1)+'&hl=zh-TW';
 return fetchJsonTimeout(url,LEGACY_IPAD?4200:5000).then(function(j){
  var items=normalizeSearchItems(j,base).slice(0,SEARCH_RENDER_LIMIT);
  if(!items.length)throw new Error('no results');
  return {items:items,base:base,provider:'Invidious'};
 });
}



function searchTasks(q,page,instances){
 var tasks=[];
 (instances||[]).forEach(function(base){
  tasks.push(function(){return fetchInvidiousSearch(base,q,page)});
 });
 return tasks;
}

function runSearchPool(tasks){
 return new Promise(function(resolve,reject){
  var idx=0,active=0,failed=0,done=false,total=tasks.length;
  if(!total){reject(new Error('沒有搜尋來源'));return}
  var maxParallel=LEGACY_IPAD?2:3;
  var globalTimer=setTimeout(function(){
   if(done)return;
   done=true;
   reject(new Error('搜尋來源逾時'));
  },LEGACY_IPAD?8500:7000);

  function launch(){
   if(done)return;
   while(active<maxParallel && idx<total){
    var fn=tasks[idx++];active++;
    (function(task){
     task().then(function(res){
      if(done)return;
      done=true;clearTimeout(globalTimer);resolve(res);
     },function(){
      active--;failed++;
      if(done)return;
      if(failed>=total){
       done=true;clearTimeout(globalTimer);
       reject(new Error('目前搜尋來源都沒有回應'));
       return;
      }
      setTimeout(launch,LEGACY_IPAD?100:10);
     });
    })(fn);
   }
  }
  launch();
 });
}

function renderInternalSearch(items,append){
 var root=$('homeSearchResults');
 if(!append)root.innerHTML='';
 var frag=document.createDocumentFragment();
 var queryValue=$('homeSearchInput').value||'';

 items.slice(0,SEARCH_RENDER_LIMIT).forEach(function(v){
  var card=document.createElement('div');
  card.className='search-result-card';
  card.innerHTML='<div class="search-thumb"><img alt="" loading="lazy"><span class="search-duration">'+esc(secondsText(v.seconds))+'</span></div>'+
   '<div class="search-result-actions"><button class="play">▶ 播放</button><button class="add">＋ 收藏</button></div>'+
   '<div class="search-category-slot"></div>'+
   '<div class="search-result-body"><div class="search-result-title">'+esc(v.title)+'</div>'+
   '<div class="search-result-channel">'+esc(v.channel)+'</div></div>';

  var img=card.querySelector('.search-thumb img');
  var primary=v.image||v.fallback||thumb(v.id),fallback=v.fallback||thumb(v.id);
  img.onerror=function(){
   if(this.getAttribute('data-fallback-used')==='1')return;
   this.setAttribute('data-fallback-used','1');this.src=fallback;
  };
  setTimeout(function(){img.src=primary},LEGACY_IPAD?80:0);

  var temp={id:v.id,title:v.title,channel:v.channel,category:'YouTube 搜尋',searchQuery:queryValue};
  card.querySelector('.search-thumb').onclick=function(){playInsideWatchVideo(temp,[temp])};
  card.querySelector('.play').onclick=function(){playInsideWatchVideo(temp,[temp])};

  var addBtn=card.querySelector('.add'),slot=card.querySelector('.search-category-slot');
  addBtn.onclick=function(){
   var auto=autoClassifyVideo({title:v.title,channel:v.channel,query:queryValue});
   saveVideoAsFavorite(temp,auto.category);
   addBtn.textContent='★ 已收藏';
   addBtn.disabled=true;
   slot.innerHTML=categoryPickerHtml(auto.category);
   var sel=slot.querySelector('.category-select');
   slot.querySelector('.category-save').onclick=function(){
    saveVideoAsFavorite(temp,sel.value);
    slot.innerHTML='<div class="category-saved">✓ 已分類：'+esc(sel.value)+'</div>';
   };
  };
  if(profile().favorites.indexOf(v.id)>=0){
   addBtn.textContent='★ 已收藏';addBtn.disabled=true;
   var existing=videoById(v.id);
   slot.innerHTML='<div class="category-saved">分類：'+esc(existing&&existing.category?existing.category:'其他')+'</div>';
  }
  frag.appendChild(card);
 });
 root.appendChild(frag);
}

function fetchSearchWithFallback(q,page){
 $('searchNodeStatus').textContent='正在取得目前可用搜尋來源…';
 return loadDynamicInstances(false).then(function(instances){
  if(!instances.length)throw new Error('目前沒有可用搜尋來源');
  $('searchNodeStatus').textContent='正在系統內搜尋… 可用來源 '+instances.length+' 個';
  return runSearchPool(searchTasks(q,page,instances));
 },function(){
  return runSearchPool(searchTasks(q,page,FALLBACK_INVIDIOUS_INSTANCES));
 });
}

function runInternalSearch(reset){
 if(searchBusy)return;
 var input=$('homeSearchInput'),q=input.value.trim();
 if(!q){input.focus();return}

 if(reset){
  searchPage=1;
  $('homeSearchResults').innerHTML='<div class="search-loading">正在搜尋影片…</div>';
 }else{
  searchPage++;
 }
 searchBusy=true;
 $('homeSearchBtn').disabled=true;
 $('searchMoreBtn').classList.add('hidden');

 fetchSearchWithFallback(q,searchPage).then(function(res){
  searchBusy=false;
  $('homeSearchBtn').disabled=false;
  lastSearchInstance=res.base;
  renderInternalSearch(res.items,!reset);
  $('searchNodeStatus').textContent='已顯示 '+res.items.length+' 部結果 · '+res.provider;
  $('searchMoreBtn').classList.remove('hidden');
 },function(err){
  // One final refresh of the official instance registry before giving up.
  loadDynamicInstances(true).then(function(instances){
   return runSearchPool(searchTasks(q,searchPage,instances));
  }).then(function(res2){
   searchBusy=false;
   $('homeSearchBtn').disabled=false;
   lastSearchInstance=res2.base;
   renderInternalSearch(res2.items,!reset);
   $('searchNodeStatus').textContent='已顯示 '+res2.items.length+' 部結果 · '+res2.provider+'（已更新來源）';
   $('searchMoreBtn').classList.remove('hidden');
  },function(){
   searchBusy=false;
   $('homeSearchBtn').disabled=false;
   if(reset)$('homeSearchResults').innerHTML='<div class="search-loading">目前公開搜尋來源暫時無法使用，稍後再試。</div>';
   $('searchNodeStatus').innerHTML='<span class="api-err">目前搜尋來源都沒有回應</span>';
  });
 });
}

function resetQuickPreview(){quickMeta={id:'',title:'',channel:''};$('quickPreview').classList.add('hidden');if($('autoCategoryPreview'))$('autoCategoryPreview').classList.add('hidden')}
function showQuickPreview(id,title,channel){quickMeta={id:id,title:title||'YouTube 影片',channel:channel||''};$('quickPreviewImg').src=thumb(id);$('quickPreviewTitle').textContent=quickMeta.title;$('quickPreviewChannel').textContent=quickMeta.channel;$('quickPreview').classList.remove('hidden');showAutoCategoryPreview({title:quickMeta.title,channel:quickMeta.channel,query:''})}
function fetchOEmbedMeta(id){
 var u='https://www.youtube.com/oembed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)+'&format=json';
 return fetch(u,{mode:'cors'}).then(function(r){if(!r.ok)throw new Error('oEmbed');return r.json()}).then(function(j){return {title:j.title||'YouTube 影片',channel:j.author_name||''}});
}
function inspectQuickUrl(){
 var url=$('quickUrlInput').value.trim(),id=ytId(url);
 if(!url){resetQuickPreview();$('quickAddStatus').textContent='';return}
 if(!id){resetQuickPreview();$('quickAddStatus').textContent='這不是可辨識的 YouTube 影片網址。';return}
 showQuickPreview(id,'正在取得影片名稱…','');$('quickAddStatus').textContent='已辨識影片，正在讀取資訊…';
 fetchOEmbedMeta(id).then(function(m){if(ytId($('quickUrlInput').value.trim())!==id)return;showQuickPreview(id,m.title,m.channel);$('quickAddStatus').innerHTML='<span class="ok">✓ 已取得影片資訊。</span>'})
 .catch(function(){if(ytId($('quickUrlInput').value.trim())!==id)return;showQuickPreview(id,'YouTube 影片','');$('quickAddStatus').innerHTML='<span class="warn">已辨識影片；標題抓不到也可正常播放。</span>'});
}
function getQuickVideo(){
 var id=ytId($('quickUrlInput').value.trim());if(!id){$('quickAddStatus').textContent='這不是可辨識的 YouTube 影片網址。';return null}
 var m=quickMeta.id===id?quickMeta:{id:id,title:'YouTube 影片',channel:''};
 return {id:id,title:m.title||'YouTube 影片',channel:m.channel||'',category:$('quickCategory').value};
}
function quickPlayHome(){var v=getQuickVideo();if(v)selectVideo(v.id,[v])}
function quickAddHome(){
 var v=getQuickVideo();if(!v)return;
 var cat=v.category||'其他';
 saveVideoAsFavorite(v,cat);
 $('quickAddStatus').innerHTML='<span class="ok">✓ 已收藏到影片庫與快速選片：'+esc(v.title)+'</span>';
}
function updateStoredVideoMetaFromPlayer(){
 if(!player||!currentId||!player.getVideoData)return;
 try{
  var d=player.getVideoData(),title=d&&d.title||'',author=d&&d.author||'',v=videoById(currentId);
  if(v){if(title&&(!v.title||v.title==='YouTube 影片'||v.title==='新影片'))v.title=title;if(author&&!v.channel)v.channel=author;save();renderRows();renderManage()}
  if(quickMeta.id===currentId){if(title)quickMeta.title=title;if(author)quickMeta.channel=author;if(!$('quickPreview').classList.contains('hidden')){ $('quickPreviewTitle').textContent=quickMeta.title;$('quickPreviewChannel').textContent=quickMeta.channel;}}
 }catch(e){}
}


function enterImmersiveFullscreen(){
 setMiniPlayer(false);
 var el=$('playerSection');
 immersiveFull=true;
 el.classList.add('immersive-fullscreen');
 document.body.classList.add('ft-no-scroll');
 $('fullBtn').textContent='✕ 退出全螢幕';

 // Use CSS immersive fullscreen as the primary path for iPad/Safari reliability.
 // Desktop browsers may still use native fullscreen when available.
 var ua=navigator.userAgent||'';
 var isiOS=/iPad|iPhone|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);
 if(!isiOS){
  try{
   if(el.requestFullscreen&&!document.fullscreenElement){
    var p=el.requestFullscreen();
    if(p&&p.catch)p.catch(function(){});
   }
  }catch(e){}
 }
}
function exitImmersiveFullscreen(){
 immersiveFull=false;
 $('playerSection').classList.remove('immersive-fullscreen');
 document.body.classList.remove('ft-no-scroll');
 $('fullBtn').textContent='⛶ 全螢幕';setTimeout(updateMiniPlayerOnScroll,80);
 try{
  if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(function(){});
  else if(document.webkitFullscreenElement&&document.webkitExitFullscreen)document.webkitExitFullscreen();
 }catch(e){}
}
function toggleImmersiveFullscreen(){immersiveFull?exitImmersiveFullscreen():enterImmersiveFullscreen()}
function currentVideoContext(id){
 var v=videoById(id);
 if(v)return v;
 for(var i=0;i<currentList.length;i++)if(currentList[i]&&currentList[i].id===id)return currentList[i];
 if(quickMeta.id===id)return {id:id,title:quickMeta.title||'YouTube 影片',channel:quickMeta.channel||''};
 return {id:id,title:$('nowPlaying').textContent||'YouTube 影片',channel:''};
}
function normalizeRelatedItems(items,base){
 if(!Array.isArray(items))return [];
 return items.filter(function(x){return x&&x.videoId&&x.videoId!==currentId}).map(function(x){
  var img='';
  if(x.videoThumbnails&&x.videoThumbnails.length){var t=x.videoThumbnails[x.videoThumbnails.length-1]||x.videoThumbnails[0];img=t&&t.url?t.url:''}
  if(img){if(img.indexOf('//')===0)img='https:'+img;else if(img.charAt(0)==='/'&&base)img=base.replace(/\/$/,'')+img}
  return {id:x.videoId,title:x.title||'YouTube 影片',channel:x.author||'',seconds:x.lengthSeconds||0,image:img,fallback:thumb(x.videoId),category:'YouTube 相關'};
 });
}
function fetchRelatedFromInstance(base,id){
 var url=base+'/api/v1/videos/'+encodeURIComponent(id)+'?hl=zh-TW';
 return fetch(url,{method:'GET',mode:'cors',cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(function(j){
  var items=normalizeRelatedItems(j.recommendedVideos||[],base);
  if(!items.length)throw new Error('沒有推薦影片');
  return {items:items,base:base};
 });
}
function fetchRelatedWithFallback(id){
 return loadDynamicInstances(false).then(function(instances){
  var order=(instances&&instances.length?instances:FALLBACK_INVIDIOUS_INSTANCES).slice();
  if(lastSearchInstance){
   order=order.filter(function(x){return x!==lastSearchInstance});
   order.unshift(lastSearchInstance);
  }
  var i=0;
  function next(){
   if(i>=order.length)return Promise.reject(new Error('推薦節點暫時無法使用'));
   var base=order[i++];
   return fetchRelatedFromInstance(base,id).catch(function(){return next()});
  }
  return next();
 });
}
function renderRelated(items){
 relatedItems=(items||[]).slice();
 var root=$('relatedGrid');root.innerHTML='';
 items.slice(0,18).forEach(function(v){
  var card=document.createElement('button');card.type='button';card.className='related-card';
  card.innerHTML='<div class="related-thumb"><img src="'+esc(v.image||v.fallback||thumb(v.id))+'" alt=""><span class="related-duration">'+esc(secondsText(v.seconds))+'</span></div><div class="related-body"><div class="related-title">'+esc(v.title)+'</div><div class="related-channel">'+esc(v.channel)+'</div></div>';
  var im=card.querySelector('img');im.onerror=function(){this.onerror=null;this.src=v.fallback||thumb(v.id)};
  card.onclick=function(){playInsideWatchVideo(v,[v])};
  root.appendChild(card);
 });
}
function loadRelatedVideos(id){
 if(!id)return;
 var requestId=id;
 relatedBusy=true;
 if($('relatedStatus'))$('relatedStatus').textContent='正在找相關影片…';
 if($('relatedGrid'))$('relatedGrid').innerHTML='';
 fetchRelatedWithFallback(id).then(function(res){
  if(currentId!==requestId)return;
  lastSearchInstance=res.base;
  renderRelated(res.items);
  $('relatedStatus').textContent='依目前影片推薦';
 }).catch(function(){
  if(currentId!==requestId)return Promise.resolve();
  var ctx=currentVideoContext(id),q=(ctx.title||'').replace(/[\[\]()【】]/g,' ').trim();
  if(!q){$('relatedStatus').textContent='目前沒有相關影片';return Promise.resolve()}
  return fetchSearchWithFallback(q,1).then(function(res){
   if(currentId!==requestId)return;
   var items=res.items.filter(function(v){return v.id!==id}).slice(0,12);
   renderRelated(items);
   $('relatedStatus').textContent='依影片內容找到的相似影片';
  }).catch(function(){
   if(currentId===requestId)$('relatedStatus').textContent='目前無法取得相關影片';
  });
 }).then(function(v){relatedBusy=false;return v},function(e){relatedBusy=false;throw e});
}

function askPin(cb){modalCb=cb;$('modal').classList.remove('hidden');$('modalInput').value='';$('modalInput').focus()}
function closeModal(v){$('modal').classList.add('hidden');if(modalCb){var f=modalCb;modalCb=null;f(v)}}
function openParent(){
 if($('loopCurrentEnabled'))$('loopCurrentEnabled').checked=!!(state.playback&&state.playback.loopCurrent);if(parentOpen){closeParent();return}askPin(function(ok){if(ok){parentOpen=true;$('kidsHome').classList.add('hidden');$('hero').classList.add('hidden');$('playerSection').classList.add('hidden');$('parentPanel').classList.remove('hidden');loadParentFields();renderManage()}})}
function closeParent(){parentOpen=false;$('parentPanel').classList.add('hidden');showHome()}
function setKidMode(){if(!kidMode){kidMode=true;$('parentBtn').classList.add('hidden');$('kidModeBtn').textContent='🧒 兒童模式：開'}else askPin(function(ok){if(ok){kidMode=false;$('parentBtn').classList.remove('hidden');$('kidModeBtn').textContent='🧒 兒童模式'}})}
function loadParentFields(){
 $('profileSelect').value=state.activeProfile;var p=profile();$('profileNameInput').value=p.name;selectedAvatar=p.avatar||'🙂';
 document.querySelectorAll('.avatar-grid button').forEach(function(b){b.classList.toggle('active',b.dataset.avatar===selectedAvatar)});
 $('dailyLimit').value=String(p.dailyLimit||0);$('bedEnabled').checked=!!state.bedtime.enabled;$('bedStart').value=state.bedtime.start;$('bedEnd').value=state.bedtime.end;
 $('whitelistEnabled').checked=!!state.whitelist.enabled;$('whitelistInput').value=(state.whitelist.channels||[]).join('\n');
}
function saveProfileSettings(){var key=$('profileSelect').value;state.activeProfile=key;var p=state.profiles[key];p.name=$('profileNameInput').value.trim()||p.name;p.avatar=selectedAvatar;p.dailyLimit=parseInt($('dailyLimit').value,10)||0;save();renderAll();loadParentFields();alert('兒童資料已儲存')}
function saveBed(){state.bedtime.enabled=$('bedEnabled').checked;state.bedtime.start=$('bedStart').value||'21:00';state.bedtime.end=$('bedEnd').value||'07:00';save();alert('睡前設定已儲存')}
function saveWhitelist(){state.whitelist.enabled=$('whitelistEnabled').checked;state.whitelist.channels=$('whitelistInput').value.split(/\r?\n/).map(function(x){return x.trim()}).filter(Boolean);save();renderAll();alert('頻道白名單已儲存')}
function addVideo(){var id=ytId($('urlInput').value.trim());if(!id){alert('無法辨識 YouTube 網址');return}if(state.videos.some(function(v){return v.id===id})){alert('這部影片已存在');return}state.videos.push({id:id,title:$('titleInput').value.trim()||'新影片',category:$('categoryInput').value,channel:$('channelInput').value.trim(),recommended:false,addedAt:Date.now(),categoryManual:true,autoCategory:false,categoryConfidence:100});save();renderAll()}
function batchAdd(){var lines=$('batchInput').value.split(/\r?\n/),cat=$('batchCategory').value,added=0,existing=0,bad=0;lines.forEach(function(line){var id=ytId(line.trim());if(!line.trim())return;if(!id){bad++;return}if(state.videos.some(function(v){return v.id===id})){existing++;return}state.videos.push({id:id,title:'YouTube 影片',category:cat,channel:'',recommended:false,addedAt:Date.now()});added++});save();renderAll();$('batchStatus').textContent='新增 '+added+' 部，已存在 '+existing+' 部'+(bad?'，無法辨識 '+bad+' 行':'')}
function renderManage(){
 var root=$('manageList');root.innerHTML='';
 state.videos.forEach(function(v,idx){
  var row=document.createElement('div');row.className='manage-row v15';
  row.innerHTML='<div class="drag">☰</div><img src="'+thumb(v.id)+'"><input class="title-edit" value="'+esc(v.title)+'"><select class="extra-field">'+['英文','兒歌','卡通','故事','學習','其他'].map(function(c){return '<option'+(c===v.category?' selected':'')+'>'+c+'</option>'}).join('')+'</select><input class="extra-field channel-edit" value="'+esc(v.channel||'')+'" placeholder="頻道名稱"><label class="recommend-toggle extra-field"><input type="checkbox" '+(v.recommended?'checked':'')+'>推薦</label><div class="row-buttons"><button data-a="up">↑</button><button data-a="down">↓</button><button data-a="save">儲存</button><button data-a="del">刪除</button></div>';
  var title=row.querySelector('.title-edit'),sel=row.querySelector('select'),ch=row.querySelector('.channel-edit'),rec=row.querySelector('.recommend-toggle input');
  row.querySelector('[data-a=save]').onclick=function(){v.title=title.value.trim()||v.title;v.category=sel.value;v.channel=ch.value.trim();v.recommended=rec.checked;save();renderAll()};
  row.querySelector('[data-a=del]').onclick=function(){if(confirm('刪除這部影片？')){state.videos.splice(idx,1);save();renderAll()}};
  row.querySelector('[data-a=up]').onclick=function(){if(idx>0){var x=state.videos.splice(idx,1)[0];state.videos.splice(idx-1,0,x);save();renderAll()}};
  row.querySelector('[data-a=down]').onclick=function(){if(idx<state.videos.length-1){var x=state.videos.splice(idx,1)[0];state.videos.splice(idx+1,0,x);save();renderAll()}};
  root.appendChild(row);
 });
}
function exportData(){var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='FamilyTube_backup.json';a.click()}
function importData(file){var r=new FileReader();r.onload=function(){try{state=JSON.parse(r.result);save();renderAll();alert('匯入完成')}catch(e){alert('備份檔格式錯誤')}};r.readAsText(file)}
function renderAll(){renderProfile();renderRows();renderManage();updateUsageUI()}


window.addEventListener('pagehide',function(){
 try{
  if(player&&typeof player.pauseVideo==='function')player.pauseVideo();
 }catch(e){}
});


function bindUiSafely(){
 try{
  migrateVideoCategoriesAfterInit();
  return true;
 }catch(e){
  try{
   var n=$('searchNodeStatus');
   if(n)n.textContent='介面已啟動，但部分資料初始化失敗。';
  }catch(_){}
  return false;
 }
}

document.addEventListener('DOMContentLoaded',function(){
 if($('loopBtn'))$('loopBtn').onclick=toggleLoopPlayback;
 updateLoopBtn();
 if($('loopCurrentEnabled'))$('loopCurrentEnabled').checked=!!(state.playback&&state.playback.loopCurrent);
 if($('savePlaybackBtn'))$('savePlaybackBtn').onclick=function(){
  if(!state.playback)state.playback={loopCurrent:false};
  state.playback.loopCurrent=!!$('loopCurrentEnabled').checked;
  save();updateLoopBtn();
  alert(state.playback.loopCurrent?'已開啟目前影片循環播放':'已關閉循環；播放結束會接續相關推薦');
 };

 bindSidebar();

 bindUiSafely();

 // Optional mini-player setup must never block the main UI.
 try{
  if($('miniPlayerClose'))$('miniPlayerClose').onclick=closeMiniPlayer;
  bindMiniPlayerScroll();
 }catch(e){}

 document.querySelectorAll('.avatar-grid button').forEach(function(b){b.onclick=function(){selectedAvatar=b.dataset.avatar;document.querySelectorAll('.avatar-grid button').forEach(function(x){x.classList.toggle('active',x.dataset.avatar===selectedAvatar)})}});
 $('homeSearchBtn').onclick=function(){if(searchTapLocked)return;searchTapLocked=true;setTimeout(function(){searchTapLocked=false},500);runInternalSearch(true)};$('quickPlayBtn').onclick=quickPlayHome;$('quickAddBtn').onclick=quickAddHome;
 $('homeSearchInput').addEventListener('keydown',function(e){if(e.key==='Enter'||e.keyCode===13)runInternalSearch(true)});
 $('quickUrlInput').addEventListener('keydown',function(e){if(e.key==='Enter'||e.keyCode===13)quickPlayHome()});
 $('quickUrlInput').addEventListener('input',function(){setTimeout(inspectQuickUrl,80)});
 $('quickUrlInput').addEventListener('paste',function(){setTimeout(inspectQuickUrl,150)});
 $('brandHomeBtn').onclick=showHome;
 $('profileBtn').onclick=toggleProfile;$('homeBtn').onclick=showHome;$('parentBtn').onclick=openParent;$('closeParentBtn').onclick=closeParent;$('backToHomeBtn').onclick=showHome;$('kidModeBtn').onclick=setKidMode;
 $('heroPlayBtn').onclick=function(){var rec=availableVideos().filter(function(v){return v.recommended}),p=profile(),v=rec[0]||(p.recent.length?videoById(p.recent[0]):availableVideos()[0]);if(v)selectVideo(v.id,availableVideos())};
 $('prevBtn').onclick=prevVideo;$('nextBtn').onclick=nextVideo;$('playBtn').onclick=function(){if(!canPlay())return;if(playerMode==='iframe'){sendDirectCommand('playVideo');return}if(!player||!playerReady){if(currentId)playSelectedId(currentId);return}player.getPlayerState()===YT.PlayerState.PLAYING?player.pauseVideo():player.playVideo()};$('favBtn').onclick=toggleFav;
 $('fullBtn').onclick=toggleImmersiveFullscreen;
 $('addBtn').onclick=addVideo;$('batchAddBtn').onclick=batchAdd;
 $('savePinBtn').onclick=function(){var p=$('pinInput').value.trim();if(!/^\d{4,6}$/.test(p)){alert('請輸入 4～6 位數 PIN');return}state.pin=p;save();$('pinInput').value='';alert('PIN 已更新')};
 $('profileSelect').onchange=function(){state.activeProfile=this.value;loadParentFields();renderProfile()};$('dailyLimit').onchange=function(){profile().dailyLimit=parseInt(this.value,10)||0;save();updateUsageUI()};
 $('saveProfileBtn').onclick=saveProfileSettings;$('saveBedBtn').onclick=saveBed;$('saveWhitelistBtn').onclick=saveWhitelist;$('exportBtn').onclick=exportData;$('importInput').onchange=function(){if(this.files[0])importData(this.files[0])};
 $('modalCancel').onclick=function(){closeModal(false)};$('modalOk').onclick=function(){closeModal($('modalInput').value===state.pin)};
 document.addEventListener('fullscreenchange',function(){if(!document.fullscreenElement&&immersiveFull&&$('playerSection').classList.contains('immersive-fullscreen')){/* keep CSS immersive on iPad fallback */}});
 document.addEventListener('webkitfullscreenchange',function(){if(!document.webkitFullscreenElement&&immersiveFull&&$('playerSection').classList.contains('immersive-fullscreen')){/* keep CSS immersive */}});
 document.addEventListener('keydown',function(e){if((e.key==='Escape'||e.keyCode===27)&&immersiveFull)exitImmersiveFullscreen()});
 if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
 renderAll();showHome();
 setTimeout(loadYouTubeApiAsync,50);
});
})();