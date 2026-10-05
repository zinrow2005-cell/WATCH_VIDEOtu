(function(){
'use strict';
var STORAGE='familytube_v155';
var OLD_KEYS=['familytube_v154','familytube_v153','familytube_v152','familytube_v151','familytube_v15','familytube_v14','familytube_v13','familytube_v12'];
var DEFAULT={
 videos:[{id:'M7lc1UVf-VE',title:'YouTube 播放測試',category:'學習',channel:'YouTube',recommended:true,addedAt:Date.now()}],
 profiles:{
  daughter:{name:'女兒',avatar:'👧',favorites:[],recent:[],progress:{},dailyLimit:60,usage:{}},
  son:{name:'兒子',avatar:'👦',favorites:[],recent:[],progress:{},dailyLimit:60,usage:{}}
 },
 activeProfile:'daughter',pin:'1234',
 bedtime:{enabled:false,start:'21:00',end:'07:00'},
 whitelist:{enabled:false,channels:[]}
};
var state=load(),player=null,currentId=null,currentList=[],currentIndex=-1,parentOpen=false,kidMode=false,modalCb=null;
var usageTick=null,lastUsageStamp=0,selectedAvatar='👧',quickMeta={id:'',title:'',channel:''};

function $(id){return document.getElementById(id)}
function clone(v){return JSON.parse(JSON.stringify(v))}
function todayKey(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
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
  if(!v.bedtime)v.bedtime=clone(DEFAULT.bedtime);
  if(!v.whitelist)v.whitelist=clone(DEFAULT.whitelist);
  if(!v.videos)v.videos=[];
  v.videos.forEach(function(x,i){if(!x.addedAt)x.addedAt=Date.now()-i*1000;if(typeof x.recommended!=='boolean')x.recommended=false;if(!x.channel)x.channel=''});
  return Object.assign(clone(DEFAULT),v);
 }catch(e){return clone(DEFAULT)}
}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
function profile(){return state.profiles[state.activeProfile]}
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

window.onYouTubeIframeAPIReady=function(){
 var origin=(location.protocol==='http:'||location.protocol==='https:')?location.origin:undefined;
 var opts={height:'390',width:'640',videoId:availableVideos()[0]?availableVideos()[0].id:'',
  playerVars:{playsinline:1,rel:0,modestbranding:1},
  events:{onReady:function(){renderAll();startUsageTracking()},onStateChange:onState,onError:onErr}};
 if(origin)opts.playerVars.origin=origin;
 player=new YT.Player('player',opts);
};
function onState(e){
 if(e.data===YT.PlayerState.PLAYING||e.data===YT.PlayerState.CUED)setTimeout(updateStoredVideoMetaFromPlayer,300);
 if(e.data===YT.PlayerState.ENDED)nextVideo();
}
function onErr(e){
 var msg='YouTube 播放錯誤：'+e.data;
 if(e.data===153)msg='錯誤 153：請從 GitHub Pages / HTTPS 網址開啟。';
 if(e.data===101||e.data===150)msg='這部影片禁止外部嵌入。';
 if(e.data===100)msg='影片不存在、已刪除或私人影片。';
 alert(msg);
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

function showPlayer(){$('kidsHome').classList.add('hidden');$('hero').classList.add('hidden');$('playerSection').classList.remove('hidden')}
function showHome(){if($('parentPanel'))$('parentPanel').classList.add('hidden');parentOpen=false;$('playerSection').classList.add('hidden');$('hero').classList.remove('hidden');$('kidsHome').classList.remove('hidden');renderRows();updateUsageUI()}
function selectVideo(id,list){
 if(!canPlay())return;
 currentList=(list&&list.length?list:availableVideos()).filter(function(v){return !v.category||allowedVideo(v)});
 currentIndex=currentList.findIndex(function(v){return v.id===id});currentId=id;showPlayer();
 if(player&&player.loadVideoById)player.loadVideoById(id);
 var v=videoById(id),t=(v&&v.title)||(quickMeta.id===id&&quickMeta.title)||'播放中';
 $('nowPlaying').textContent=t;addRecent(id);updateFavBtn();updateHero();
}
function addRecent(id){var p=profile();p.recent=p.recent.filter(function(x){return x!==id});p.recent.unshift(id);p.recent=p.recent.slice(0,40);save()}
function nextVideo(){if(!currentList.length)return;currentIndex=(currentIndex+1)%currentList.length;selectVideo(currentList[currentIndex].id,currentList)}
function prevVideo(){if(!currentList.length)return;currentIndex=(currentIndex-1+currentList.length)%currentList.length;selectVideo(currentList[currentIndex].id,currentList)}
function toggleFav(){if(!currentId)return;var p=profile(),i=p.favorites.indexOf(currentId);if(i>=0)p.favorites.splice(i,1);else p.favorites.push(currentId);save();updateFavBtn();renderRows()}
function updateFavBtn(){var yes=currentId&&profile().favorites.indexOf(currentId)>=0;$('favBtn').textContent=yes?'★ 已收藏':'☆ 最愛'}
function resumeVideo(id,list){var pr=profile().progress[id];selectVideo(id,list);if(pr&&pr.current>5&&player)setTimeout(function(){try{player.seekTo(pr.current,true)}catch(e){}},800)}
function makeCard(v,opts){
 opts=opts||{};var card=document.createElement('div');card.className='video-card';
 var p=profile().progress[v.id],pct=0;if(p&&p.duration>0)pct=Math.min(100,Math.round(p.current/p.duration*100));
 card.innerHTML='<div class="thumb-wrap"><img src="'+thumb(v.id)+'"><span class="badge">'+esc(opts.badge||v.category||'影片')+'</span></div>'+
 '<div class="body"><h3>'+esc(v.title)+'</h3><div class="card-meta">'+esc(v.channel||'')+(pct?' · 已觀看 '+pct+'%':'')+'</div></div>';
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
  addRow('我的最愛',p.favorites.map(videoById).filter(function(v){return v&&allowedVideo(v)}).slice(0,20),'只屬於 '+p.name+' 的收藏',{badge:'★ 最愛'});
  addRow('最近觀看',p.recent.map(videoById).filter(function(v){return v&&allowedVideo(v)}).slice(0,16),'最近點過的影片',{badge:'最近看過'});
  addRow('最近加入',all.slice().sort(function(a,b){return (b.addedAt||0)-(a.addedAt||0)}).slice(0,16),'家長最近新增的內容',{badge:'新加入'});
  ['英文','兒歌','卡通','故事','學習'].forEach(function(cat){addRow(cat+'專區',all.filter(function(v){return v.category===cat}).slice(0,20),'',{badge:cat})});
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

function openYouTubeSearch(){
 var q=$('homeSearchInput').value.trim();if(!q){$('homeSearchInput').focus();return}
 var u='https://www.youtube.com/results?search_query='+encodeURIComponent(q),w=window.open(u,'_blank');if(!w)location.href=u;
}
function resetQuickPreview(){quickMeta={id:'',title:'',channel:''};$('quickPreview').classList.add('hidden')}
function showQuickPreview(id,title,channel){quickMeta={id:id,title:title||'YouTube 影片',channel:channel||''};$('quickPreviewImg').src=thumb(id);$('quickPreviewTitle').textContent=quickMeta.title;$('quickPreviewChannel').textContent=quickMeta.channel;$('quickPreview').classList.remove('hidden')}
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
 if(state.videos.some(function(x){return x.id===v.id})){$('quickAddStatus').textContent='這部影片已經在影片庫裡。';return}
 state.videos.push({id:v.id,title:v.title,channel:v.channel,category:v.category,recommended:false,addedAt:Date.now()});save();renderAll();$('quickAddStatus').innerHTML='<span class="ok">✓ 已加入影片庫：'+esc(v.title)+'</span>';
}
function updateStoredVideoMetaFromPlayer(){
 if(!player||!currentId||!player.getVideoData)return;
 try{
  var d=player.getVideoData(),title=d&&d.title||'',author=d&&d.author||'',v=videoById(currentId);
  if(v){if(title&&(!v.title||v.title==='YouTube 影片'||v.title==='新影片'))v.title=title;if(author&&!v.channel)v.channel=author;save();renderRows();renderManage()}
  if(quickMeta.id===currentId){if(title)quickMeta.title=title;if(author)quickMeta.channel=author;if(!$('quickPreview').classList.contains('hidden')){ $('quickPreviewTitle').textContent=quickMeta.title;$('quickPreviewChannel').textContent=quickMeta.channel;}}
 }catch(e){}
}

function askPin(cb){modalCb=cb;$('modal').classList.remove('hidden');$('modalInput').value='';$('modalInput').focus()}
function closeModal(v){$('modal').classList.add('hidden');if(modalCb){var f=modalCb;modalCb=null;f(v)}}
function openParent(){if(parentOpen){closeParent();return}askPin(function(ok){if(ok){parentOpen=true;$('kidsHome').classList.add('hidden');$('hero').classList.add('hidden');$('playerSection').classList.add('hidden');$('parentPanel').classList.remove('hidden');loadParentFields();renderManage()}})}
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
function addVideo(){var id=ytId($('urlInput').value.trim());if(!id){alert('無法辨識 YouTube 網址');return}if(state.videos.some(function(v){return v.id===id})){alert('這部影片已存在');return}state.videos.push({id:id,title:$('titleInput').value.trim()||'新影片',category:$('categoryInput').value,channel:$('channelInput').value.trim(),recommended:false,addedAt:Date.now()});save();renderAll()}
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

document.addEventListener('DOMContentLoaded',function(){
 document.querySelectorAll('.category-chip').forEach(function(b){b.onclick=function(){applyFilter(b.dataset.filter)}});
 document.querySelectorAll('.avatar-grid button').forEach(function(b){b.onclick=function(){selectedAvatar=b.dataset.avatar;document.querySelectorAll('.avatar-grid button').forEach(function(x){x.classList.toggle('active',x.dataset.avatar===selectedAvatar)})}});
 $('homeSearchBtn').onclick=openYouTubeSearch;$('quickPlayBtn').onclick=quickPlayHome;$('quickAddBtn').onclick=quickAddHome;
 $('homeSearchInput').addEventListener('keydown',function(e){if(e.key==='Enter'||e.keyCode===13)openYouTubeSearch()});
 $('quickUrlInput').addEventListener('keydown',function(e){if(e.key==='Enter'||e.keyCode===13)quickPlayHome()});
 $('quickUrlInput').addEventListener('input',function(){setTimeout(inspectQuickUrl,80)});
 $('quickUrlInput').addEventListener('paste',function(){setTimeout(inspectQuickUrl,150)});
 $('profileBtn').onclick=toggleProfile;$('homeBtn').onclick=showHome;$('parentBtn').onclick=openParent;$('closeParentBtn').onclick=closeParent;$('backToHomeBtn').onclick=showHome;$('kidModeBtn').onclick=setKidMode;
 $('heroPlayBtn').onclick=function(){var rec=availableVideos().filter(function(v){return v.recommended}),p=profile(),v=rec[0]||(p.recent.length?videoById(p.recent[0]):availableVideos()[0]);if(v)selectVideo(v.id,availableVideos())};
 $('prevBtn').onclick=prevVideo;$('nextBtn').onclick=nextVideo;$('playBtn').onclick=function(){if(!player||!canPlay())return;player.getPlayerState()===YT.PlayerState.PLAYING?player.pauseVideo():player.playVideo()};$('favBtn').onclick=toggleFav;
 $('fullBtn').onclick=function(){var el=$('playerSection');if(el.requestFullscreen)el.requestFullscreen();else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen()};
 $('addBtn').onclick=addVideo;$('batchAddBtn').onclick=batchAdd;
 $('savePinBtn').onclick=function(){var p=$('pinInput').value.trim();if(!/^\d{4,6}$/.test(p)){alert('請輸入 4～6 位數 PIN');return}state.pin=p;save();$('pinInput').value='';alert('PIN 已更新')};
 $('profileSelect').onchange=function(){state.activeProfile=this.value;loadParentFields();renderProfile()};$('dailyLimit').onchange=function(){profile().dailyLimit=parseInt(this.value,10)||0;save();updateUsageUI()};
 $('saveProfileBtn').onclick=saveProfileSettings;$('saveBedBtn').onclick=saveBed;$('saveWhitelistBtn').onclick=saveWhitelist;$('exportBtn').onclick=exportData;$('importInput').onchange=function(){if(this.files[0])importData(this.files[0])};
 $('modalCancel').onclick=function(){closeModal(false)};$('modalOk').onclick=function(){closeModal($('modalInput').value===state.pin)};
 if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
 renderAll();showHome();
});
})();