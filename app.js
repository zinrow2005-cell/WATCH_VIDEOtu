(function(){
'use strict';
var STORAGE='familytube_v14';
var OLD_KEYS=['familytube_v13','familytube_v12'];
var DEFAULT={
 videos:[{id:'M7lc1UVf-VE',title:'YouTube 播放測試',category:'學習',addedAt:Date.now()}],
 profiles:{
  daughter:{name:'女兒',favorites:[],recent:[],progress:{}},
  son:{name:'兒子',favorites:[],recent:[],progress:{}}
 },
 activeProfile:'daughter',pin:'1234',timeLimit:0,apiKey:''
};
var state=load();
var player=null,currentId=null,currentList=[],currentIndex=-1,timerEnd=0,timerTick=null,parentOpen=false,kidMode=false,modalCb=null;

function $(id){return document.getElementById(id)}
function deepClone(v){return JSON.parse(JSON.stringify(v))}
function load(){
 try{
  var raw=localStorage.getItem(STORAGE);
  if(!raw){
   for(var i=0;i<OLD_KEYS.length;i++){raw=localStorage.getItem(OLD_KEYS[i]);if(raw)break}
  }
  var v=raw?JSON.parse(raw):deepClone(DEFAULT);
  if(!v.profiles)v.profiles=deepClone(DEFAULT.profiles);
  ['daughter','son'].forEach(function(k){
   if(!v.profiles[k])v.profiles[k]=deepClone(DEFAULT.profiles[k]);
   if(!v.profiles[k].favorites)v.profiles[k].favorites=[];
   if(!v.profiles[k].recent)v.profiles[k].recent=[];
   if(!v.profiles[k].progress)v.profiles[k].progress={};
  });
  if(!v.activeProfile)v.activeProfile='daughter';
  if(!v.videos)v.videos=[];
  v.videos.forEach(function(x,idx){if(!x.addedAt)x.addedAt=Date.now()-idx*1000});
  return Object.assign(deepClone(DEFAULT),v);
 }catch(e){return deepClone(DEFAULT)}
}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
function profile(){return state.profiles[state.activeProfile]}
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ytId(url){
 if(!url)return null;
 var m=url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
 return m?m[1]:(/^[A-Za-z0-9_-]{11}$/.test(url)?url:null);
}
function thumb(id){return 'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'}
function videoById(id){return state.videos.find(function(v){return v.id===id})}

window.onYouTubeIframeAPIReady=function(){
 var origin=(location.protocol==='http:'||location.protocol==='https:')?location.origin:undefined;
 var opts={height:'390',width:'640',videoId:state.videos[0]?state.videos[0].id:'',
  playerVars:{playsinline:1,rel:0,modestbranding:1},
  events:{onReady:onReady,onStateChange:onState,onError:onErr}};
 if(origin)opts.playerVars.origin=origin;
 player=new YT.Player('player',opts);
};
function onReady(){renderAll();startProgressSampler()}
function onState(e){if(e.data===YT.PlayerState.ENDED)nextVideo()}
function onErr(e){
 var msg='YouTube 播放錯誤：'+e.data;
 if(e.data===153)msg='錯誤 153：請從 GitHub Pages / HTTPS 網址開啟。';
 if(e.data===101||e.data===150)msg='這部影片禁止外部嵌入，請換一部影片。';
 if(e.data===100)msg='影片不存在、已刪除或是私人影片。';
 alert(msg);
}

function showPlayer(){
 $('kidsHome').classList.add('hidden');$('hero').classList.add('hidden');$('playerSection').classList.remove('hidden');
}
function showHome(){
 $('playerSection').classList.add('hidden');$('hero').classList.remove('hidden');$('kidsHome').classList.remove('hidden');
 renderRows();
}
function selectVideo(id,list){
 currentList=list&&list.length?list:state.videos.slice();
 currentIndex=currentList.findIndex(function(v){return v.id===id});
 currentId=id;
 showPlayer();
 if(player&&player.loadVideoById)player.loadVideoById(id);
 var v=videoById(id);
 $('nowPlaying').textContent=v?v.title:'播放中';
 addRecent(id);updateFavBtn();updateHeroFromRecent();
}
function addRecent(id){
 var p=profile();p.recent=p.recent.filter(function(x){return x!==id});p.recent.unshift(id);p.recent=p.recent.slice(0,40);save();
}
function nextVideo(){if(!currentList.length)return;currentIndex=(currentIndex+1)%currentList.length;selectVideo(currentList[currentIndex].id,currentList)}
function prevVideo(){if(!currentList.length)return;currentIndex=(currentIndex-1+currentList.length)%currentList.length;selectVideo(currentList[currentIndex].id,currentList)}
function toggleFav(){
 if(!currentId)return;var p=profile(),i=p.favorites.indexOf(currentId);
 if(i>=0)p.favorites.splice(i,1);else p.favorites.push(currentId);
 save();updateFavBtn();renderRows();
}
function updateFavBtn(){
 var yes=currentId&&profile().favorites.indexOf(currentId)>=0;
 $('favBtn').textContent=yes?'★ 已收藏':'☆ 最愛';
}
function startProgressSampler(){
 setInterval(function(){
  if(!player||!currentId||!player.getCurrentTime||!player.getDuration)return;
  try{
   var cur=player.getCurrentTime(),dur=player.getDuration();
   if(dur>0&&cur>2){
    profile().progress[currentId]={current:Math.floor(cur),duration:Math.floor(dur),updated:Date.now()};
    save();
   }
  }catch(e){}
 },5000);
}
function resumeVideo(id,list){
 var pr=profile().progress[id];selectVideo(id,list);
 if(pr&&pr.current>5&&player){
  setTimeout(function(){try{player.seekTo(pr.current,true)}catch(e){}},800);
 }
}
function makeCard(v,opts){
 opts=opts||{};
 var card=document.createElement('div');card.className='video-card';
 var p=profile().progress[v.id],pct=0;
 if(p&&p.duration>0)pct=Math.min(100,Math.round(p.current/p.duration*100));
 var badge=opts.badge||v.category||'影片';
 card.innerHTML='<div class="thumb-wrap"><img src="'+thumb(v.id)+'" alt=""><span class="badge">'+esc(badge)+'</span>'+
   (pct?'<div style="position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.25)"><div style="width:'+pct+'%;height:100%;background:#fff"></div></div>':'')+
   '</div><div class="body"><h3>'+esc(v.title)+'</h3><div class="card-meta">'+(pct?'已觀看 '+pct+'%':'點一下開始播放')+'</div></div>';
 card.onclick=function(){if(opts.resume)resumeVideo(v.id,opts.list);else selectVideo(v.id,opts.list)};
 return card;
}
function addRow(title,list,sub,opts){
 if(!list||!list.length)return;
 var sec=document.createElement('section');sec.className='media-row';
 sec.innerHTML='<div class="row-head"><h2>'+esc(title)+'</h2><span>'+esc(sub||'')+'</span></div>';
 var car=document.createElement('div');car.className='carousel';
 list.forEach(function(v){car.appendChild(makeCard(v,Object.assign({list:list},opts||{})))});
 sec.appendChild(car);$('dynamicRows').appendChild(sec);
}
function renderRows(filter){
 var root=$('dynamicRows');root.innerHTML='';var p=profile(),all=state.videos.slice();
 var filtered=filter&&filter!=='all'?all.filter(function(v){return v.category===filter}):all;

 if(!filter||filter==='all'){
  var cont=p.recent.map(videoById).filter(function(v){
   if(!v)return false;var pr=p.progress[v.id];return pr&&pr.current>5&&pr.duration&&pr.current<pr.duration-10;
  }).slice(0,12);
  addRow('繼續觀看',cont,'從上次看到的地方接著看',{resume:true,badge:'繼續'});

  var fav=p.favorites.map(videoById).filter(Boolean).slice(0,20);
  addRow('我的最愛',fav,'只屬於 '+p.name+' 的收藏',{badge:'★ 最愛'});

  var recent=p.recent.map(videoById).filter(Boolean).slice(0,16);
  addRow('最近觀看',recent,'最近點過的影片',{badge:'最近看過'});

  var newest=all.slice().sort(function(a,b){return (b.addedAt||0)-(a.addedAt||0)}).slice(0,16);
  addRow('最近加入',newest,'家長最近新增的內容',{badge:'新加入'});

  ['英文','兒歌','卡通','故事','學習'].forEach(function(cat){
   var items=all.filter(function(v){return v.category===cat}).slice(0,20);
   addRow(cat+'專區',items,'', {badge:cat});
  });
 }else{
  addRow(filter+'專區',filtered,'共 '+filtered.length+' 部影片',{badge:filter});
 }
 if(!root.children.length){
  var empty=document.createElement('div');empty.className='media-row';empty.innerHTML='<div class="row-head"><h2>目前沒有影片</h2></div>';
  root.appendChild(empty);
 }
}
function updateHeroFromRecent(){
 var p=profile(),v=p.recent.length?videoById(p.recent[0]):state.videos[0];
 $('heroTitle').textContent=v?('繼續看：'+v.title):'今天想看什麼？';
 $('heroText').textContent='選擇下方分類，或直接播放推薦內容。';
}
function renderProfile(){
 var p=profile();$('profileBtn').textContent=(state.activeProfile==='daughter'?'👧 ':'👦 ')+p.name;
 updateHeroFromRecent();
}
function toggleProfile(){
 state.activeProfile=state.activeProfile==='daughter'?'son':'daughter';save();renderAll();showHome();
}
function applyFilter(type){
 document.querySelectorAll('.category-chip').forEach(function(b){b.classList.toggle('active',b.dataset.filter===type)});
 renderRows(type);
}
function askPin(cb){modalCb=cb;$('modal').classList.remove('hidden');$('modalInput').value='';$('modalInput').focus()}
function closeModal(v){$('modal').classList.add('hidden');if(modalCb){var f=modalCb;modalCb=null;f(v)}}
function openParent(){
 if(parentOpen){closeParent();return}
 askPin(function(ok){if(ok){parentOpen=true;$('kidsHome').classList.add('hidden');$('hero').classList.add('hidden');$('playerSection').classList.add('hidden');$('parentPanel').classList.remove('hidden');renderManage()}});
}
function closeParent(){parentOpen=false;$('parentPanel').classList.add('hidden');showHome()}
function setKidMode(){
 if(!kidMode){kidMode=true;$('parentBtn').classList.add('hidden');$('kidModeBtn').textContent='🧒 兒童模式：開'}
 else askPin(function(ok){if(ok){kidMode=false;$('parentBtn').classList.remove('hidden');$('kidModeBtn').textContent='🧒 兒童模式'}});
}

function addVideo(){
 var id=ytId($('urlInput').value.trim());if(!id){alert('無法辨識 YouTube 網址');return}
 if(state.videos.some(function(v){return v.id===id})){alert('這部影片已存在');return}
 state.videos.push({id:id,title:$('titleInput').value.trim()||'新影片',category:$('categoryInput').value,addedAt:Date.now()});
 $('urlInput').value='';$('titleInput').value='';save();renderAll();
}
function renderManage(){
 var root=$('manageList');root.innerHTML='';
 state.videos.forEach(function(v,idx){
  var row=document.createElement('div');row.className='manage-row';row.draggable=true;
  row.innerHTML='<div class="drag">☰</div><img src="'+thumb(v.id)+'"><input value="'+esc(v.title)+'"><select>'+
   ['英文','兒歌','卡通','故事','學習','其他'].map(function(c){return '<option'+(c===v.category?' selected':'')+'>'+c+'</option>'}).join('')+
   '</select><div class="row-buttons"><button data-a="up">↑</button><button data-a="down">↓</button><button data-a="save">儲存</button><button data-a="del">刪除</button></div>';
  var input=row.querySelector('input'),sel=row.querySelector('select');
  row.querySelector('[data-a=save]').onclick=function(){v.title=input.value.trim()||v.title;v.category=sel.value;save();renderAll()};
  row.querySelector('[data-a=del]').onclick=function(){if(confirm('刪除這部影片？')){state.videos.splice(idx,1);save();renderAll()}};
  row.querySelector('[data-a=up]').onclick=function(){move(idx,-1)};
  row.querySelector('[data-a=down]').onclick=function(){move(idx,1)};
  row.addEventListener('dragstart',function(e){e.dataTransfer.setData('text/plain',String(idx))});
  row.addEventListener('dragover',function(e){e.preventDefault()});
  row.addEventListener('drop',function(e){e.preventDefault();reorder(parseInt(e.dataTransfer.getData('text/plain'),10),idx)});
  root.appendChild(row);
 });
}
function move(i,d){var j=i+d;if(j<0||j>=state.videos.length)return;reorder(i,j)}
function reorder(from,to){var x=state.videos.splice(from,1)[0];state.videos.splice(to,0,x);save();renderAll()}
function setTime(){
 state.timeLimit=parseInt($('timeLimit').value,10)||0;save();
 if(timerTick)clearInterval(timerTick);
 timerEnd=state.timeLimit?Date.now()+state.timeLimit*60000:0;
 updateTimer();if(timerEnd)timerTick=setInterval(updateTimer,1000);
}
function updateTimer(){
 if(!timerEnd){$('timerText').textContent='不限時';return}
 var sec=Math.max(0,Math.floor((timerEnd-Date.now())/1000));
 var ss=sec%60;$('timerText').textContent='剩餘 '+Math.floor(sec/60)+':'+(ss<10?'0':'')+ss;
 if(sec<=0){clearInterval(timerTick);timerTick=null;try{player.pauseVideo()}catch(e){} alert('觀看時間到了，請休息一下。')}
}
function apiKey(){return (state.apiKey||'').trim()}
function apiUrl(path,params){
 var q=Object.keys(params).map(function(k){return encodeURIComponent(k)+'='+encodeURIComponent(params[k])}).join('&');
 return 'https://www.googleapis.com/youtube/v3/'+path+'?'+q+'&key='+encodeURIComponent(apiKey());
}
function fetchJSON(url){
 return fetch(url,{method:'GET',mode:'cors'}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error((j&&j.error&&j.error.message)||('HTTP '+r.status));return j})});
}
function addVideoObject(v){
 if(!v||!v.id||state.videos.some(function(x){return x.id===v.id}))return false;
 state.videos.push({id:v.id,title:v.title||'YouTube 影片',category:v.category||'其他',addedAt:Date.now()});return true;
}
function batchAdd(){
 var lines=$('batchInput').value.split(/\r?\n/),cat=$('batchCategory').value,ids=[],bad=0;
 lines.forEach(function(line){var id=ytId(line.trim());if(id)ids.push(id);else if(line.trim())bad++});
 ids=ids.filter(function(x,i,a){return a.indexOf(x)===i});
 var added=0,existing=0;
 function finish(){save();renderAll();$('batchInput').value='';$('batchStatus').textContent='完成：新增 '+added+' 部，已存在 '+existing+' 部'+(bad?'，無法辨識 '+bad+' 行':'')+'。'}
 if(!ids.length){$('batchStatus').textContent='沒有找到可加入的網址。';return}
 if(!apiKey()){ids.forEach(function(id){if(addVideoObject({id:id,title:'YouTube 影片',category:cat}))added++;else existing++});finish();return}
 var chunks=[];for(var i=0;i<ids.length;i+=50)chunks.push(ids.slice(i,i+50));
 Promise.all(chunks.map(function(chunk){return fetchJSON(apiUrl('videos',{part:'snippet',id:chunk.join(',')})).then(function(j){return j.items||[]})}))
 .then(function(groups){
  var map={};groups.forEach(function(g){g.forEach(function(it){map[it.id]=it.snippet&&it.snippet.title})});
  ids.forEach(function(id){if(addVideoObject({id:id,title:map[id]||'YouTube 影片',category:cat}))added++;else existing++});finish();
 }).catch(function(e){$('batchStatus').innerHTML='<span class="api-err">取得標題失敗：'+esc(e.message)+'</span>'});
}
function searchYouTube(){
 var q=$('searchInput').value.trim();if(!apiKey()){$('searchStatus').innerHTML='<span class="api-err">請先儲存 API Key。</span>';return}if(!q)return;
 $('searchStatus').textContent='搜尋中…';$('searchResults').innerHTML='';
 fetchJSON(apiUrl('search',{part:'snippet',type:'video',videoEmbeddable:'true',safeSearch:'strict',maxResults:'12',q:q}))
 .then(function(j){
  var items=j.items||[];$('searchStatus').innerHTML='<span class="api-ok">找到 '+items.length+' 部影片</span>';
  items.forEach(function(it){
   var id=it.id&&it.id.videoId;if(!id)return;var title=(it.snippet&&it.snippet.title)||'YouTube 影片';
   var d=document.createElement('div');d.className='search-item';
   d.innerHTML='<img src="'+thumb(id)+'"><div><h4>'+esc(title)+'</h4><button>＋ 加入影片庫</button></div>';
   d.querySelector('button').onclick=function(){if(addVideoObject({id:id,title:title,category:$('categoryInput').value})){save();renderAll();this.textContent='✓ 已加入';this.disabled=true}else{this.textContent='已存在';this.disabled=true}};
   $('searchResults').appendChild(d);
  });
 }).catch(function(e){$('searchStatus').innerHTML='<span class="api-err">搜尋失敗：'+esc(e.message)+'</span>'});
}
function playlistIdFromText(s){s=(s||'').trim();var m=s.match(/[?&]list=([A-Za-z0-9_-]+)/);if(m)return m[1];return /^[A-Za-z0-9_-]{10,}$/.test(s)?s:null}
function importPlaylist(){
 var pid=playlistIdFromText($('playlistInput').value),cat=$('playlistCategory').value;
 if(!apiKey()){$('playlistStatus').innerHTML='<span class="api-err">請先儲存 API Key。</span>';return}
 if(!pid){$('playlistStatus').innerHTML='<span class="api-err">無法辨識播放清單。</span>';return}
 var added=0,existing=0,total=0;$('playlistStatus').textContent='讀取播放清單中…';
 function page(token){
  var p={part:'snippet,contentDetails,status',playlistId:pid,maxResults:'50'};if(token)p.pageToken=token;
  return fetchJSON(apiUrl('playlistItems',p)).then(function(j){
   (j.items||[]).forEach(function(it){
    var id=(it.contentDetails&&it.contentDetails.videoId)||(it.snippet&&it.snippet.resourceId&&it.snippet.resourceId.videoId);
    var title=it.snippet&&it.snippet.title;if(!id||title==='Deleted video'||title==='Private video')return;
    total++;if(addVideoObject({id:id,title:title||'YouTube 影片',category:cat}))added++;else existing++;
   });
   $('playlistStatus').textContent='已讀取 '+total+' 部…';if(j.nextPageToken)return page(j.nextPageToken);
  });
 }
 page().then(function(){save();renderAll();$('playlistStatus').innerHTML='<span class="api-ok">匯入完成：新增 '+added+' 部，已存在 '+existing+' 部。</span>'})
 .catch(function(e){$('playlistStatus').innerHTML='<span class="api-err">匯入失敗：'+esc(e.message)+'</span>'});
}
function saveApiKey(){state.apiKey=$('apiKeyInput').value.trim();save();$('apiKeyInput').value='';$('searchStatus').innerHTML=state.apiKey?'<span class="api-ok">API Key 已設定。</span>':'需要 API Key。'}
function exportData(){var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='FamilyTube_backup.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}
function importData(file){var r=new FileReader();r.onload=function(){try{state=JSON.parse(r.result);save();renderAll();alert('匯入完成')}catch(e){alert('備份檔格式錯誤')}};r.readAsText(file)}

function renderAll(){
 renderProfile();renderRows();renderManage();$('timeLimit').value=String(state.timeLimit||0);updateTimer();
 if(state.apiKey)$('searchStatus').innerHTML='<span class="api-ok">API Key 已設定，可使用搜尋與播放清單匯入。</span>';
}

document.addEventListener('DOMContentLoaded',function(){
 document.querySelectorAll('.category-chip').forEach(function(b){b.onclick=function(){applyFilter(b.dataset.filter)}});
 $('profileBtn').onclick=toggleProfile;$('homeBtn').onclick=showHome;$('parentBtn').onclick=openParent;$('closeParentBtn').onclick=closeParent;
 $('backToHomeBtn').onclick=showHome;$('kidModeBtn').onclick=setKidMode;
 $('heroPlayBtn').onclick=function(){var p=profile(),v=p.recent.length?videoById(p.recent[0]):state.videos[0];if(v)selectVideo(v.id,state.videos.slice())};
 $('prevBtn').onclick=prevVideo;$('nextBtn').onclick=nextVideo;
 $('playBtn').onclick=function(){if(!player)return;var s=player.getPlayerState();s===YT.PlayerState.PLAYING?player.pauseVideo():player.playVideo()};
 $('favBtn').onclick=toggleFav;
 $('fullBtn').onclick=function(){var el=$('playerSection');if(el.requestFullscreen)el.requestFullscreen();else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen()};
 $('addBtn').onclick=addVideo;$('timeLimit').onchange=setTime;
 $('savePinBtn').onclick=function(){var p=$('pinInput').value.trim();if(!/^\d{4,6}$/.test(p)){alert('請輸入 4～6 位數 PIN');return}state.pin=p;save();$('pinInput').value='';alert('PIN 已更新')};
 $('saveApiKeyBtn').onclick=saveApiKey;$('batchAddBtn').onclick=batchAdd;$('searchBtn').onclick=searchYouTube;$('playlistImportBtn').onclick=importPlaylist;
 $('exportBtn').onclick=exportData;$('importInput').onchange=function(){if(this.files[0])importData(this.files[0])};
 $('modalCancel').onclick=function(){closeModal(false)};$('modalOk').onclick=function(){closeModal($('modalInput').value===state.pin)};
 if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
 renderAll();showHome();
});
})();