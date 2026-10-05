
(function(){
'use strict';
var STORAGE='familytube_v13';
var OLD_STORAGE='familytube_v12';
var DEFAULT={
 videos:[
  {id:'M7lc1UVf-VE',title:'YouTube 播放測試',category:'學習'}
 ],
 profiles:{
  daughter:{name:'女兒',favorites:[],recent:[]},
  son:{name:'兒子',favorites:[],recent:[]}
 },
 activeProfile:'daughter',
 pin:'1234',
 timeLimit:0,
 apiKey:''
};
var state=load();
var player=null,currentId=null,currentList=[],currentIndex=-1,timerEnd=0,timerTick=null,parentOpen=false,kidMode=false,modalCb=null;

function $(id){return document.getElementById(id)}
function load(){
 try{
  var raw=localStorage.getItem(STORAGE)||localStorage.getItem(OLD_STORAGE);
  var v=JSON.parse(raw);
  if(!v) return JSON.parse(JSON.stringify(DEFAULT));
  if(!v.profiles) v.profiles=JSON.parse(JSON.stringify(DEFAULT.profiles));
  if(!v.activeProfile) v.activeProfile='daughter';
  return Object.assign(JSON.parse(JSON.stringify(DEFAULT)),v);
 }catch(e){return JSON.parse(JSON.stringify(DEFAULT))}
}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
function profile(){return state.profiles[state.activeProfile]}
function ytId(url){
 if(!url)return null;
 var m=url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
 return m?m[1]:(/^[A-Za-z0-9_-]{11}$/.test(url)?url:null);
}
function thumb(id){return 'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'}
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

window.onYouTubeIframeAPIReady=function(){
 var origin=(location.protocol==='http:'||location.protocol==='https:')?location.origin:undefined;
 var opts={height:'390',width:'640',videoId:state.videos[0]?state.videos[0].id:'',
  playerVars:{playsinline:1,rel:0,modestbranding:1},
  events:{onReady:onReady,onStateChange:onState,onError:onErr}};
 if(origin) opts.playerVars.origin=origin;
 player=new YT.Player('player',opts);
};
function onReady(){renderAll()}
function onState(e){
 if(e.data===YT.PlayerState.ENDED) nextVideo();
}
function onErr(e){
 var msg='YouTube 播放錯誤：'+e.data;
 if(e.data===153)msg='錯誤 153：請從 GitHub Pages / HTTPS 網址開啟，不要直接用 file://。';
 if(e.data===101||e.data===150)msg='這部影片禁止外部嵌入，請換一部影片。';
 if(e.data===100)msg='影片不存在、已刪除或是私人影片。';
 alert(msg);
}
function selectVideo(id,list){
 currentList=list||visibleVideos();
 currentIndex=currentList.findIndex(function(v){return v.id===id});
 currentId=id;
 if(player&&player.loadVideoById)player.loadVideoById(id);
 var v=state.videos.find(function(x){return x.id===id});
 $('nowPlaying').textContent=v?v.title:'播放中';
 addRecent(id);
 renderGrid(currentList);
}
function addRecent(id){
 var p=profile();
 p.recent=p.recent.filter(function(x){return x!==id});
 p.recent.unshift(id);p.recent=p.recent.slice(0,30);save();
}
function nextVideo(){if(!currentList.length)return;currentIndex=(currentIndex+1)%currentList.length;selectVideo(currentList[currentIndex].id,currentList)}
function prevVideo(){if(!currentList.length)return;currentIndex=(currentIndex-1+currentList.length)%currentList.length;selectVideo(currentList[currentIndex].id,currentList)}
function visibleVideos(){return state.videos.slice()}
function applyFilter(type){
 var p=profile(), list=[];
 if(type==='favorite') list=state.videos.filter(function(v){return p.favorites.indexOf(v.id)>=0});
 else if(type==='recent') list=p.recent.map(function(id){return state.videos.find(function(v){return v.id===id})}).filter(Boolean);
 else if(type==='all') list=state.videos.slice();
 else list=state.videos.filter(function(v){return v.category===type});
 currentList=list;$('libraryTitle').textContent=type==='all'?'全部影片':type==='favorite'?'我的最愛':type==='recent'?'最近觀看':type;
 renderGrid(list);
}
function renderGrid(list){
 var root=$('videoGrid');root.innerHTML='';
 list.forEach(function(v){
  var card=document.createElement('div');card.className='video-card';
  card.innerHTML='<img src="'+thumb(v.id)+'" alt=""><div class="body"><h3>'+esc(v.title)+'</h3><div class="meta">'+esc(v.category)+'</div></div>';
  card.onclick=function(){selectVideo(v.id,list)};
  root.appendChild(card);
 });
 updateFavBtn();
}
function updateFavBtn(){
 var yes=currentId&&profile().favorites.indexOf(currentId)>=0;
 $('favBtn').textContent=yes?'★ 已收藏':'☆ 最愛';
}
function toggleFav(){
 if(!currentId)return;
 var p=profile(),i=p.favorites.indexOf(currentId);
 if(i>=0)p.favorites.splice(i,1);else p.favorites.push(currentId);
 save();updateFavBtn();
}
function renderManage(){
 var root=$('manageList');root.innerHTML='';
 state.videos.forEach(function(v,idx){
  var row=document.createElement('div');row.className='manage-row';row.draggable=true;row.dataset.idx=idx;
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
  row.addEventListener('drop',function(e){e.preventDefault();var from=parseInt(e.dataTransfer.getData('text/plain'),10);reorder(from,idx)});
  root.appendChild(row);
 });
}
function move(i,d){var j=i+d;if(j<0||j>=state.videos.length)return;reorder(i,j)}
function reorder(from,to){var x=state.videos.splice(from,1)[0];state.videos.splice(to,0,x);save();renderAll()}
function renderProfile(){
 var p=profile();$('profileBtn').textContent=(state.activeProfile==='daughter'?'👧 ':'👦 ')+p.name;
}
function toggleProfile(){
 state.activeProfile=state.activeProfile==='daughter'?'son':'daughter';
 save();renderAll();
}
function openParent(){
 if(parentOpen){parentOpen=false;$('parentPanel').classList.add('hidden');return}
 askPin(function(ok){if(ok){parentOpen=true;$('parentPanel').classList.remove('hidden');renderManage()}});
}
function askPin(cb){
 modalCb=cb;$('modal').classList.remove('hidden');$('modalInput').value='';$('modalInput').focus();
}
function closeModal(v){$('modal').classList.add('hidden');if(modalCb){var f=modalCb;modalCb=null;f(v)}}
function setKidMode(){
 if(!kidMode){kidMode=true;parentOpen=false;$('parentPanel').classList.add('hidden');$('kidModeBtn').textContent='🧒 兒童模式：開';}
 else askPin(function(ok){if(ok){kidMode=false;$('kidModeBtn').textContent='🧒 兒童模式'}});
}
function addVideo(){
 var id=ytId($('urlInput').value.trim());if(!id){alert('無法辨識 YouTube 網址');return}
 if(state.videos.some(function(v){return v.id===id})){alert('這部影片已存在');return}
 state.videos.push({id:id,title:$('titleInput').value.trim()||'新影片',category:$('categoryInput').value});
 $('urlInput').value='';$('titleInput').value='';save();renderAll();
}
function setTime(){
 state.timeLimit=parseInt($('timeLimit').value,10)||0;save();
 if(timerTick)clearInterval(timerTick);
 timerEnd=state.timeLimit?Date.now()+state.timeLimit*60000:0;
 updateTimer();if(timerEnd)timerTick=setInterval(updateTimer,1000);
}
function updateTimer(){
 if(!timerEnd){$('timerText').textContent='不限時';return}
 var sec=Math.max(0,Math.floor((timerEnd-Date.now())/1000));
 $('timerText').textContent='剩餘 '+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');
 if(sec<=0){clearInterval(timerTick);timerTick=null;if(player&&player.pauseVideo)player.pauseVideo();alert('觀看時間到了，請休息一下。')}
}
function renderAll(){renderProfile();renderGrid(state.videos.slice());renderManage();$('timeLimit').value=String(state.timeLimit||0);updateTimer()}
function exportData(){
 var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
 var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='FamilyTube_backup.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)
}
function importData(file){
 var r=new FileReader();r.onload=function(){try{state=JSON.parse(r.result);save();renderAll();alert('匯入完成')}catch(e){alert('備份檔格式錯誤')}};r.readAsText(file)
}


function apiKey(){return (state.apiKey||'').trim()}
function apiUrl(path,params){
 var q=Object.keys(params).map(function(k){return encodeURIComponent(k)+'='+encodeURIComponent(params[k])}).join('&');
 return 'https://www.googleapis.com/youtube/v3/'+path+'?'+q+'&key='+encodeURIComponent(apiKey());
}
function fetchJSON(url){
 return fetch(url,{method:'GET',mode:'cors'}).then(function(r){
  return r.json().then(function(j){
   if(!r.ok){var m=(j&&j.error&&j.error.message)||('HTTP '+r.status);throw new Error(m)}
   return j;
  });
 });
}
function playlistIdFromText(s){
 s=(s||'').trim();
 var m=s.match(/[?&]list=([A-Za-z0-9_-]+)/);
 if(m)return m[1];
 return /^[A-Za-z0-9_-]{10,}$/.test(s)?s:null;
}
function addVideoObject(v){
 if(!v||!v.id)return false;
 if(state.videos.some(function(x){return x.id===v.id}))return false;
 state.videos.push({id:v.id,title:v.title||'YouTube 影片',category:v.category||'其他'});
 return true;
}
function batchAdd(){
 var lines=$('batchInput').value.split(/\r?\n/), cat=$('batchCategory').value, ids=[], bad=0;
 lines.forEach(function(line){var id=ytId(line.trim());if(id)ids.push(id);else if(line.trim())bad++});
 ids=ids.filter(function(x,i,a){return a.indexOf(x)===i});
 var added=0, existing=0;
 function finish(){
  save();renderAll();$('batchInput').value='';
  $('batchStatus').textContent='完成：新增 '+added+' 部，已存在 '+existing+' 部'+(bad?'，無法辨識 '+bad+' 行':'')+'。';
 }
 if(!ids.length){$('batchStatus').textContent='沒有找到可加入的 YouTube 網址。';return}
 if(!apiKey()){
  ids.forEach(function(id){
   if(addVideoObject({id:id,title:'YouTube 影片',category:cat}))added++;else existing++;
  });finish();return;
 }
 // With API key, fetch titles in batches of 50
 var chunks=[];for(var i=0;i<ids.length;i+=50)chunks.push(ids.slice(i,i+50));
 Promise.all(chunks.map(function(chunk){
  return fetchJSON(apiUrl('videos',{part:'snippet',id:chunk.join(',')})).then(function(j){return j.items||[]})
 })).then(function(groups){
  var map={};groups.forEach(function(g){g.forEach(function(it){map[it.id]=it.snippet&&it.snippet.title})});
  ids.forEach(function(id){
   if(addVideoObject({id:id,title:map[id]||'YouTube 影片',category:cat}))added++;else existing++;
  });finish();
 }).catch(function(e){
  $('batchStatus').innerHTML='<span class="api-err">取得標題失敗：'+esc(e.message)+'。改以網址直接加入。</span>';
  ids.forEach(function(id){if(addVideoObject({id:id,title:'YouTube 影片',category:cat}))added++;else existing++});save();renderAll();
 });
}
function searchYouTube(){
 var q=$('searchInput').value.trim();
 if(!apiKey()){$('searchStatus').innerHTML='<span class="api-err">請先儲存 YouTube Data API Key。</span>';return}
 if(!q)return;
 $('searchStatus').textContent='搜尋中…';$('searchResults').innerHTML='';
 fetchJSON(apiUrl('search',{part:'snippet',type:'video',videoEmbeddable:'true',safeSearch:'strict',maxResults:'12',q:q}))
 .then(function(j){
  var items=j.items||[];$('searchStatus').innerHTML='<span class="api-ok">找到 '+items.length+' 部影片</span>';
  items.forEach(function(it){
   var id=it.id&&it.id.videoId;if(!id)return;
   var d=document.createElement('div');d.className='search-item';
   var title=(it.snippet&&it.snippet.title)||'YouTube 影片';
   d.innerHTML='<img src="'+thumb(id)+'"><div><h4>'+esc(title)+'</h4><button>＋ 加入影片庫</button></div>';
   d.querySelector('button').onclick=function(){
    if(addVideoObject({id:id,title:title,category:$('categoryInput').value})){save();renderAll();this.textContent='✓ 已加入';this.disabled=true}
    else{this.textContent='已存在';this.disabled=true}
   };
   $('searchResults').appendChild(d);
  });
 }).catch(function(e){$('searchStatus').innerHTML='<span class="api-err">搜尋失敗：'+esc(e.message)+'</span>'});
}
function importPlaylist(){
 var pid=playlistIdFromText($('playlistInput').value),cat=$('playlistCategory').value;
 if(!apiKey()){$('playlistStatus').innerHTML='<span class="api-err">請先儲存 YouTube Data API Key。</span>';return}
 if(!pid){$('playlistStatus').innerHTML='<span class="api-err">無法辨識播放清單網址 / ID。</span>';return}
 var added=0,existing=0,total=0;
 $('playlistStatus').textContent='讀取播放清單中…';
 function page(token){
  var p={part:'snippet,contentDetails,status',playlistId:pid,maxResults:'50'};
  if(token)p.pageToken=token;
  return fetchJSON(apiUrl('playlistItems',p)).then(function(j){
   (j.items||[]).forEach(function(it){
    var id=(it.contentDetails&&it.contentDetails.videoId)||(it.snippet&&it.snippet.resourceId&&it.snippet.resourceId.videoId);
    var title=it.snippet&&it.snippet.title;
    if(!id||title==='Deleted video'||title==='Private video')return;
    total++;
    if(addVideoObject({id:id,title:title||'YouTube 影片',category:cat}))added++;else existing++;
   });
   $('playlistStatus').textContent='已讀取 '+total+' 部…';
   if(j.nextPageToken)return page(j.nextPageToken);
  });
 }
 page().then(function(){
  save();renderAll();$('playlistStatus').innerHTML='<span class="api-ok">匯入完成：新增 '+added+' 部，原本已有 '+existing+' 部。</span>';
 }).catch(function(e){$('playlistStatus').innerHTML='<span class="api-err">匯入失敗：'+esc(e.message)+'</span>'});
}
function saveApiKey(){
 state.apiKey=$('apiKeyInput').value.trim();save();
 $('apiKeyInput').value='';
 $('searchStatus').innerHTML=state.apiKey?'<span class="api-ok">API Key 已儲存在這台裝置。</span>':'需要 API Key。';
}

document.addEventListener('DOMContentLoaded',function(){
 document.querySelectorAll('.home-card').forEach(function(b){b.onclick=function(){applyFilter(b.dataset.filter)}});
 $('prevBtn').onclick=prevVideo;$('nextBtn').onclick=nextVideo;
 $('playBtn').onclick=function(){if(!player)return;var s=player.getPlayerState();s===YT.PlayerState.PLAYING?player.pauseVideo():player.playVideo()};
 $('favBtn').onclick=toggleFav;
 $('fullBtn').onclick=function(){var el=$('playerSection');if(el.requestFullscreen)el.requestFullscreen();else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen()};
 $('profileBtn').onclick=toggleProfile;$('parentBtn').onclick=openParent;$('kidModeBtn').onclick=setKidMode;
 $('addBtn').onclick=addVideo;$('timeLimit').onchange=setTime;
 $('savePinBtn').onclick=function(){var p=$('pinInput').value.trim();if(!/^\d{4,6}$/.test(p)){alert('請輸入 4～6 位數 PIN');return}state.pin=p;save();$('pinInput').value='';alert('PIN 已更新')};
 $('playlistPlayBtn').onclick=function(){if(currentList.length)selectVideo(currentList[0].id,currentList);else if(state.videos.length)selectVideo(state.videos[0].id,state.videos.slice())};
 $('exportBtn').onclick=exportData;$('importInput').onchange=function(){if(this.files[0])importData(this.files[0])};
 $('saveApiKeyBtn').onclick=saveApiKey;$('batchAddBtn').onclick=batchAdd;$('searchBtn').onclick=searchYouTube;$('playlistImportBtn').onclick=importPlaylist;
 $('modalCancel').onclick=function(){closeModal(false)};$('modalOk').onclick=function(){closeModal($('modalInput').value===state.pin)};
 if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
 renderAll();
 if(state.apiKey)$('searchStatus').innerHTML='<span class="api-ok">API Key 已設定，可使用搜尋與播放清單匯入。</span>';
});
})();