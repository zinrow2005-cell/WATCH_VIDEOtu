var APP_VERSION='1.5.7.27';
var APP_BUILD='15691';
var watchFullscreenScrollY=0;
var miniPlayerSuppressUntil=0;
(function(){
'use strict';
var STORAGE='familytube_v15679';
var OLD_KEYS=['familytube_v15678','familytube_v15677','familytube_v15676','familytube_v15675','familytube_v15674','familytube_v15673','familytube_v15672','familytube_v15671','familytube_v15670','familytube_v15669','familytube_v15668','familytube_v15667','familytube_v15666','familytube_v15665','familytube_v15664','familytube_v15663','familytube_v15662','familytube_v15661','familytube_v15660','familytube_v15659','familytube_v15658','familytube_v15657','familytube_v15656','familytube_v15655','familytube_v15654','familytube_v15653','familytube_v15652','familytube_v15651','familytube_v15650','familytube_v15649','familytube_v15648','familytube_v15647','familytube_v15646','familytube_v15645','familytube_v15644','familytube_v15643','familytube_v15642','familytube_v15641','familytube_v15640','familytube_v15639','familytube_v15638','familytube_v15637','familytube_v15636','familytube_v15635','familytube_v15634','familytube_v15633','familytube_v15632','familytube_v15631','familytube_v15630','familytube_v15629','familytube_v15628','familytube_v15627','familytube_v15626','familytube_v15625','familytube_v15624','familytube_v15623','familytube_v15622','familytube_v15621','familytube_v15620','familytube_v15619','familytube_v15618','familytube_v15617','familytube_v15616','familytube_v15615','familytube_v15614','familytube_v15613','familytube_v15612','familytube_v15611','familytube_v15610','familytube_v1569','familytube_v1568','familytube_v1567','familytube_v1566','familytube_v1565','familytube_v1564','familytube_v1563','familytube_v1562','familytube_v1561','familytube_v156','familytube_v155','familytube_v154','familytube_v153','familytube_v152','familytube_v151','familytube_v15','familytube_v14','familytube_v13','familytube_v12'];
var CURATED_CHILD_VIDEOS=[{"id":"GqO5yfViGDE","title":"妙妙犬布麗 Bluey｜天天都好玩","category":"故事","channel":"YOYOTV","recommended":true,"curated":true,"addedAt":1791281675560,"categoryManual":true,"autoCategory":false},{"id":"Hg7vNCIjIwk","title":"英文學習推薦｜使用者指定影片","category":"英文","channel":"YouTube Kids / English","recommended":true,"curated":true,"addedAt":1791281272281,"categoryManual":true,"autoCategory":false},{"id":"eegWzglBMh0","title":"ABC Chant｜Lingokids 英文字母歌","category":"英文","channel":"Lingokids","recommended":true,"curated":true,"addedAt":1791281271281,"categoryManual":true,"autoCategory":false},{"id":"-MtVI33De6s","title":"ABC Animals｜字母與動物英文學習","category":"英文","channel":"English Learning","recommended":true,"curated":true,"addedAt":1791281270281,"categoryManual":true,"autoCategory":false},{"id":"Z0xPZ47u4z4","title":"ABC Song｜英文字母歌曲","category":"英文","channel":"English Learning","recommended":true,"curated":true,"addedAt":1791281269281,"categoryManual":true,"autoCategory":false},{"id":"yyew5ojyjg8","title":"朱妮托尼｜TOP 經典兒歌合集","category":"兒歌","channel":"朱妮托尼 中文","recommended":true,"curated":true,"addedAt":1791281268281,"categoryManual":true,"autoCategory":false},{"id":"Ya6YAH3YL2E","title":"朱妮托尼｜兒歌童謠與卡通故事合集","category":"兒歌","channel":"朱妮托尼","recommended":true,"curated":true,"addedAt":1791281267281,"categoryManual":true,"autoCategory":false},{"id":"l1yRTzqGLNA","title":"巧虎｜幼兒安全與生活學習","category":"卡通","channel":"巧虎TV","recommended":true,"curated":true,"addedAt":1791281266281,"categoryManual":true,"autoCategory":false},{"id":"4ScOx5ci-YQ","title":"Bebefinn｜兒歌與幼兒學習合集","category":"學習","channel":"Bebefinn","recommended":true,"curated":true,"addedAt":1791281265281,"categoryManual":true,"autoCategory":false},{"id":"eUunYTYia3I","title":"AMAZING ANIMALS｜兒童動物大自然 1 小時","category":"自然／動物","channel":"Nat Geo Kids","recommended":true,"curated":true,"addedAt":1791281264281,"categoryManual":true,"autoCategory":false},{"id":"y_rH7cllMbU","title":"數字顏色推薦｜使用者指定影片 1","category":"數字／顏色","channel":"YouTube Kids","recommended":true,"curated":true,"addedAt":1791281263281,"categoryManual":true,"autoCategory":false},{"id":"G-NEBETYGDI","title":"數字顏色推薦｜使用者指定影片 2","category":"數字／顏色","channel":"YouTube Kids","recommended":true,"curated":true,"addedAt":1791281262281,"categoryManual":true,"autoCategory":false},{"id":"jM6dykYy0xw","title":"Numbers & Colors for Kids｜數字與顏色","category":"數字／顏色","channel":"Kids Fun House","recommended":true,"curated":true,"addedAt":1791281261281,"categoryManual":true,"autoCategory":false},{"id":"P0C1_bOhPV4","title":"Colorful Compilation｜顏色、字母與數字","category":"數字／顏色","channel":"Super Simple Songs","recommended":true,"curated":true,"addedAt":1791281260281,"categoryManual":true,"autoCategory":false},{"id":"zxIpA5nF_LY","title":"What's Your Favorite Color?｜顏色英文歌","category":"數字／顏色","channel":"Super Simple Songs","recommended":true,"curated":true,"addedAt":1791281259281,"categoryManual":true,"autoCategory":false},{"id":"kDdg2M1_EuE","title":"The Alphabet Is So Much Fun｜ABC 英文字母歌","category":"英文","channel":"Super Simple Songs","recommended":true,"curated":true,"addedAt":0,"categoryManual":true,"autoCategory":false},{"id":"vD98OvvDNEs","title":"The Alphabet Song｜英文字母學習","category":"英文","channel":"Super Simple Songs","recommended":true,"curated":true,"addedAt":0,"categoryManual":true,"autoCategory":false}];
var DEFAULT={
 videos:CURATED_CHILD_VIDEOS.slice(),
 profiles:{
  daughter:{name:'女兒',avatar:'👧',favorites:[],recent:[],progress:{},dailyLimit:60,usage:{}},
  son:{name:'兒子',avatar:'👦',favorites:[],recent:[],progress:{},dailyLimit:60,usage:{}}
 },
 activeProfile:'daughter',pin:'1234',
 bedtime:{enabled:false,start:'21:00',end:'07:00'},
 playback:{loopCurrent:false},
 whitelist:{enabled:false,channels:[]},
 music:{favorites:[],recent:[],volume:0.85},
 ktv:{queue:[],recent:[],favorites:[],singCount:{}},
 tv:{favorites:[],recent:[],lastCountry:'tw'}
};
var state=load(),player=null,currentId=null,currentList=[],currentIndex=-1,parentOpen=false,modalCb=null;
var usageTick=null,lastUsageStamp=0,selectedAvatar='👧',immersiveFull=false,relatedBusy=false,relatedItems=[];
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
   p.favorites=(p.favorites||[]).filter(function(id){return id!=='M7lc1UVf-VE'});
   p.recent=(p.recent||[]).filter(function(id){return id!=='M7lc1UVf-VE'});
   if(p.progress&&p.progress['M7lc1UVf-VE'])delete p.progress['M7lc1UVf-VE'];
   if(!p.avatar)p.avatar=k==='daughter'?'👧':'👦';
   if(!p.favorites)p.favorites=[];
   if(!p.recent)p.recent=[];
   if(!p.progress)p.progress={};
   if(typeof p.dailyLimit!=='number')p.dailyLimit=60;
   if(!p.usage)p.usage={};
  });
  if(!v.bedtime)v.bedtime=clone(DEFAULT.bedtime);if(!v.playback)v.playback=clone(DEFAULT.playback);
  if(!v.whitelist)v.whitelist=clone(DEFAULT.whitelist);if(!v.music)v.music=clone(DEFAULT.music);if(!v.music.favorites)v.music.favorites=[];if(!v.music.recent)v.music.recent=[];if(typeof v.music.volume!=='number')v.music.volume=0.85;if(!v.ktv)v.ktv=clone(DEFAULT.ktv);if(!v.ktv.queue)v.ktv.queue=[];if(!v.ktv.recent)v.ktv.recent=[];if(!v.ktv.favorites)v.ktv.favorites=[];if(!v.ktv.singCount)v.ktv.singCount={};if(!v.tv)v.tv=clone(DEFAULT.tv);if(!v.tv.favorites)v.tv.favorites=[];if(!v.tv.recent)v.tv.recent=[];if(!v.tv.lastCountry)v.tv.lastCountry='tw';
  
  if(!v.videos)v.videos=[];
  /* V1.5.6.58: remove old built-in YouTube test clip and seed curated child recommendations. */
  v.videos=v.videos.filter(function(x){
   return x&&x.id!=='M7lc1UVf-VE'&&String(x.title||'').indexOf('YouTube 播放測試')<0;
  });
  var existingVideoIds={};
  v.videos.forEach(function(x){if(x&&x.id)existingVideoIds[x.id]=1});
  CURATED_CHILD_VIDEOS.forEach(function(seed){
   if(!existingVideoIds[seed.id]){
    v.videos.push(clone(seed));existingVideoIds[seed.id]=1;
   }
  });

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


var RADIO_SERVERS=[
 'https://de2.api.radio-browser.info',
 'https://fi1.api.radio-browser.info',
 'https://de1.api.radio-browser.info'
];
var RADIO_SERVER_DISCOVERY_DONE=false;
var RADIO_BOOTSTRAP_SERVERS=[
 'https://de2.api.radio-browser.info',
 'https://fi1.api.radio-browser.info'
];


function uniqueRadioServers(list){
 var seen={},out=[];
 (list||[]).forEach(function(x){
  var u=String(x||'').replace(/\/+$/,'');
  if(!u||seen[u])return;
  if(u.indexOf('https://')!==0)return;
  seen[u]=1;out.push(u);
 });
 return out;
}
function discoverRadioServers(){
 if(RADIO_SERVER_DISCOVERY_DONE)return Promise.resolve(RADIO_SERVERS.slice());
 var boots=RADIO_BOOTSTRAP_SERVERS.slice(),i=0;
 function next(){
  if(i>=boots.length){
   RADIO_SERVER_DISCOVERY_DONE=true;
   RADIO_SERVERS=uniqueRadioServers(RADIO_SERVERS);
   return Promise.resolve(RADIO_SERVERS.slice());
  }
  var base=boots[i++];
  return radioFetch(base+'/json/servers',4500).then(function(arr){
   var found=[];
   (arr||[]).forEach(function(s){
    var name=s&&s.name?String(s.name):'';
    if(name)found.push('https://'+name);
   });
   RADIO_SERVERS=uniqueRadioServers(found.concat(RADIO_SERVERS));
   RADIO_SERVER_DISCOVERY_DONE=true;
   return RADIO_SERVERS.slice();
  }).catch(function(){return next()});
 }
 return next();
}

var RADIO_CATEGORIES={
 popular:{label:'熱門電台',mode:'top'},
 mandarin:{label:'華語／中文',tag:'mandarin,chinese,c-pop'},
 pop:{label:'流行音樂',tag:'pop,hits,top 40'},
 jazz:{label:'Jazz',tag:'jazz'},
 classical:{label:'古典音樂',tag:'classical'},
 lofi:{label:'Lo-fi／輕音樂',tag:'lofi,chillout,ambient'},
 rock:{label:'搖滾',tag:'rock'},
 oldies:{label:'懷舊／經典',tag:'oldies,classic hits,retro'},
 news:{label:'新聞／談話',tag:'news,talk'}
};
var radioCategory='popular';
var radioLoadSerial=0;


var musicModeActive=false,musicItems=[],musicCurrent=null,musicIndex=-1,musicBusy=false,musicNav='search';

function showVideoMode(){
 try{if(typeof leaveTvMode==='function')leaveTvMode()}catch(e){}
 try{if(typeof leaveKtvMode==='function')leaveKtvMode()}catch(e){}
 document.body.classList.remove('music-mode-active');
 musicModeActive=false;
 if($('musicMode'))$('musicMode').classList.add('hidden');
 if($('videoModeBtn'))$('videoModeBtn').classList.add('active');
 if($('musicModeBtn'))$('musicModeBtn').classList.remove('active');
 if($('hero'))$('hero').classList.remove('hidden');
 if($('kidsHome'))$('kidsHome').classList.remove('hidden');
 if($('playerSection'))$('playerSection').classList.add('hidden');
 showHome();
}

function showMusicMode(){
 try{if(typeof leaveTvMode==='function')leaveTvMode()}catch(e){}
 try{if(typeof leaveKtvMode==='function')leaveKtvMode()}catch(e){}
 document.body.classList.add('music-mode-active');
 try{if(immersiveFull)exitImmersiveFullscreen()}catch(e){}
 try{stopPlaybackForHome()}catch(e){}
 musicModeActive=true;
 document.body.classList.remove('watch-mode');
 if($('hero'))$('hero').classList.add('hidden');
 if($('kidsHome'))$('kidsHome').classList.add('hidden');
 if($('playerSection'))$('playerSection').classList.add('hidden');
 if($('parentPanel'))$('parentPanel').classList.add('hidden');
 if($('musicMode'))$('musicMode').classList.remove('hidden');
 if($('videoModeBtn'))$('videoModeBtn').classList.remove('active');
 if($('musicModeBtn'))$('musicModeBtn').classList.add('active');
 renderMusicNav(musicNav);
 if(musicNav==='search'&&(!musicItems||!musicItems.length))loadRadioCategory(radioCategory);
 try{window.scrollTo(0,0)}catch(e){}
}

function musicKey(s){return String((s&&s.stationuuid)||'')}

function musicFavoriteIndex(id){
 var a=state.music.favorites||[];
 for(var i=0;i<a.length;i++){if(a[i]&&a[i].stationuuid===id)return i}
 return -1;
}
function isMusicFavorite(id){return musicFavoriteIndex(id)>=0}

function rememberMusicRecent(st){
 if(!st||!st.stationuuid)return;
 var arr=(state.music.recent||[]).filter(function(x){return x&&x.stationuuid!==st.stationuuid});
 arr.unshift(st);
 state.music.recent=arr.slice(0,40);
 save();
}

function toggleMusicFavorite(){
 if(!musicCurrent)return;
 var idx=musicFavoriteIndex(musicCurrent.stationuuid);
 if(idx>=0)state.music.favorites.splice(idx,1);
 else state.music.favorites.unshift(musicCurrent);
 save();
 updateMusicFavBtn();
 if(musicNav==='favorites')renderMusicItems(state.music.favorites||[]);
}

function updateMusicFavBtn(){
 if(!$('musicFavBtn'))return;
 var yes=musicCurrent&&isMusicFavorite(musicCurrent.stationuuid);
 $('musicFavBtn').textContent=yes?'★ 已收藏':'☆ 收藏';
 $('musicFavBtn').classList.toggle('active',!!yes);
}

function radioFetch(url,ms){
 return new Promise(function(resolve,reject){
  var done=false;
  var timer=setTimeout(function(){if(done)return;done=true;reject(new Error('timeout'))},ms||5000);
  fetch(url,{method:'GET',mode:'cors',cache:'no-store'}).then(function(r){
   if(!r.ok)throw new Error('HTTP '+r.status);
   return r.json();
  }).then(function(j){
   if(done)return;done=true;clearTimeout(timer);resolve(j);
  },function(e){
   if(done)return;done=true;clearTimeout(timer);reject(e);
  });
 });
}

function fetchRadioSearch(q){
 var servers=RADIO_SERVERS.slice(),si=0;
 function unique(items){
  var seen={},out=[];
  (items||[]).forEach(function(x){
   var id=x&&x.stationuuid;
   if(id&&!seen[id]&&(x.url_resolved||x.url)){seen[id]=1;out.push(x)}
  });
  return out;
 }
 function tryServer(base){
  var common='&limit=60&hidebroken=true&order=clickcount&reverse=true';
  var u1=base+'/json/stations/search?name='+encodeURIComponent(q)+common;
  var u2=base+'/json/stations/search?tag='+encodeURIComponent(q)+common;
  return Promise.all([
   radioFetch(u1,6500).catch(function(){return []}),
   radioFetch(u2,6500).catch(function(){return []})
  ]).then(function(parts){
   var found=unique((parts[0]||[]).concat(parts[1]||[]));
   if(found.length)return found;
   // If keyword gives zero results, return popular working stations from this server.
   return radioFetch(base+'/json/stations/topclick/40?hidebroken=true',6500).then(function(pop){
    pop=unique(pop);
    if(pop.length)return pop;
    throw new Error('empty');
   });
  });
 }
 function next(){
  if(si>=servers.length)return Promise.reject(new Error('目前無法連線到網路音樂目錄，請稍後再試'));
  var base=servers[si++];
  return tryServer(base).catch(function(){return next()});
 }
 return next();
}

function normalizeStation(x){
 var rawUrl=String(x.url_resolved||x.url||'');
 var usableUrl=rawUrl;
 if(location.protocol==='https:'&&/^http:\/\//i.test(rawUrl))usableUrl='';
 return {
  stationuuid:String(x.stationuuid||''),
  name:String(x.name||'Unknown Station'),
  url:usableUrl,
  homepage:String(x.homepage||''),
  favicon:String(x.favicon||''),
  tags:String(x.tags||''),
  countrycode:String(x.countrycode||''),
  codec:String(x.codec||''),
  bitrate:parseInt(x.bitrate||0,10)||0
 };
}


function stationContentLabel(st){
 var raw=((st.tags||'')+' '+(st.name||'')).toLowerCase();
 var labels=[];
 function hit(words,label){
  for(var i=0;i<words.length;i++){
   if(raw.indexOf(words[i])>=0){labels.push(label);return}
  }
 }
 hit(['mandarin','chinese','c-pop','中文','華語'],'華語／中文');
 hit(['pop','hits','top 40'],'流行音樂');
 hit(['jazz'],'Jazz');
 hit(['classical','symphony','opera'],'古典音樂');
 hit(['lofi','lo-fi','chill','ambient','relax'],'Lo-fi／輕音樂');
 hit(['rock','metal','alternative'],'搖滾');
 hit(['oldies','classic hits','retro','80s','90s'],'懷舊／經典');
 hit(['news','talk','speech'],'新聞／談話');
 hit(['dance','edm','house','trance'],'舞曲／電子');
 hit(['country','folk'],'鄉村／民謠');
 hit(['religious','christian','gospel'],'宗教／福音');
 if(!labels.length){
  var t=(st.tags||'').split(',').filter(Boolean).slice(0,2).join('／');
  if(t)labels.push(t);
 }
 return labels.slice(0,2).join(' · ')||'綜合內容';
}
function stationDescription(st){
 var parts=[stationContentLabel(st)];
 if(st.countrycode)parts.push(st.countrycode);
 if(st.codec)parts.push(st.codec+(st.bitrate?' '+st.bitrate+'kbps':''));
 return parts.join('｜');
}
function fetchRadioTop(){
 var servers=RADIO_SERVERS.slice(),si=0;
 function next(){
  if(si>=servers.length)return Promise.reject(new Error('目前無法取得電台清單'));
  var base=servers[si++];
  return radioFetch(base+'/json/stations/topclick/80?hidebroken=true',6500).then(function(arr){
   if(!Array.isArray(arr)||!arr.length)throw new Error('empty');
   return arr;
  }).catch(function(){return next()});
 }
 return next();
}
function fetchRadioCategory(cat){
 var cfg=RADIO_CATEGORIES[cat]||RADIO_CATEGORIES.popular;
 if(cfg.mode==='top')return fetchRadioTop();
 var tags=(cfg.tag||'').split(','),ti=0,all=[];
 function oneTag(){
  if(ti>=tags.length){
   var seen={},out=[];
   all.forEach(function(x){if(x&&x.stationuuid&&!seen[x.stationuuid]){seen[x.stationuuid]=1;out.push(x)}});
   if(out.length)return Promise.resolve(out);
   return fetchRadioTop();
  }
  var tag=tags[ti++].trim();
  return fetchRadioSearch(tag).then(function(arr){all=all.concat(arr||[]);return oneTag()})
   .catch(function(){return oneTag()});
 }
 return oneTag();
}
function loadRadioCategory(cat){
 var loadId=++radioLoadSerial;
 radioCategory=cat||'popular';

 document.querySelectorAll('.radio-cat').forEach(function(b){
  b.classList.toggle('active',b.dataset.radioCat===radioCategory);
 });

 var cfg=RADIO_CATEGORIES[radioCategory]||RADIO_CATEGORIES.popular;
 if($('musicSearchStatus'))$('musicSearchStatus').textContent='正在尋找可用電台伺服器…';

 discoverRadioServers().then(function(){
  if(loadId!==radioLoadSerial)return [];
  if($('musicSearchStatus'))$('musicSearchStatus').textContent='正在載入「'+cfg.label+'」…';
  return fetchRadioCategory(radioCategory);
 }).then(function(arr){
  if(loadId!==radioLoadSerial)return;

  var seen={},items=[],blocked=0;
  (arr||[]).forEach(function(x){
   var st=normalizeStation(x);
   if(!st.url){blocked++;return}
   if(st.stationuuid&&!seen[st.stationuuid]){
    seen[st.stationuuid]=1;
    items.push(st);
   }
  });

  if(items.length){
   if($('musicSearchStatus'))$('musicSearchStatus').textContent='目前可播放 '+items.length+' 個「'+cfg.label+'」來源';
  }else if(blocked){
   if($('musicSearchStatus'))$('musicSearchStatus').textContent='找到電台，但來源不是安全 HTTPS 串流，手機瀏覽器無法播放。請換分類或重試。';
  }else{
   if($('musicSearchStatus'))$('musicSearchStatus').textContent='目前沒有取得可播放電台，請按「重新載入」。';
  }

  renderMusicItems(items.slice(0,80));

 }).catch(function(){
  if(loadId!==radioLoadSerial)return;
  if($('musicSearchStatus'))$('musicSearchStatus').textContent='目前無法取得電台清單，請按「重新載入」再試。';
  renderMusicItems([]);
 });
}

function renderMusicItems(items){
 musicItems=(items||[]).filter(function(x){return x&&x.stationuuid&&x.url});
 var root=$('musicResults');if(!root)return;
 root.innerHTML='';
 if(!musicItems.length){
  root.innerHTML='<div class="music-empty">目前沒有內容，請換一個關鍵字試試</div>';return;
 }
 var frag=document.createDocumentFragment();
 musicItems.forEach(function(st,idx){
  var card=document.createElement('button');
  card.type='button';card.className='music-card';
  var art=(st.favicon&&st.favicon.indexOf('https://')===0)?st.favicon:'icons/icon-192.png';
  card.innerHTML='<img src="'+esc(art)+'" alt=""><span class="music-card-copy"><b>'+esc(st.name)+'</b><small class="music-station-desc">'+esc(stationDescription(st))+'</small></span><span class="music-card-play">▶</span>';
  var im=card.querySelector('img');im.onerror=function(){this.onerror=null;this.src='icons/icon-192.png'};
  card.onclick=function(){playMusicStation(st,idx,musicItems)};
  frag.appendChild(card);
 });
 root.appendChild(frag);
}

function renderMusicNav(which){
 musicNav=which||'search';
 document.querySelectorAll('.music-nav').forEach(function(b){b.classList.toggle('active',b.dataset.musicnav===musicNav)});
 if($('musicResults'))$('musicResults').classList.remove('hidden');
 if(musicNav==='favorites')renderMusicItems(state.music.favorites||[]);
 else if(musicNav==='recent')renderMusicItems(state.music.recent||[]);
 else if(musicNav==='search'&&(!musicItems||!musicItems.length))loadRadioCategory(radioCategory);
}


function searchMusic(){
 if(musicBusy)return;
 var q=$('musicSearchInput').value.trim();
 if(!q){$('musicSearchInput').focus();return}
 musicBusy=true;
 $('musicSearchBtn').disabled=true;
 $('musicSearchStatus').textContent='正在搜尋電台…';
 fetchRadioSearch(q).then(function(arr){
  musicBusy=false;$('musicSearchBtn').disabled=false;
  var seen={},items=[];
  arr.forEach(function(x){
   var st=normalizeStation(x);
   if(st.stationuuid&&!seen[st.stationuuid]&&st.url){seen[st.stationuuid]=1;items.push(st)}
  });
  $('musicSearchStatus').textContent='找到 '+items.length+' 個可播放音樂來源';
  musicNav='search';renderMusicNav('search');renderMusicItems(items);
 },function(err){
  musicBusy=false;$('musicSearchBtn').disabled=false;
  $('musicSearchStatus').textContent=err&&err.message?err.message:'搜尋失敗';
  renderMusicItems([]);
 });
}

function setMusicSession(st){
 if(!('mediaSession' in navigator)||!st)return;
 try{
  var art=(st.favicon&&st.favicon.indexOf('https://')===0)?st.favicon:(location.origin+location.pathname.replace(/[^\/]*$/,'')+'icons/icon-512.png');
  navigator.mediaSession.metadata=new MediaMetadata({
   title:st.name||'網路音樂',
   artist:st.tags||st.countrycode||'WATCH_VIDEOtu',
   album:'WATCH_VIDEOtu Music',
   artwork:[
    {src:art,sizes:'512x512'},
    {src:location.origin+location.pathname.replace(/[^\/]*$/,'')+'icons/icon-192.png',sizes:'192x192',type:'image/png'}
   ]
  });
 }catch(e){}
}

function playMusicStation(st,idx,list){
 if(!st||!st.url)return;
 var audio=$('musicAudio');
 musicCurrent=st;
 musicItems=(list&&list.length)?list.slice():musicItems;
 musicIndex=typeof idx==='number'?idx:musicItems.findIndex(function(x){return x.stationuuid===st.stationuuid});
 $('musicTitle').textContent=st.name;
 $('musicMeta').textContent=stationDescription(st);
 $('musicCover').src=(st.favicon&&st.favicon.indexOf('https://')===0)?st.favicon:'icons/icon-512.png';
 $('musicCover').onerror=function(){this.onerror=null;this.src='icons/icon-512.png'};
 audio.src=st.url;
 audio.volume=state.music.volume||0.85;
 setMusicSession(st);
 rememberMusicRecent(st);
 updateMusicFavBtn();
 audio.play().then(function(){
  $('musicPlayBtn').textContent='⏸';
  if('mediaSession' in navigator)navigator.mediaSession.playbackState='playing';
 }).catch(function(){
  $('musicSearchStatus').textContent='這個來源目前無法播放，請換另一個。';
 });
}

function toggleMusicPlay(){
 var a=$('musicAudio');
 if(!a.src)return;
 if(a.paused)a.play();else a.pause();
}
function stopMusic(){
 var a=$('musicAudio');a.pause();
 try{a.currentTime=0}catch(e){}
 $('musicPlayBtn').textContent='▶';
 if('mediaSession' in navigator)navigator.mediaSession.playbackState='none';
}
function nextMusic(){
 if(!musicItems.length)return;
 musicIndex=(musicIndex+1+musicItems.length)%musicItems.length;
 playMusicStation(musicItems[musicIndex],musicIndex,musicItems);
}
function prevMusic(){
 if(!musicItems.length)return;
 musicIndex=(musicIndex-1+musicItems.length)%musicItems.length;
 playMusicStation(musicItems[musicIndex],musicIndex,musicItems);
}

function setupMediaSessionActions(){
 if(!('mediaSession' in navigator))return;
 try{navigator.mediaSession.setActionHandler('play',function(){$('musicAudio').play()})}catch(e){}
 try{navigator.mediaSession.setActionHandler('pause',function(){$('musicAudio').pause()})}catch(e){}
 try{navigator.mediaSession.setActionHandler('stop',stopMusic)}catch(e){}
 try{navigator.mediaSession.setActionHandler('nexttrack',nextMusic)}catch(e){}
 try{navigator.mediaSession.setActionHandler('previoustrack',prevMusic)}catch(e){}
}


var ktvModeActive=false,ktvNav='hot',ktvSearchType='all',ktvSearchResults=[],ktvBusy=false,ktvCurrent=null,ktvSingerFilter='all',ktvSingerLetter='all';
var ktvCurrentSinger=null;

var KTV_ZHUYIN_INITIAL_MAP={"丁":"ㄉ","五":"ㄨ","任":"ㄖ","伍":"ㄨ","何":"ㄏ","信":"ㄒ","側":"ㄘ","優":"ㄧ","光":"ㄍ","八":"ㄅ","刀":"ㄉ","劉":"ㄌ","動":"ㄉ","卓":"ㄓ","南":"ㄋ","原":"ㄩ","古":"ㄍ","吳":"ㄨ","告":"ㄍ","周":"ㄓ","品":"ㄆ","單":"ㄉ","四":"ㄙ","姜":"ㄐ","孟":"ㄇ","孫":"ㄙ","宇":"ㄩ","家":"ㄐ","容":"ㄖ","小":"ㄒ","尤":"ㄧ","希":"ㄒ","庾":"ㄩ","張":"ㄓ","彭":"ㄆ","徐":"ㄒ","怕":"ㄆ","戴":"ㄉ","房":"ㄈ","持":"ㄔ","新":"ㄒ","方":"ㄈ","施":"ㄕ","旺":"ㄨ","曹":"ㄘ","曾":"ㄘ","朴":"ㄆ","李":"ㄌ","杜":"ㄉ","林":"ㄌ","柏":"ㄅ","梁":"ㄌ","梅":"ㄇ","楊":"ㄧ","毛":"ㄇ","江":"ㄐ","汪":"ㄨ","洪":"ㄏ","游":"ㄧ","溫":"ㄨ","滅":"ㄇ","潘":"ㄆ","炎":"ㄧ","無":"ㄨ","熊":"ㄒ","王":"ㄨ","玖":"ㄐ","理":"ㄌ","田":"ㄊ","畢":"ㄅ","痛":"ㄊ","瘦":"ㄕ","白":"ㄅ","盧":"ㄌ","秀":"ㄒ","童":"ㄊ","米":"ㄇ","羅":"ㄌ","羽":"ㄩ","翁":"ㄨ","老":"ㄌ","胡":"ㄏ","艾":"ㄞ","范":"ㄈ","茄":"ㄐ","草":"ㄘ","荒":"ㄏ","莫":"ㄇ","華":"ㄏ","萬":"ㄨ","葉":"ㄧ","蔡":"ㄘ","蕭":"ㄒ","薛":"ㄒ","藤":"ㄊ","蘇":"ㄙ","衛":"ㄨ","袁":"ㄩ","許":"ㄒ","詹":"ㄓ","謝":"ㄒ","譚":"ㄊ","費":"ㄈ","趙":"ㄓ","辛":"ㄒ","逃":"ㄊ","那":"ㄋ","邱":"ㄑ","郁":"ㄩ","郭":"ㄍ","鄧":"ㄉ","鄭":"ㄓ","閻":"ㄧ","關":"ㄍ","陳":"ㄔ","陶":"ㄊ","隔":"ㄍ","韋":"ㄨ","順":"ㄕ","顏":"ㄧ","飛":"ㄈ","馬":"ㄇ","高":"ㄍ","魏":"ㄨ","鳳":"ㄈ","麋":"ㄇ","黃":"ㄏ","黎":"ㄌ","鼓":"ㄍ","齊":"ㄑ","龍":"ㄌ"};
var KTV_SINGERS=(typeof KTV_SINGERS_DB!=='undefined'&&KTV_SINGERS_DB&&KTV_SINGERS_DB.length)?KTV_SINGERS_DB.slice():[];
var KTV_SONGS=(typeof KTV_SONGS_DB!=='undefined'&&KTV_SONGS_DB&&KTV_SONGS_DB.length)?KTV_SONGS_DB.slice():[];

var KTV_HOT=[
 {title:'晴天',artist:'周杰倫',region:'華語'},
 {title:'擱淺',artist:'周杰倫',region:'華語'},
 {title:'修煉愛情',artist:'林俊傑',region:'華語'},
 {title:'小酒窩',artist:'林俊傑',region:'華語'},
 {title:'突然好想你',artist:'五月天',region:'華語'},
 {title:'知足',artist:'五月天',region:'華語'},
 {title:'遇見',artist:'孫燕姿',region:'華語'},
 {title:'開始懂了',artist:'孫燕姿',region:'華語'},
 {title:'泡沫',artist:'鄧紫棋',region:'華語'},
 {title:'光年之外',artist:'鄧紫棋',region:'華語'},
 {title:'十年',artist:'陳奕迅',region:'華語'},
 {title:'好久不見',artist:'陳奕迅',region:'華語'},
 {title:'挪威的森林',artist:'伍佰',region:'華語'},
 {title:'浪人情歌',artist:'伍佰',region:'華語'},
 {title:'聽海',artist:'張惠妹',region:'華語'},
 {title:'我最親愛的',artist:'張惠妹',region:'華語'},
 {title:'勇氣',artist:'梁靜茹',region:'華語'},
 {title:'可惜不是你',artist:'梁靜茹',region:'華語'},
 {title:'如果可以',artist:'韋禮安',region:'華語'},
 {title:'怎麼了',artist:'周興哲',region:'華語'},
 {title:'小幸運',artist:'田馥甄',region:'華語'},
 {title:'給我一個理由忘記',artist:'A-Lin',region:'華語'},
 {title:'浪費',artist:'林宥嘉',region:'華語'},
 {title:'我可以',artist:'蔡旻佑',region:'華語'},
 {title:'IRIS OUT',artist:'米津玄師',region:'日韓'},
 {title:'Lemon',artist:'米津玄師',region:'日韓'},
 {title:'夜に駆ける',artist:'YOASOBI',region:'日韓'},
 {title:'Drama',artist:'aespa',region:'日韓'},
 {title:'Cruel Summer',artist:'Taylor Swift',region:'歐美'},
 {title:'Someone Like You',artist:'Adele',region:'歐美'},
 {title:'Perfect',artist:'Ed Sheeran',region:'歐美'},
 {title:'Just the Way You Are',artist:'Bruno Mars',region:'歐美'}
];

function showKtvMode(){
 try{if(typeof leaveTvMode==='function')leaveTvMode()}catch(e){}
 try{if(immersiveFull)exitImmersiveFullscreen()}catch(e){}
 try{stopPlaybackForHome()}catch(e){}
 try{stopMusic()}catch(e){}
 ktvModeActive=true;
 musicModeActive=false;
 document.body.classList.remove('watch-mode','music-mode-active');
 document.body.classList.add('ktv-mode-active');
 if($('hero'))$('hero').classList.add('hidden');
 if($('kidsHome'))$('kidsHome').classList.add('hidden');
 if($('playerSection'))$('playerSection').classList.add('hidden');
 if($('musicMode'))$('musicMode').classList.add('hidden');
 if($('parentPanel'))$('parentPanel').classList.add('hidden');
 if($('ktvMode'))$('ktvMode').classList.remove('hidden');
 $('videoModeBtn').classList.remove('active');
 $('musicModeBtn').classList.remove('active');
 $('ktvModeBtn').classList.add('active');
 renderKtvSingers();
 renderKtvNav(ktvNav);
 renderKtvQueue();
 try{window.scrollTo(0,0)}catch(e){}
}

function leaveKtvMode(){
 setKtvQueueDrawer(false);
 closeKtvPlayer();
 ktvModeActive=false;
 document.body.classList.remove('ktv-mode-active');
 if($('ktvMode'))$('ktvMode').classList.add('hidden');
 if($('ktvModeBtn'))$('ktvModeBtn').classList.remove('active');
}



var ktvToastTimer=null;
function showKtvToast(message,type){
 var t=$('ktvToast');if(!t)return;
 t.textContent=message||'';
 t.className='ktv-toast '+(type||'ok');
 if(ktvToastTimer)clearTimeout(ktvToastTimer);
 ktvToastTimer=setTimeout(function(){t.className='ktv-toast hidden'},2200);
}
function ktvQueueContains(song){
 var key=ktvSongKey(song),q=state.ktv.queue||[];
 for(var i=0;i<q.length;i++){if(ktvSongKey(q[i])===key)return true}
 return false;
}

var ktvQueueDrawerOpen=false;

function setKtvQueueDrawer(open){
 var mobile=window.innerWidth<=900;
 ktvQueueDrawerOpen=!!open&&mobile;
 document.body.classList.toggle('ktv-queue-drawer-open',ktvQueueDrawerOpen);

 var panel=$('ktvQueuePanel');
 var backdrop=$('ktvQueueDrawerBackdrop');
 var btn=$('ktvQueueDrawerBtn');

 if(panel)panel.classList.toggle('drawer-open',ktvQueueDrawerOpen);
 if(backdrop)backdrop.classList.toggle('hidden',!ktvQueueDrawerOpen);
 if(btn)btn.setAttribute('aria-expanded',ktvQueueDrawerOpen?'true':'false');
}

function toggleKtvQueueDrawer(){
 setKtvQueueDrawer(!ktvQueueDrawerOpen);
}

function updateKtvQueueCount(){
 var n=(state.ktv.queue||[]).length;

 var nav=$('ktvQueueNavCount');
 if(nav)nav.textContent=String(n);

 var drawer=$('ktvQueueDrawerCount');
 if(drawer)drawer.textContent=String(n);

 var panel=$('ktvQueuePanelCount');
 if(panel)panel.textContent=String(n);
}

function ktvSongKey(song){
 return String((song&&song.artist)||'')+'||'+String((song&&song.title)||'');
}
function recordKtvSing(song){
 if(!song)return;
 var key=ktvSongKey(song);
 state.ktv.singCount[key]=(state.ktv.singCount[key]||0)+1;
 var rec=state.ktv.recent||[];
 rec=rec.filter(function(x){return ktvSongKey(x)!==key});
 rec.unshift({title:song.title||'',artist:song.artist||song.channel||'',region:song.region||'',id:song.videoId||song.id||'',videoId:song.videoId||song.id||''});
 state.ktv.recent=rec.slice(0,50);
 save();
}
function frequentKtvSongs(){
 var map={};
 KTV_HOT.concat(state.ktv.recent||[]).forEach(function(s){
  if(s&&s.title)map[ktvSongKey(s)]=s;
 });
 return Object.keys(state.ktv.singCount||{}).map(function(k){
  var s=map[k]||{title:k.split('||')[1]||'',artist:k.split('||')[0]||''};
  return {song:s,count:state.ktv.singCount[k]||0};
 }).filter(function(x){return x.count>0}).sort(function(a,b){return b.count-a.count}).slice(0,30).map(function(x){
  var s=x.song;
  s.singCount=x.count;
  return s;
 });
}

function renderKtvNav(nav){
 ktvNav=nav||'hot';
 document.querySelectorAll('.ktv-nav').forEach(function(b){
  b.classList.toggle('active',b.dataset.ktvnav===ktvNav);
 });
 $('ktvSingerPanel').classList.toggle('hidden',ktvNav!=='singer');
 $('ktvSongPanel').classList.toggle('hidden',ktvNav==='singer'||ktvNav==='queue');
 if(ktvNav==='hot')renderKtvSongs(KTV_HOT,'熱門歌曲','快速點歌');
 else if(ktvNav==='mandarin')renderKtvSongs(KTV_HOT.filter(function(x){return x.region==='華語'}),'華語歌曲','熱門華語');
 else if(ktvNav==='jpkr')renderKtvSongs(KTV_HOT.filter(function(x){return x.region==='日韓'}),'日韓歌曲','熱門日韓');
 else if(ktvNav==='western')renderKtvSongs(KTV_HOT.filter(function(x){return x.region==='歐美'}),'歐美歌曲','熱門歐美');
 else if(ktvNav==='frequent')renderKtvSongs(frequentKtvSongs(),'我的常唱歌曲','依實際演唱次數排序');
 else if(ktvNav==='queue'){
  $('ktvSingerPanel').classList.add('hidden');
  $('ktvSongPanel').classList.remove('hidden');
  $('ktvListTitle').textContent='已點歌曲';
  $('ktvListSub').textContent='依照目前順序播放';
  renderKtvQueueAsSongs();
 }
}


function normalizeKtvText(s){return String(s||'').toLowerCase().replace(/\s+/g,'').replace(/[()（）\-_.·]/g,'')}
function localSongsByArtist(name){
 var n=normalizeKtvText(name);
 return KTV_SONGS.filter(function(s){return normalizeKtvText(s.artist)===n});
}
function searchLocalKtvSongs(q,type){
 var n=normalizeKtvText(q);if(!n)return [];
 return KTV_SONGS.filter(function(s){
  var t=normalizeKtvText(s.title),a=normalizeKtvText(s.artist);
  if(type==='song')return t.indexOf(n)>=0;
  if(type==='artist')return a.indexOf(n)>=0;
  return t.indexOf(n)>=0||a.indexOf(n)>=0||(a+t).indexOf(n)>=0;
 }).slice(0,80);
}

function ktvResultKey(song){
 var id=String((song&&song.videoId)||(song&&song.id)||'');
 if(id)return 'id:'+id;
 return 'txt:'+normalizeKtvText((song&&song.artist)||'')+'|'+normalizeKtvText((song&&song.title)||'');
}
function mergeKtvSongLists(local,online){
 var out=[],seen={};
 (local||[]).forEach(function(s){
  if(!s)return;
  var x=Object.assign({},s);
  x.source='local';
  var k=ktvResultKey(x);
  if(!seen[k]){seen[k]=1;out.push(x)}
 });
 (online||[]).forEach(function(s){
  if(!s)return;
  var x=Object.assign({},s);
  x.source='online';
  var k=ktvResultKey(x);
  if(!seen[k]){seen[k]=1;out.push(x)}
 });
 return out;
}

function ktvResultScore(v,artistName){
 var title=String((v&&v.title)||'').toLowerCase();
 var channel=String((v&&v.channel)||'').toLowerCase();
 var score=0;
 var good=['ktv','karaoke','伴奏','卡拉ok','卡拉 ok','sing along','instrumental'];
 var bad=['reaction','cover','翻唱','live','現場','concert','mv','music video','shorts','short'];
 good.forEach(function(k){if(title.indexOf(k)>=0)score+=12});
 bad.forEach(function(k){if(title.indexOf(k)>=0)score-=8});
 if(artistName&&title.indexOf(String(artistName).toLowerCase())>=0)score+=5;
 if(channel.indexOf('karaoke')>=0||channel.indexOf('ktv')>=0)score+=4;
 return score;
}
function rankKtvResults(items,artistName){
 return (items||[]).map(function(v,i){
  return {v:v,score:ktvResultScore(v,artistName),i:i};
 }).sort(function(a,b){
  if(b.score!==a.score)return b.score-a.score;
  return a.i-b.i;
 }).map(function(x){return x.v});
}


var ktvSearchSerial=0;

function setKtvSearchProgress(stage,percent,text){
 var box=$('ktvSearchProgress');
 if(!box)return;
 box.classList.remove('hidden');
 var p=Math.max(0,Math.min(100,Number(percent)||0));
 if($('ktvSearchProgressBar'))$('ktvSearchProgressBar').style.width=p+'%';
 if($('ktvSearchProgressPercent'))$('ktvSearchProgressPercent').textContent=Math.round(p)+'%';
 if($('ktvSearchProgressText'))$('ktvSearchProgressText').textContent=text||'正在搜尋…';

 var ids=['ktvProgressLocal','ktvProgressFast','ktvProgressMore','ktvProgressDone'];
 var order={local:0,fast:1,more:2,done:3};
 var current=order[stage];
 ids.forEach(function(id,i){
  var el=$(id);if(!el)return;
  el.classList.toggle('done',typeof current==='number'&&i<current);
  el.classList.toggle('active',typeof current==='number'&&i===current);
 });
}

function finishKtvSearchProgress(text){
 setKtvSearchProgress('done',100,text||'搜尋完成');
 setTimeout(function(){
  var box=$('ktvSearchProgress');
  if(box)box.classList.add('complete');
 },250);
}

function resetKtvSearchProgress(){
 var box=$('ktvSearchProgress');
 if(box){
  box.classList.add('hidden');
  box.classList.remove('complete');
 }
 if($('ktvSearchProgressBar'))$('ktvSearchProgressBar').style.width='0%';
}

function setKtvSearchBusy(on){
 ktvBusy=!!on;
 var b=$('ktvSearchBtn');
 if(b){
  b.disabled=!!on;
  b.textContent=on?'⏳ 搜尋中…':'🔎 搜尋點歌';
 }
}

function ktvPromiseTimeout(promise,ms){
 return new Promise(function(resolve,reject){
  var done=false;
  var timer=setTimeout(function(){
   if(done)return;
   done=true;
   reject(new Error('search timeout'));
  },ms||8000);

  promise.then(function(v){
   if(done)return;
   done=true;clearTimeout(timer);resolve(v);
  },function(e){
   if(done)return;
   done=true;clearTimeout(timer);reject(e);
  });
 });
}

function ktvSearchQueries(q,type){
 var list=[];
 function add(x){
  x=String(x||'').trim();
  if(x&&list.indexOf(x)<0)list.push(x);
 }

 if(type==='artist'){
  add(q+' KTV');
  add(q+' karaoke');
  add(q+' 伴奏');
 }else if(type==='song'){
  add(q+' KTV');
  add(q+' karaoke 伴奏');
  add(q+' 純伴奏');
 }else{
  add(q+' KTV');
  add(q+' karaoke');
  add(q+' 伴奏');
 }
 return list;
}

function normalizeKtvNetworkItems(items,q,region){
 return rankKtvResults(items||[],q).map(function(v){
  return {
   title:v.title||q,
   artist:v.channel||'',
   channel:v.channel||'',
   id:v.id||v.videoId||'',
   videoId:v.id||v.videoId||'',
   region:region||'',
   image:v.image||'',
   tag:'網路結果',
   source:'online'
  };
 }).filter(function(x){return !!x.id});
}

function mergeKtvNetworkGroups(groups){
 var all=[],seen={};
 (groups||[]).forEach(function(group){
  (group||[]).forEach(function(x){
   if(!x)return;
   var key=(x.id||x.videoId||'')+'|'+normalizeKtvText(x.title||'');
   if(!key||seen[key])return;
   seen[key]=1;all.push(x);
  });
 });
 return all;
}

function fetchKtvQuery(query,q,region,timeoutMs){
 return ktvPromiseTimeout(fetchSearchWithFallback(query,1),timeoutMs||7500).then(function(res){
  return normalizeKtvNetworkItems((res&&res.items)||[],q,region);
 }).catch(function(){return []});
}

function onlineSingerSongs(singer,onProgress){
 var name=(singer&&singer.name)||'';
 if(!name)return Promise.resolve([]);

 var queries=ktvSearchQueries(name,'artist');
 var groups=[];

 // First query returns as quickly as possible.
 return fetchKtvQuery(queries[0],name,singer.region||'',6000).then(function(first){
  groups.push(first||[]);
  if(onProgress)onProgress('fast',first||[]);

  // Remaining queries run in parallel after the first batch is available.
  var rest=queries.slice(1).map(function(query){
   return fetchKtvQuery(query,name,singer.region||'',7500);
  });

  return Promise.all(rest).then(function(more){
   more.forEach(function(g){groups.push(g||[])});
   var all=mergeKtvNetworkGroups(groups).slice(0,60);
   if(onProgress)onProgress('more',all);
   return all;
  });
 });
}
function showSingerSongs(singer){
 ktvCurrentSinger=singer;
 var local=localSongsByArtist(singer.name).map(function(s){
  var x=Object.assign({},s);x.source='local';return x;
 });

 $('ktvSingerPanel').classList.add('hidden');
 $('ktvSongPanel').classList.remove('hidden');

 setKtvSearchBusy(true);
 resetKtvSearchProgress();
 setKtvSearchProgress('local',12,'正在整理 '+singer.name+' 的本機歌曲…');

 if(local.length){
  renderKtvSongs(local,singer.name+' 的歌曲',local.length+' 首本機歌曲 · 正在搜尋網路');
  $('ktvStatus').textContent='先顯示 '+local.length+' 首本機歌曲，正在搜尋 '+singer.name+' 的更多 KTV…';
 }else{
  renderKtvSongs([],singer.name+' 的歌曲','本機尚未收錄 · 正在搜尋網路');
  $('ktvStatus').textContent=singer.name+' 本機尚未收錄歌曲，正在搜尋網路 KTV…';
 }

 setKtvSearchProgress('fast',28,'正在快速搜尋網路 KTV…');

 onlineSingerSongs(singer,function(stage,onlineNow){
  if(stage==='fast'){
   var fastMerged=mergeKtvSongLists(local,onlineNow);
   renderKtvSongs(fastMerged,singer.name+' 的歌曲',local.length+' 首本機 · '+onlineNow.length+' 筆網路快搜');
   setKtvSearchProgress('more',64,'第一批結果已顯示，正在補充更多歌曲…');
  }
 }).then(function(online){
  var merged=mergeKtvSongLists(local,online);
  ktvSearchResults=merged.slice();
  renderKtvSongs(
   merged,
   singer.name+' 的歌曲',
   local.length+' 首本機 · '+online.length+' 筆網路 · 共 '+merged.length+' 筆'
  );
  setKtvSearchBusy(false);
  finishKtvSearchProgress('搜尋完成：共 '+merged.length+' 筆結果');
  $('ktvStatus').textContent='搜尋完成｜'+singer.name+'：本機 '+local.length+' 首＋網路 '+online.length+' 筆';
 }).catch(function(){
  setKtvSearchBusy(false);
  renderKtvSongs(local,singer.name+' 的歌曲',local.length+' 首本機歌曲');
  finishKtvSearchProgress(local.length?'網路暫時無回應，保留本機結果':'網路搜尋失敗');
  $('ktvStatus').textContent=
   local.length?
   '網路補歌暫時失敗，目前先顯示 '+local.length+' 首本機歌曲。':
   '網路搜尋暫時沒有回應，請稍後再試。';
 });
}

function renderKtvSingers(){
 var root=$('ktvSingerGrid');if(!root)return;
 root.innerHTML='';
 var list=KTV_SINGERS.filter(function(s){
  if(ktvSingerFilter!=='all'){
  if(ktvSingerFilter==='taiwan'&&s.area!=='台灣')return false;
  else if(ktvSingerFilter==='hongkong'&&s.area!=='香港')return false;
  else if(ktvSingerFilter==='mainland'&&s.area!=='中國大陸')return false;
  else if(ktvSingerFilter==='taiwanese'&&s.region!=='台語')return false;
  else if(['taiwan','hongkong','mainland','taiwanese'].indexOf(ktvSingerFilter)<0&&s.type!==ktvSingerFilter)return false;
 }
  if(ktvSingerLetter==='all')return true;
  var firstRaw=String(s.name||'').charAt(0);
  var first=firstRaw.toUpperCase();
  if(ktvSingerLetter==='zh')return !/^[A-Z0-9]$/.test(first);
  if(/^[A-Z]$/.test(ktvSingerLetter))return first===ktvSingerLetter;
  return (KTV_ZHUYIN_INITIAL_MAP[firstRaw]||'')===ktvSingerLetter;
 });
 if(!list.length){root.innerHTML='<div class="ktv-empty">這個分類目前沒有歌手</div>';return}
 list.forEach(function(s){
  var b=document.createElement('button');b.type='button';b.className='ktv-singer';
  var songCount=localSongsByArtist(s.name).length;
  var firstChar=s.name.charAt(0);
  var zhInitial=KTV_ZHUYIN_INITIAL_MAP[firstChar]||'';
  b.innerHTML='<span class="ktv-singer-avatar">'+esc(firstChar)+'</span><b>'+esc(s.name)+'</b><small>'+esc((zhInitial?zhInitial+' · ':'')+(s.area?s.area+' · ':'')+s.region)+(songCount?' · '+songCount+' 首':'')+'</small>';
  b.onclick=function(){
   $('ktvSearchInput').value=s.name;
   ktvSearchType='artist';
   document.querySelectorAll('.ktv-search-type').forEach(function(x){x.classList.toggle('active',x.dataset.ktvtype==='artist')});
   showSingerSongs(s);
  };
  root.appendChild(b);
 });
}


function ktvSourceBadge(song){
 if(!song||!song.source)return '';
 if(song.source==='local')return '<span class="ktv-source-badge local">本機</span>';
 if(song.source==='online')return '<span class="ktv-source-badge online">網路</span>';
 return '';
}

function renderKtvSongs(items,title,sub){
 var displayItems=(items||[]).slice(0,LEGACY_IPAD?120:240);
 items=displayItems;
 var root=$('ktvSongGrid');if(!root)return;
 $('ktvListTitle').textContent=title||'歌曲';
 $('ktvListSub').textContent=sub||'';
 root.innerHTML='';
 if(!items||!items.length){root.innerHTML='<div class="ktv-empty">目前沒有歌曲</div>';return}
 items.forEach(function(song,i){
  var card=document.createElement('div');card.className='ktv-song-card';
  var already=ktvQueueContains(song);
  card.innerHTML='<div class="ktv-song-num">'+String(i+1)+'</div><div class="ktv-song-copy"><b>'+esc(song.title)+'</b><small>'+esc(song.artist||song.channel||'')+(song.singCount?' · 已唱 '+song.singCount+' 次':'')+'</small></div><div class="ktv-song-actions"><button class="ktv-preview" type="button">▶ 試播</button><button class="ktv-order'+(already?' ordered':'')+'" type="button">'+(already?'✓ 已點':'＋ 點歌')+'</button></div>';
  card.querySelector('.ktv-preview').onclick=function(){resolveAndPlayKtv(song,false)};
  card.querySelector('.ktv-order').onclick=function(){
   addKtvQueue(song,false);
   if(ktvQueueContains(song)){this.textContent='✓ 已點';this.classList.add('ordered')}
  };
  root.appendChild(card);
 });
 updateKtvQueueCount();
}

function addKtvQueue(song,priority){
 if(!song)return;
 var q=state.ktv.queue||[],key=ktvSongKey(song);
 for(var i=0;i<q.length;i++){
  if(ktvSongKey(q[i])===key){
   showKtvToast('已在待唱清單第 '+(i+1)+' 首：'+(song.title||'KTV歌曲'),'warn');
   updateKtvQueueCount();
   return;
  }
 }
 var item={title:song.title||'KTV歌曲',artist:song.artist||song.channel||'',id:song.id||'',videoId:song.videoId||song.id||'',region:song.region||'',addedAt:Date.now()};
 if(priority)q.unshift(item);else q.push(item);
 state.ktv.queue=q;save();renderKtvQueue();updateKtvQueueCount();
 $('ktvStatus').textContent='已點歌：'+item.title+(item.artist?' — '+item.artist:'');
 showKtvToast('✓ 已加入待唱：'+item.title+(item.artist?' · '+item.artist:''),'ok');
}


function moveKtvQueueTop(index){
 var q=state.ktv.queue||[];
 if(index<0||index>=q.length)return;
 var item=q.splice(index,1)[0];
 q.unshift(item);
 state.ktv.queue=q;
 save();renderKtvQueue();
}

function renderKtvQueue(){
 var root=$('ktvQueue');if(!root)return;
 var q=state.ktv.queue||[];
 updateKtvQueueCount();
 var legacyQueueCount=$('ktvQueueCount');if(legacyQueueCount)legacyQueueCount.textContent=String(q.length);
 root.innerHTML='';
 if(!q.length){root.innerHTML='<div class="ktv-queue-empty">還沒有點歌</div>';return}
 q.forEach(function(song,i){
  var row=document.createElement('div');row.className='ktv-queue-item';
  row.innerHTML='<span class="ktv-q-num">'+(i+1)+'</span><span class="ktv-q-copy"><b>'+esc(song.title)+'</b><small>'+esc(song.artist||'')+'</small></span><button class="ktv-q-priority" type="button" title="插播">↑</button><button class="ktv-q-delete" type="button" title="取消">×</button>';
  row.querySelector('.ktv-q-priority').onclick=function(){
   var x=q.splice(i,1)[0];q.unshift(x);state.ktv.queue=q;save();renderKtvQueue();
  };
  row.querySelector('.ktv-q-delete').onclick=function(){
   q.splice(i,1);state.ktv.queue=q;save();renderKtvQueue();
  };
  root.appendChild(row);
 });
}

function renderKtvQueueAsSongs(){
 renderKtvSongs((state.ktv.queue||[]).map(function(x){return x}), '已點歌曲','依照目前順序播放');
}

function ktvQueryFor(song){
 var q=((song.artist||'')+' '+(song.title||'')).trim();
 return q+' KTV karaoke 伴奏';
}



var ktvFrameListening=false;
function bindKtvFrameEvents(){
 if(ktvFrameListening)return;
 ktvFrameListening=true;
 window.addEventListener('message',function(ev){
  var f=$('ktvPlayerFrame');
  if(!f||ev.source!==f.contentWindow)return;
  var data=ev.data;
  if(typeof data==='string'){
   try{data=JSON.parse(data)}catch(e){return}
  }
  if(!data)return;
  if(data.event==='onStateChange'&&data.info===0){
   // YouTube IFrame API ENDED
   setTimeout(function(){autoNextKtvSong()},250);
  }
  if(data.event==='onError'){
   setTimeout(function(){
    if(!nextKtvCandidate())autoNextKtvSong();
   },250);
  }
 });
}
function subscribeKtvFrame(){
 var f=$('ktvPlayerFrame');
 if(!f||!f.contentWindow)return;
 try{
  f.contentWindow.postMessage(JSON.stringify({event:'listening',id:'ktvPlayerFrame'}),'*');
  f.contentWindow.postMessage(JSON.stringify({event:'command',func:'addEventListener',args:['onStateChange']}),'*');
 }catch(e){}
}
function autoNextKtvSong(){
 var q=state.ktv.queue||[];
 if(q.length){
  closeKtvPlayer();
  resolveAndPlayKtv(q[0],true);
 }else{
  $('ktvStatus').textContent='已唱完，待唱清單沒有下一首。';
 }
}

function ktvEmbedUrl(id){
 var origin=encodeURIComponent(location.origin);
 return 'https://www.youtube.com/embed/'+encodeURIComponent(id)+'?autoplay=1&playsinline=1&rel=0&fs=0&enablejsapi=1&origin='+origin;
}
function pauseActiveKtvSong(){
 var f=$('ktvPlayerFrame');
 if(!f||!f.contentWindow||!f.src||f.src==='about:blank')return false;
 try{
  f.contentWindow.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}), 'https://www.youtube.com');
  return true;
 }catch(e){console.warn('Unable to pause KTV iframe',e);return false}
}
function showKtvPlayer(song,videoId){
 if(!song||!videoId)return;
 ktvCurrent=song;
 $('ktvPlayerTitle').textContent=song.title||'KTV';
 $('ktvPlayerArtist').textContent=song.artist||song.channel||'';
 window.dispatchEvent(new CustomEvent('ktv-song-changed',{detail:{title:song.title||'',artist:song.artist||song.channel||'',videoId:videoId}}));
 $('ktvNowMini').textContent=(song.title||'')+(song.artist?' · '+song.artist:'');
 $('ktvPlayerPanel').classList.remove('hidden');
 if(typeof window.ktvEnterTheatre==='function')window.ktvEnterTheatre();
 $('ktvPlayerFrame').src=ktvEmbedUrl(videoId);
 bindKtvFrameEvents();
 setTimeout(subscribeKtvFrame,1200);
 setTimeout(subscribeKtvFrame,2600);
 recordKtvSing(song);
 setTimeout(function(){
  try{$('ktvPlayerPanel').scrollIntoView({behavior:'smooth',block:'start'})}catch(e){}
 },80);
}
function closeKtvPlayer(){
 var f=$('ktvPlayerFrame');
 if(f)f.src='about:blank';
 $('ktvPlayerPanel').classList.add('hidden');
 if(typeof window.ktvExitTheatre==='function')window.ktvExitTheatre();
}
function replayKtvCurrent(){
 if(!ktvCurrent)return;
 var id=ktvCurrent.videoId||ktvCurrent.id;
 if(id)showKtvPlayer(ktvCurrent,id);
}


function prepareKtvCandidates(song,items){
 if(!song)return;
 var ranked=rankKtvResults(items||[],song.artist||'');
 song.candidates=ranked.map(function(v){return v.id||v.videoId||''}).filter(Boolean);
 song.candidateIndex=0;
 if(song.candidates.length&&!song.videoId)song.videoId=song.candidates[0];
}
function nextKtvCandidate(){
 if(!ktvCurrent||!ktvCurrent.candidates||!ktvCurrent.candidates.length)return false;
 var i=(ktvCurrent.candidateIndex||0)+1;
 if(i>=ktvCurrent.candidates.length)return false;
 ktvCurrent.candidateIndex=i;
 var id=ktvCurrent.candidates[i];
 if(!id)return false;
 showKtvPlayer(ktvCurrent,id);
 if($('ktvStatus'))$('ktvStatus').textContent='上一個來源無法播放，已自動切換候選來源 '+(i+1)+' / '+ktvCurrent.candidates.length;
 return true;
}

function resolveAndPlayKtv(song,consumeQueue){
 if(!song)return;
 if(song.videoId||song.id){
  var directId=song.videoId||song.id;
  song.videoId=directId;song.id=directId;
  if(consumeQueue&&(state.ktv.queue||[]).length){state.ktv.queue.shift();save();renderKtvQueue()}
  showKtvPlayer(song,directId);
  return;
 }
 ktvBusy=true;
 $('ktvStatus').textContent='正在找「'+(song.artist||'')+' '+song.title+'」的 KTV／伴奏影片…';
 fetchSearchWithFallback(ktvQueryFor(song),1).then(function(res){
  var items=rankKtvResults((res&&res.items)||[],song.artist||'');
  if(!items.length)throw new Error('no ktv result');
  prepareKtvCandidates(song,items);
  var v=items[0];
  song.videoId=v.id||v.videoId||'';
  song.id=song.videoId;
  if(consumeQueue&&state.ktv.queue&&state.ktv.queue.length)state.ktv.queue.shift();
  save();renderKtvQueue();
  showKtvPlayer(song,song.videoId);
 }).catch(function(){
  ktvBusy=false;
  $('ktvStatus').textContent='目前找不到可播放的 KTV／伴奏版本，請換一首或修改關鍵字。';
 });
}

function startKtvQueue(){
 var q=state.ktv.queue||[];
 if(!q.length){$('ktvStatus').textContent='請先點歌。';return}
 resolveAndPlayKtv(q[0],true);
}

function cutKtvSong(){
 var q=state.ktv.queue||[];
 if(q.length){
  closeKtvPlayer();
  resolveAndPlayKtv(q[0],true);
 }else{
  closeKtvPlayer();
  $('ktvStatus').textContent='待唱清單已經沒有下一首。';
 }
}


function findKnownKtvSinger(q){
 var n=normalizeKtvText(q);
 if(!n)return null;
 for(var i=0;i<KTV_SINGERS.length;i++){
  if(normalizeKtvText(KTV_SINGERS[i].name)===n)return KTV_SINGERS[i];
 }
 return null;
}

function searchKtv(forceQuery){
 var q=String(forceQuery||$('ktvSearchInput').value||'').trim();
 if(!q)return;
 if(ktvBusy)return;

 var searchId=++ktvSearchSerial;
 var knownSinger=findKnownKtvSinger(q);
 var treatAsSinger=(ktvSearchType==='artist'||!!knownSinger);
 var effectiveType=treatAsSinger?'artist':ktvSearchType;
 var local=searchLocalKtvSongs(q,effectiveType);

 setKtvSearchBusy(true);
 resetKtvSearchProgress();
 setKtvSearchProgress('local',10,'正在搜尋本機歌庫…');

 $('ktvSingerPanel').classList.add('hidden');
 $('ktvSongPanel').classList.remove('hidden');

 // Local results always appear immediately, but DO NOT stop network search.
 ktvSearchResults=local.slice();
 if(local.length){
  renderKtvSongs(
   local,
   treatAsSinger?(knownSinger?knownSinger.name:q)+' 的歌曲':'搜尋結果',
   local.length+' 首本機歌曲 · 正在搜尋網路'
  );
  $('ktvStatus').textContent='本機先找到 '+local.length+' 首；正在繼續搜尋網路 KTV…';
 }else{
  renderKtvSongs(
   [],
   treatAsSinger?(knownSinger?knownSinger.name:q)+' 的歌曲':'搜尋結果',
   '本機沒有結果 · 正在搜尋網路 KTV'
  );
  $('ktvStatus').textContent='本機沒有結果，正在搜尋網路 KTV／karaoke／伴奏…';
 }

 setKtvSearchProgress('fast',28,'正在快速搜尋網路 KTV…');

 if(treatAsSinger){
  var singerObj=knownSinger||{name:q,region:'華語'};
  ktvSearchType='artist';
  document.querySelectorAll('.ktv-search-type').forEach(function(x){
   x.classList.toggle('active',x.dataset.ktvtype==='artist');
  });

  onlineSingerSongs(singerObj,function(stage,onlineNow){
   if(searchId!==ktvSearchSerial)return;

   if(stage==='fast'){
    var fastMerged=mergeKtvSongLists(local,onlineNow);
    ktvSearchResults=fastMerged.slice();
    renderKtvSongs(
     fastMerged,
     singerObj.name+' 的歌曲',
     local.length+' 首本機 · '+onlineNow.length+' 筆網路快搜'
    );
    setKtvSearchProgress('more',62,'第一批網路結果已顯示，正在補充更多歌曲…');
    $('ktvStatus').textContent=
     '已先顯示 '+fastMerged.length+' 筆；正在繼續搜尋 '+singerObj.name+' 的更多 KTV…';
   }
  }).then(function(online){
   if(searchId!==ktvSearchSerial)return;

   var merged=mergeKtvSongLists(local,online);
   ktvSearchResults=merged.slice();
   renderKtvSongs(
    merged,
    singerObj.name+' 的歌曲',
    local.length+' 首本機 · '+online.length+' 筆網路 · 共 '+merged.length+' 筆'
   );

   setKtvSearchBusy(false);
   finishKtvSearchProgress('搜尋完成：共 '+merged.length+' 筆結果');
   $('ktvStatus').textContent=
    '搜尋完成｜本機 '+local.length+' 首＋網路 '+online.length+' 筆，共 '+merged.length+' 筆';
  }).catch(function(){
   if(searchId!==ktvSearchSerial)return;

   setKtvSearchBusy(false);
   var merged=local.slice();
   ktvSearchResults=merged;
   renderKtvSongs(merged,singerObj.name+' 的歌曲',local.length+' 首本機歌曲');
   finishKtvSearchProgress(local.length?'網路暫時無回應，已保留本機結果':'網路搜尋失敗');
   $('ktvStatus').textContent=
    local.length?
    '網路搜尋暫時沒有回應，目前保留 '+local.length+' 首本機歌曲。':
    '目前搜尋來源沒有回應，請稍後再試。';
  });
  return;
 }

 // General/song searches: fast first query, then parallel supplements.
 var queries=ktvSearchQueries(q,effectiveType);
 var groups=[];

 fetchKtvQuery(queries[0],q,'',6000).then(function(first){
  if(searchId!==ktvSearchSerial)return [];

  groups.push(first||[]);
  var firstMerged=mergeKtvSongLists(local,mergeKtvNetworkGroups(groups));
  ktvSearchResults=firstMerged.slice();

  if(firstMerged.length){
   renderKtvSongs(
    firstMerged,
    '搜尋結果',
    local.length+' 首本機 · '+(first||[]).length+' 筆網路快搜'
   );
  }

  setKtvSearchProgress('more',62,'第一批結果已顯示，正在補充更多網路歌曲…');
  $('ktvStatus').textContent=
   '第一批已找到 '+firstMerged.length+' 筆，正在繼續搜尋更多 KTV／伴奏版本…';

  var rest=queries.slice(1).map(function(query){
   return fetchKtvQuery(query,q,'',7500);
  });
  return Promise.all(rest);

 }).then(function(restGroups){
  if(searchId!==ktvSearchSerial)return;

  (restGroups||[]).forEach(function(g){groups.push(g||[])});
  var online=mergeKtvNetworkGroups(groups);
  var merged=mergeKtvSongLists(local,online);

  ktvSearchResults=merged.slice();
  renderKtvSongs(
   merged,
   '搜尋結果',
   local.length+' 首本機 · '+online.length+' 筆網路 · 共 '+merged.length+' 筆'
  );

  setKtvSearchBusy(false);
  finishKtvSearchProgress('搜尋完成：共 '+merged.length+' 筆結果');
  $('ktvStatus').textContent=
   '搜尋完成｜本機 '+local.length+' 首＋網路 '+online.length+' 筆，共 '+merged.length+' 筆';

 }).catch(function(){
  if(searchId!==ktvSearchSerial)return;

  var online=mergeKtvNetworkGroups(groups);
  var merged=mergeKtvSongLists(local,online);
  ktvSearchResults=merged.slice();

  setKtvSearchBusy(false);

  if(merged.length){
   renderKtvSongs(merged,'搜尋結果','目前已取得 '+merged.length+' 筆結果');
   finishKtvSearchProgress('部分網路來源逾時，已顯示目前結果');
   $('ktvStatus').textContent='部分網路搜尋逾時，目前先顯示 '+merged.length+' 筆可用結果。';
  }else{
   renderKtvSongs([],'搜尋結果','');
   finishKtvSearchProgress('網路搜尋失敗');
   $('ktvStatus').textContent='目前搜尋來源沒有回應，請稍後再試。';
  }
 });
}




var tvModeActive=false,tvNav='countries',tvCountry='tw',tvCurrentUrl='',tvEmbedTimer=null,tvPaused=false,tvSidebarCollapsed=false;

var TV_COUNTRIES=[
 {code:'tw',name:'台灣',flag:'🇹🇼'},{code:'jp',name:'日本',flag:'🇯🇵'},{code:'kr',name:'韓國',flag:'🇰🇷'},
 {code:'us',name:'美國',flag:'🇺🇸'},{code:'gb',name:'英國',flag:'🇬🇧'},{code:'fr',name:'法國',flag:'🇫🇷'},
 {code:'de',name:'德國',flag:'🇩🇪'},{code:'it',name:'義大利',flag:'🇮🇹'},{code:'es',name:'西班牙',flag:'🇪🇸'},
 {code:'ca',name:'加拿大',flag:'🇨🇦'},{code:'au',name:'澳洲',flag:'🇦🇺'},{code:'nz',name:'紐西蘭',flag:'🇳🇿'},
 {code:'sg',name:'新加坡',flag:'🇸🇬'},{code:'my',name:'馬來西亞',flag:'🇲🇾'},{code:'th',name:'泰國',flag:'🇹🇭'},
 {code:'ph',name:'菲律賓',flag:'🇵🇭'},{code:'id',name:'印尼',flag:'🇮🇩'},{code:'in',name:'印度',flag:'🇮🇳'},
 {code:'hk',name:'香港',flag:'🇭🇰'},{code:'mo',name:'澳門',flag:'🇲🇴'}
];

function stopTvPlayback(){
 if(tvEmbedTimer){clearTimeout(tvEmbedTimer);tvEmbedTimer=null}
 var f=$('tvWebFrame');
 if(f){try{f.src='about:blank'}catch(e){}}
}

function leaveTvMode(){
 try{exitTvFullscreen()}catch(e){}
 tvPortraitMiniDismissed=false;setTvPortraitMini(false);
 tvPaused=false;updateTvPauseBtn();
 tvModeActive=false;
 document.body.classList.remove('tv-mode-active');document.body.classList.remove('tv-fullscreen');
 if($('tvMode'))$('tvMode').classList.add('hidden');
 if($('tvModeBtn'))$('tvModeBtn').classList.remove('active');
 if($('tvFullscreenBtn'))$('tvFullscreenBtn').textContent='⛶ 全螢幕';
 stopTvPlayback();

 document.body.classList.remove('tv-landscape');
 document.body.classList.remove('tv-portrait');
}


function showTvMode(){
 tvPortraitMiniDismissed=false;setTvPortraitMini(false);
 try{if(immersiveFull)exitImmersiveFullscreen()}catch(e){}
 try{leaveKtvMode()}catch(e){}
 try{stopPlaybackForHome()}catch(e){}
 try{stopMusic()}catch(e){}
 tvModeActive=true;
 musicModeActive=false;
 document.body.classList.remove('watch-mode');document.body.classList.remove('music-mode-active');document.body.classList.remove('ktv-mode-active');
 document.body.classList.add('tv-mode-active');
 if($('hero'))$('hero').classList.add('hidden');
 if($('kidsHome'))$('kidsHome').classList.add('hidden');
 if($('playerSection'))$('playerSection').classList.add('hidden');
 if($('musicMode'))$('musicMode').classList.add('hidden');
 if($('ktvMode'))$('ktvMode').classList.add('hidden');
 if($('parentPanel'))$('parentPanel').classList.add('hidden');
 if($('tvMode'))$('tvMode').classList.remove('hidden');
 if($('videoModeBtn'))$('videoModeBtn').classList.remove('active');
 if($('musicModeBtn'))$('musicModeBtn').classList.remove('active');
 if($('ktvModeBtn'))$('ktvModeBtn').classList.remove('active');
 if($('tvModeBtn'))$('tvModeBtn').classList.add('active');
 renderTvCountries('');
 renderTvMobileQuickRail();
 updateTvMobileHint();
 renderTvNav(tvNav);
 if(!tvCurrentUrl)loadTvCountry(state.tv.lastCountry||'tw');
 if(window.innerWidth<=820)setTvSidebarCollapsed(true);else if(window.innerWidth<=1100)setTvSidebarCollapsed(true);else setTvSidebarCollapsed(false);
 try{window.scrollTo(0,0)}catch(e){}

 setTimeout(scheduleTvOrientationLayout,30);

 if(window.innerWidth<=900)setTvSidebarCollapsed(true);

 if(window.innerWidth<=900&&tvCountry!=='tw'){
  tvCountry='tw';
  loadTvCountry('tw');
 }else if(window.innerWidth<=900){
  loadTvCountry('tw');
 }
 setTvSidebarCollapsed(true);
 updateTvMobileHint();
}





function updateTvMobileHint(){
 var hint=$('tvMobileHint');
 if(!hint)return;
 if(window.innerWidth<=900){
  hint.textContent='已預設台灣頻道；請直接使用電視頁面內的頻道清單切台。';
 }else{
  hint.textContent='選擇地區後，請直接在下方電視頁面內點選頻道。';
 }
}
function countryName(code){
 for(var i=0;i<TV_COUNTRIES.length;i++){
  if(TV_COUNTRIES[i].code===code)return TV_COUNTRIES[i];
 }
 return {code:code,name:String(code||'').toUpperCase(),flag:'🌐'};
}


var tvPortraitMini=false,tvPortraitMiniDismissed=false,tvMiniTicking=false;



function setTvPortraitMini(on){
 if(window.innerWidth<=820&&window.innerWidth<=window.innerHeight)on=false;
 if(window.innerWidth>820||window.innerWidth>window.innerHeight)on=false;
 tvPortraitMini=!!on;
 document.body.classList.toggle('tv-portrait-mini',tvPortraitMini);
 if($('tvMiniCloseBtn'))$('tvMiniCloseBtn').classList.toggle('hidden',!tvPortraitMini);
}

function evaluateTvPortraitMini(){
 tvMiniTicking=false;
 if(!tvModeActive||window.innerWidth<=820&&window.innerWidth<=window.innerHeight||window.innerWidth>820||window.innerWidth>window.innerHeight||tvPortraitMiniDismissed){
  setTvPortraitMini(false);return;
 }
 var wrap=$('tvEmbedWrap');if(!wrap)return;
 var r=wrap.getBoundingClientRect();
 var vh=window.innerHeight||document.documentElement.clientHeight||0;
 var total=Math.max(1,r.height);
 var visible=Math.max(0,Math.min(vh,r.bottom)-Math.max(0,r.top));
 var visibleRatio=Math.max(0,Math.min(1,visible/total));
 var hiddenRatio=1-visibleRatio;
 if(!tvPortraitMini&&hiddenRatio>=0.72)setTvPortraitMini(true);
 else if(tvPortraitMini&&visibleRatio>=0.50)setTvPortraitMini(false);
}

function requestTvPortraitMiniEval(){
 if(tvMiniTicking)return;
 tvMiniTicking=true;
 if(window.requestAnimationFrame)window.requestAnimationFrame(evaluateTvPortraitMini);
 else setTimeout(evaluateTvPortraitMini,16);
}



var tvOrientationRefreshTimer=null;

function resetTvTransientLayout(){
 try{setTvDrawer(false)}catch(e){}
 try{setTvPortraitMini(false)}catch(e){}
 tvPortraitMiniDismissed=false;

 document.body.classList.remove('tv-drawer-open');
 document.body.classList.remove('tv-portrait-mini');

 var sidebar=$('tvEmbedSidebar');
 if(sidebar){
  sidebar.style.removeProperty('transform');
  sidebar.style.removeProperty('display');
  sidebar.style.removeProperty('width');
  sidebar.style.removeProperty('height');
 }
 var main=$('tvEmbedMain');
 if(main){
  main.style.removeProperty('display');
  main.style.removeProperty('grid-template-columns');
  main.style.removeProperty('grid-template-areas');
  main.style.removeProperty('width');
  main.style.removeProperty('height');
 }
 var wrap=$('tvEmbedWrap');
 if(wrap){
  wrap.style.removeProperty('width');
  wrap.style.removeProperty('height');
  wrap.style.removeProperty('min-height');
  wrap.style.removeProperty('position');
  wrap.style.removeProperty('inset');
 }
 var rail=$('tvMobileQuickRail');
 if(rail){
  rail.style.removeProperty('display');
  rail.style.removeProperty('width');
  rail.style.removeProperty('height');
  rail.style.removeProperty('max-height');
 }
}

function applyTvOrientationLayout(){
 if(!tvModeActive)return;

 resetTvTransientLayout();
 renderTvMobileQuickRail();

 var landscape=window.innerWidth>window.innerHeight;
 document.body.classList.toggle('tv-landscape',landscape);
 document.body.classList.toggle('tv-portrait',!landscape);

 // Force reflow so Safari drops old portrait geometry before landscape CSS applies.
 try{
  var main=$('tvEmbedMain');
  if(main)void main.offsetHeight;
 }catch(e){}

 // Keep the TV area visible after rotation without jumping to an old drawer position.
 setTimeout(function(){
  try{
   var wrap=$('tvEmbedWrap');
   if(wrap&&wrap.scrollIntoView){
    wrap.scrollIntoView({block:'nearest'});
   }
  }catch(e){}
 },60);
}

function scheduleTvOrientationLayout(){
 clearTimeout(tvOrientationRefreshTimer);
 applyTvOrientationLayout();

 // iOS Safari reports intermediate dimensions during rotation.
 tvOrientationRefreshTimer=setTimeout(function(){
  applyTvOrientationLayout();
 },260);

 setTimeout(function(){
  applyTvOrientationLayout();
 },650);
}

function renderTvMobileQuickRail(){
 var root=$('tvMobileQuickRail');
 if(!root)return;
 root.innerHTML='';
 root.setAttribute('aria-hidden','true');
}


function renderTvCountries(filter){
 var root=$('tvCountryList');if(!root)return;
 var q=String(filter||'').toLowerCase();
 root.innerHTML='';
 var source=TV_COUNTRIES.slice();
 if(tvNav==='favorites'){
  source=(state.tv.favorites||[]).map(function(x){return countryName(x.code)});
 }else if(tvNav==='recent'){
  source=(state.tv.recent||[]).map(function(x){return countryName(x.code)});
 }
 var seen={};
 source.filter(function(c){
  if(!c||seen[c.code])return false;
  seen[c.code]=1;
  return !q||c.name.toLowerCase().indexOf(q)>=0||c.code.indexOf(q)>=0;
 }).forEach(function(c){
  var b=document.createElement('button');
  b.type='button';
  b.className='tv-country'+(c.code===tvCountry?' active':'');
  b.innerHTML='<span>'+c.flag+'</span><b>'+esc(c.name)+'</b>';
  b.onclick=function(){
   loadTvCountry(c.code);
   if(window.innerWidth<=820)setTvSidebarCollapsed(true);
  };
  root.appendChild(b);
 });
}

function tvUrlForCountry(code){
 return 'https://famelack.com/tv/'+encodeURIComponent(code||'tw');
}

function rememberTvRecent(code,url){
 var c=countryName(code);
 var arr=(state.tv.recent||[]).filter(function(x){return x&&x.code!==code});
 arr.unshift({code:code,name:c.name,url:url,updated:Date.now()});
 state.tv.recent=arr.slice(0,20);
 save();
}

function tvFavoriteIndex(code){
 var arr=state.tv.favorites||[];
 for(var i=0;i<arr.length;i++){
  if(arr[i]&&arr[i].code===code)return i;
 }
 return -1;
}

function updateTvFavBtn(){
 if(!$('tvFavBtn'))return;
 var yes=tvFavoriteIndex(tvCountry)>=0;
 setTvActionContent('tvFavBtn',yes?'★':'☆',yes?'已收藏':'收藏',yes?'取消收藏目前地區':'收藏目前地區');
 $('tvFavBtn').classList.toggle('active',yes);
 $('tvFavBtn').setAttribute('aria-pressed',yes?'true':'false');
}

function toggleTvFavorite(){
 var idx=tvFavoriteIndex(tvCountry),c=countryName(tvCountry);
 if(idx>=0)state.tv.favorites.splice(idx,1);
 else state.tv.favorites.unshift({code:tvCountry,name:c.name,url:tvCurrentUrl,updated:Date.now()});
 save();
 updateTvFavBtn();
 if(tvNav==='favorites')renderTvCountries($('tvCountrySearch')?$('tvCountrySearch').value:'');
}

function loadTvCountry(code){
 tvPaused=false;updateTvPauseBtn();
 tvCountry=code||'tw';
 state.tv.lastCountry=tvCountry;
 tvCurrentUrl=tvUrlForCountry(tvCountry);
 save();
 var c=countryName(tvCountry);
 if($('tvPageTitle'))$('tvPageTitle').textContent=c.flag+' '+c.name+' 電視';
 if($('tvPageSub'))$('tvPageSub').textContent='Famelack 全球電視頻道頁面';
 if($('tvStatus'))$('tvStatus').textContent='正在載入 '+c.name+' 電視頁面…';
 if($('tvEmbedBlocked'))$('tvEmbedBlocked').classList.add('hidden');
 renderTvCountries($('tvCountrySearch')?$('tvCountrySearch').value:'');
 updateTvFavBtn();
 rememberTvRecent(tvCountry,tvCurrentUrl);
 var f=$('tvWebFrame');
 if(!f)return;
 f.onload=function(){
  if($('tvStatus'))$('tvStatus').textContent=c.name+' 電視頁面已載入';
  updateTvMobileHint();
  if(tvEmbedTimer){clearTimeout(tvEmbedTimer);tvEmbedTimer=null}
 };
 f.src=tvCurrentUrl;
 if(window.innerWidth<=820){
  setTimeout(function(){
   try{
    var w=$('tvEmbedWrap');
    if(w&&w.scrollIntoView)w.scrollIntoView({behavior:'smooth',block:'start'});
   }catch(e){}
  },180);
 }
 if(tvEmbedTimer)clearTimeout(tvEmbedTimer);
 tvEmbedTimer=setTimeout(function(){
  if($('tvStatus'))$('tvStatus').textContent='如果畫面仍空白，可能是來源網站禁止 iframe 嵌入。';
  if($('tvEmbedBlocked'))$('tvEmbedBlocked').classList.remove('hidden');
 },7000);
}



var tvControlHintTimer=null;

function showTvControlHint(message){
 var el=$('tvControlHint');
 if(!el)return;
 var text=el.querySelector('span');
 if(text&&message)text.textContent=message;
 el.classList.remove('hidden');
 if(tvControlHintTimer)clearTimeout(tvControlHintTimer);
 tvControlHintTimer=setTimeout(function(){
  if(el)el.classList.add('hidden');
 },3200);
}

function setTvActionContent(id,icon,label,title){
 var b=$(id);if(!b)return;
 var i=b.querySelector('.tv-action-icon');
 var l=b.querySelector('.tv-action-label');
 if(i)i.textContent=icon;
 if(l)l.textContent=label;
 if(title)b.setAttribute('title',title);
}

function exitTvFullscreen(){
 document.body.classList.remove('tv-fullscreen');
 if($('tvFullscreenBtn')){
  setTvActionContent('tvFullscreenBtn','⛶','全螢幕','進入全螢幕');
  $('tvFullscreenBtn').setAttribute('aria-pressed','false');
 }
 try{if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen()}catch(e){}
 try{if(document.webkitFullscreenElement&&document.webkitExitFullscreen)document.webkitExitFullscreen()}catch(e){}
 if(window.innerWidth<=900)setTvSidebarCollapsed(true);
 setTimeout(function(){if(tvModeActive)scheduleTvOrientationLayout()},80);
}

function updateTvPauseBtn(){
 if(!$('tvPauseBtn'))return;
 setTvActionContent('tvPauseBtn','⏯','播放控制','播放／暫停請使用內嵌電視畫面的控制鍵');
 $('tvPauseBtn').classList.remove('active');
 $('tvPauseBtn').setAttribute('aria-pressed','false');
}
function toggleTvPause(){
 var f=$('tvWebFrame');
 if(!f||!tvCurrentUrl)return;

 // Famelack lives in a cross-origin iframe. The parent page is not allowed
 // to directly call the iframe's <video>.pause()/play() under browser SOP.
 // Never blank/reload the iframe here; that would stop the channel and lose state.
 try{
  if(f.contentWindow){
   f.contentWindow.postMessage({type:'WATCH_VIDEOtu_MEDIA_CONTROL',action:'toggle'},'*');
   f.contentWindow.postMessage({type:'media-control',action:'toggle'},'*');
  }
 }catch(e){}

 showTvControlHint('請點電視畫面內的 ▶ / ⏸ 控制。這樣會保留目前頻道，不會再停止並跳出。');
 try{f.focus()}catch(e){}
}

function reloadTvEmbed(){
 tvPaused=false;updateTvPauseBtn();
 if(!tvCurrentUrl)return;
 var f=$('tvWebFrame');if(!f)return;
 f.src='about:blank';
 setTimeout(function(){if($('tvWebFrame'))$('tvWebFrame').src=tvCurrentUrl},120);
}

function toggleTvFullscreen(){
 if(document.body.classList.contains('tv-fullscreen')){
  exitTvFullscreen();
  return;
 }
 document.body.classList.add('tv-fullscreen');
 setTvActionContent('tvFullscreenBtn','✕','退出','退出全螢幕');
 if($('tvFullscreenBtn'))$('tvFullscreenBtn').setAttribute('aria-pressed','true');
 if(window.innerWidth<=900)setTvSidebarCollapsed(true);
 try{window.scrollTo(0,0)}catch(e){}
 setTimeout(function(){try{var f=$('tvWebFrame');if(f)f.focus()}catch(e){}},80);
}


function setTvSidebarCollapsed(on){
 tvSidebarCollapsed=!!on;
 document.body.classList.toggle('tv-sidebar-collapsed',tvSidebarCollapsed);
 document.body.classList.toggle('tv-region-drawer-open',!tvSidebarCollapsed&&window.innerWidth<=900);

 if($('tvSidebarToggleBtn')){
  $('tvSidebarToggleBtn').textContent=tvSidebarCollapsed?'☰':'✕';
  $('tvSidebarToggleBtn').setAttribute('aria-label',tvSidebarCollapsed?'展開國家欄':'收合國家欄');
 }
 var side=$('tvEmbedSidebar');
 if(side)side.classList.toggle('drawer-open',!tvSidebarCollapsed&&window.innerWidth<=900);
 var back=$('tvDrawerBackdrop');
 if(back)back.classList.toggle('hidden',tvSidebarCollapsed||window.innerWidth>900);
}
function toggleTvSidebar(){setTvSidebarCollapsed(!tvSidebarCollapsed);}

function renderTvNav(nav){
 tvNav=nav||'countries';
 document.querySelectorAll('.tv-nav').forEach(function(b){
  b.classList.toggle('active',b.dataset.tvnav===tvNav);
 });
 renderTvCountries($('tvCountrySearch')?$('tvCountrySearch').value:'');
}

var CHILD_RECOMMENDATION_QUERIES={"英文":["Super Simple Songs ABC kids English","Lingokids phonics alphabet kids","English Singsing preschool English","kids English vocabulary songs preschool","phonics songs for kids"],"兒歌":["朱妮托尼 中文 兒歌","JunyTony nursery rhymes 中文","小啼大作 兒歌","Bebefinn nursery rhymes 中文","幼兒兒歌 童謠 動畫"],"卡通":["巧虎TV 台灣 幼兒","朱妮托尼 卡通 中文","妙妙犬布麗 Bluey 中文","JunyTony cartoon kids","幼兒卡通 中文 生活教育"],"故事":["妙妙犬布麗 Bluey YOYOTV 中文","Bluey stories kids family","兒童睡前故事 中文 動畫","幼兒繪本故事 動畫","兒童寓言故事 動畫"],"學習":["小行星樂樂 幼兒 學習","Bebefinn learning kids","幼兒認知 學習 動畫","preschool educational videos kids","幼兒生活習慣 學習"],"自然／動物":["Nat Geo Kids amazing animals","kids animals nature educational","兒童 動物 大自然 科普","wildlife for kids nature documentary","海洋動物 兒童 科普"],"數字／顏色":["numbers colors for kids","Super Simple Songs colors numbers","幼兒 數字 顏色 學習","counting songs kids colors","shapes colors numbers preschool"]};
var AUTO_CATEGORY_RULES=[
 {name:'英文',words:['abc','alphabet','phonics','english','英文','單字','vocabulary','letter','letters','spelling','learn english','英語']},
 {name:'兒歌',words:['兒歌','童謠','nursery rhyme','nursery rhymes','kids song','kids songs','baby song','baby songs','sing along','song for kids','cocomelon']},
 {name:'卡通',words:['卡通','動畫','cartoon','animation','animated','peppa','pororo','paw patrol','佩佩豬','巧虎','超級飛俠']},
 {name:'故事',words:['故事','童話','story','stories','bedtime story','fairy tale','繪本','睡前故事']},
 {name:'數字／顏色',words:['顏色','color','colors','colour','colours','number','numbers','數字','counting','count']},
 {name:'學習',words:['學習','教學','learning','learn','education','educational','數學','math','science','科學','認知','shape','shapes']},
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
 var target=$('playerStage')||$('playerSection');
 if(!target)return;
 var lastMini=false;
 var ticking=false;

 function evaluateMini(){
  ticking=false;
  if(!currentVideo||immersiveFull||document.body.classList.contains('watch-scroll-lock')||Date.now()<miniPlayerSuppressUntil){
   if(lastMini){closeMiniPlayer();lastMini=false}
   return;
  }
  var r=target.getBoundingClientRect();
  var vh=window.innerHeight||document.documentElement.clientHeight||0;
  var total=Math.max(1,r.height);
  var visibleTop=Math.max(0,r.top);
  var visibleBottom=Math.min(vh,r.bottom);
  var visible=Math.max(0,visibleBottom-visibleTop);
  var visibleRatio=Math.max(0,Math.min(1,visible/total));
  var hiddenRatio=1-visibleRatio;

  // Enter mini only after at least 70% of the main player has left the viewport.
  // Exit after 45% becomes visible again to prevent rapid flicker near the threshold.
  if(!lastMini&&hiddenRatio>=0.70){
   openMiniPlayer();
   lastMini=true;
  }else if(lastMini&&visibleRatio>=0.45){
   closeMiniPlayer();
   lastMini=false;
  }
 }

 function requestEval(){
  if(ticking)return;
  ticking=true;
  if(window.requestAnimationFrame)window.requestAnimationFrame(evaluateMini);
  else setTimeout(evaluateMini,16);
 }
 window.addEventListener('scroll',requestEval,{passive:true});
 window.addEventListener('resize',requestEval);
 requestEval();
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
 var root=$('sidebarVideoList');if(!root)return;
 document.querySelectorAll('.side-filter').forEach(function(b){b.classList.toggle('active',b.dataset.sidefilter===sidebarFilter)});
 var list=sidebarItems(sidebarFilter);root.innerHTML='';
 if(!list.length){root.innerHTML='<div class="sidebar-empty">這個分類目前沒有影片</div>';return}
 var frag=document.createDocumentFragment();
 list.forEach(function(v){
  var row=document.createElement('div');
  row.className='sidebar-video-row'+(v.id===currentId?' playing':'');
  row.innerHTML='<button type="button" class="sidebar-video-main"><img src="'+thumb(v.id)+'" alt=""><span class="sidebar-video-copy"><b>'+esc(v.title)+'</b><small>'+esc(v.channel||v.category||'影片')+'</small></span></button><button type="button" class="sidebar-edit-btn" title="編輯">⋮</button><div class="sidebar-edit-menu hidden"><button type="button" class="sidebar-unfav">☆ 取消收藏</button><button type="button" class="sidebar-delete">🗑 刪除影片</button></div>';
  row.querySelector('.sidebar-video-main').onclick=function(){playInsideWatchVideo(v,list)};
  row.querySelector('.sidebar-edit-btn').onclick=function(ev){ev.stopPropagation();row.querySelector('.sidebar-edit-menu').classList.toggle('hidden')};
  row.querySelector('.sidebar-unfav').onclick=function(ev){ev.stopPropagation();removeFavoriteId(v.id);save();renderSidebar(sidebarFilter);renderRows();updateFavBtn()};
  row.querySelector('.sidebar-delete').onclick=function(ev){
   ev.stopPropagation();
   if(!confirm('確定要從影片庫刪除「'+v.title+'」？'))return;
   state.videos=state.videos.filter(function(x){return x.id!==v.id});
   ['daughter','son'].forEach(function(k){
    if(state.profiles[k]){
     state.profiles[k].favorites=(state.profiles[k].favorites||[]).filter(function(x){return x!==v.id});
     state.profiles[k].recent=(state.profiles[k].recent||[]).filter(function(x){return x!==v.id});
     if(state.profiles[k].progress)delete state.profiles[k].progress[v.id];
    }
   });
   save();renderSidebar(sidebarFilter);renderRows();
   if(currentId===v.id)showHome();
  };
  frag.appendChild(row);
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

function currentProfileRecentIds(){
 try{
  var p=activeProfile();
  return (p&&p.recent)?p.recent.slice():[];
 }catch(e){return []}
}
function previousWatchedVideo(){
 var ids=currentProfileRecentIds();
 var currentId=currentVideo&&currentVideo.id;
 if(!ids.length)return null;
 var currentIndex=-1;
 for(var i=0;i<ids.length;i++){
  if(String(ids[i])===String(currentId)){currentIndex=i;break}
 }
 if(currentIndex>=0){
  for(var j=currentIndex+1;j<ids.length;j++){
   for(var k=0;k<state.videos.length;k++){
    if(String(state.videos[k].id)===String(ids[j]))return state.videos[k];
   }
  }
 }
 for(var a=0;a<ids.length;a++){
  if(String(ids[a])===String(currentId))continue;
  for(var b=0;b<state.videos.length;b++){
   if(String(state.videos[b].id)===String(ids[a]))return state.videos[b];
  }
 }
 return null;
}
function nextRelatedVideo(){
 if(relatedItems&&relatedItems.length){
  for(var i=0;i<relatedItems.length;i++){
   if(!currentVideo||String(relatedItems[i].id)!==String(currentVideo.id))return relatedItems[i];
  }
 }
 return null;
}
function playPreviousWatched(){
 var v=previousWatchedVideo();
 if(v){playVideo(v);return}
}
function playNextRelated(){
 var v=nextRelatedVideo();
 if(v){playVideo(v);return}
 nextVideo();
}

function nextVideo(){if(!currentList.length)return;if(currentIndex<0)currentIndex=0;else currentIndex=(currentIndex+1)%currentList.length;selectVideo(currentList[currentIndex].id,currentList)}
function prevVideo(){if(!currentList.length)return;if(currentIndex<0)currentIndex=0;else currentIndex=(currentIndex-1+currentList.length)%currentList.length;selectVideo(currentList[currentIndex].id,currentList)}

var VIDEO_CATEGORIES=['英文','兒歌','卡通','故事','學習','自然／動物','其他'];

function isFavorite(id){
 return !!id && profile().favorites.indexOf(id)>=0;
}
function ensureFavoriteId(id){
 if(!id)return;
 var p=profile();
 if(p.favorites.indexOf(id)<0)p.favorites.unshift(id);
}
function removeFavoriteId(id){
 if(!id)return;
 var p=profile();
 p.favorites=p.favorites.filter(function(x){return x!==id});
}
function saveVideoAsFavorite(video,category){
 if(!video||!video.id)return null;
 var existing=videoById(video.id);
 if(!existing){
  existing={id:video.id,title:video.title||'YouTube 影片',channel:video.channel||'',category:category||video.category||'其他',recommended:false,addedAt:Date.now()};
  state.videos.push(existing);
 }else{
  if(video.title&&(!existing.title||existing.title==='YouTube 影片'))existing.title=video.title;
  if(video.channel&&!existing.channel)existing.channel=video.channel;
  if(category)existing.category=category;
 }
 if(category){
  existing.category=category;existing.categoryManual=true;existing.autoCategory=false;
 }else if(!existing.category||existing.category==='其他'||existing.category==='YouTube 搜尋'){
  applyAutoCategory(existing,video.searchQuery||'');
 }
 ensureFavoriteId(existing.id);
 save();
 syncFavoriteUI(existing.id);
 return existing;
}
function toggleFavoriteForVideo(video,category){
 if(!video||!video.id)return false;
 if(isFavorite(video.id)){
  removeFavoriteId(video.id);save();syncFavoriteUI(video.id);return false;
 }
 saveVideoAsFavorite(video,category||null);
 return true;
}
function syncFavoriteUI(id){
 updateFavBtn();
 renderRows();
 renderSidebar(sidebarFilter);
 document.querySelectorAll('[data-video-id="'+id+'"]').forEach(function(card){
  var btn=card.querySelector('.add');
  if(btn){
   var fav=isFavorite(id);
   btn.textContent=fav?'★ 已收藏':'＋ 收藏';
   btn.classList.toggle('active',fav);
   btn.disabled=false;
  }
  var saved=videoById(id),slot=card.querySelector('.search-category-slot');
  if(slot&&isFavorite(id)&&saved){
   slot.innerHTML='<div class="category-saved">分類：'+esc(saved.category||'其他')+'</div>';
  }else if(slot&&!isFavorite(id)){slot.innerHTML=''}
 });
}

function categoryPickerHtml(selected){
 return '<div class="search-category-picker"><span>分類</span><select class="category-select">'+
  VIDEO_CATEGORIES.map(function(c){return '<option'+(c===selected?' selected':'')+'>'+esc(c)+'</option>'}).join('')+
  '</select><button class="category-save" type="button">確定</button></div>';
}

function toggleFav(){
 if(!currentId)return;
 var saved=videoById(currentId),ctx=currentVideoContext(currentId);
 var base=saved||ctx||{id:currentId,title:'YouTube 影片',channel:'',category:'其他'};
 toggleFavoriteForVideo(base,saved&&saved.category?saved.category:null);
 syncFavoriteUI(currentId);
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

function updateFavBtn(){var yes=currentId&&isFavorite(currentId);$('favBtn').textContent=yes?'★ 已收藏':'☆ 收藏';$('favBtn').classList.toggle('active',!!yes)}
function resumeVideo(id,list){var pr=profile().progress[id];selectVideo(id,list);if(pr&&pr.current>5&&player)setTimeout(function(){try{player.seekTo(pr.current,true)}catch(e){}},800)}
function makeCard(v,opts){
 opts=opts||{};var card=document.createElement('div');card.className='video-card';
 var p=profile().progress[v.id],pct=0;if(p&&p.duration>0)pct=Math.min(100,Math.round(p.current/p.duration*100));
 card.innerHTML='<div class="thumb-wrap"><img src="'+thumb(v.id)+'"><span class="badge">'+esc(opts.badge||v.category||'影片')+'</span></div>'+
 '<div class="body"><h3>'+esc(v.title)+'</h3><div class="card-meta">'+esc(v.channel||'')+(pct?' · 已觀看 '+pct+'%':'')+'</div>'+(v.autoCategory?'<span class="card-auto-cat">自動 · '+esc(v.category||'其他')+'</span>':'')+'</div>';
 card.onclick=function(){opts.resume?resumeVideo(v.id,opts.list):selectVideo(v.id,opts.list)};return card;
}
function addRow(title,list,sub,opts){
 var root=$('dynamicRows');
 if(root&&title){
  var existing=root.querySelector('[data-row-title="'+String(title).replace(/"/g,'&quot;')+'"]');
  if(existing)return;
 }

 if(!list||!list.length)return;var sec=document.createElement('section');
 sec.setAttribute('data-row-title',title||'');sec.className='media-row';
 sec.innerHTML='<div class="row-head"><h2>'+esc(title)+'</h2><span>'+esc(sub||'')+'</span></div>';
 var car=document.createElement('div');car.className='carousel';list.forEach(function(v){car.appendChild(makeCard(v,Object.assign({list:list},opts||{})))});sec.appendChild(car);$('dynamicRows').appendChild(sec);
}
function renderRows(filter){
 var root=$('dynamicRows');
 var renderToken=beginHomeRender();
 root.innerHTML='';
 var p=profile(),all=availableVideos(),shownIds={};

 function addUniqueRow(key,title,list,sub,opts,limit){
  if(!homeRenderIsCurrent(renderToken))return;
  if(!claimHomeRowKey(key,renderToken))return;

  var arr=uniqueVideoList((list||[]).filter(Boolean)).slice(0,limit||SEARCH_RENDER_LIMIT);
  if(!arr.length){
   delete HOME_RENDER_ROW_KEYS[key];
   return;
  }

  arr.forEach(function(v){if(v&&v.id)shownIds[v.id]=1});
  addRow(title,arr,sub,opts);
 }

 if(filter==='recommended'){
  addUniqueRow(
   'recommended',
   '兒童推薦',
   all.filter(function(v){return v.recommended}),
   '精選適合兒童觀看的影片',
   {badge:'🧒 推薦'},
   24
  );
  return;
 }

 if(!filter||filter==='all'){
  var cont=p.recent.map(videoById).filter(function(v){
   if(!v||!allowedVideo(v))return false;
   var pr=p.progress[v.id];
   return pr&&pr.current>5&&pr.duration&&pr.current<pr.duration-10;
  });

  addUniqueRow('continue','繼續觀看',cont,'從上次看到的地方接著看',{resume:true,badge:'繼續'},12);
  addUniqueRow('recommended','兒童推薦',all.filter(function(v){return v.recommended}),'精選適合兒童觀看的影片',{badge:'🧒 推薦'},20);
  addUniqueRow('favorites','我的最愛',p.favorites.map(videoById).filter(function(v){return v&&allowedVideo(v)}),'只屬於 '+p.name+' 的收藏',{badge:'★ 最愛'},SEARCH_RENDER_LIMIT);
  addUniqueRow('recent','最近觀看',p.recent.map(videoById).filter(function(v){return v&&allowedVideo(v)}),'最近點過的影片',{badge:'最近看過'},16);

  var cats=[
   ['英文','🔤 英文','字母、單字、歌曲與基礎英文'],
   ['兒歌','🎵 兒歌','兒歌、童謠與音樂'],
   ['卡通','🐻 卡通','巧虎、朱妮托尼等兒童卡通'],
   ['故事','📚 故事','妙妙犬布麗與其他兒童故事'],
   ['學習','🧠 學習','認知、生活習慣與幼兒學習'],
   ['自然／動物','🦖 自然／動物','動物、大自然與兒童科普'],
   ['數字／顏色','🔢🌈 數字／顏色','數字、顏色、形狀與基礎認知']
  ];

  // Do not render the built-in fixed category rows.
  // Start directly with "分類 · 更多", using cache immediately when available.
  cats.forEach(function(x,index){
   renderCategoryWithNetwork(x[0],x[1],x[2],shownIds,renderToken,index*(window.innerWidth<=700?90:140));
  });

 }else{
  // Clicking a category also shows only dynamically discovered content.
  var category=filter;

  function showCategory(network){
   if(!homeRenderIsCurrent(renderToken))return;

   var localIds={};
   all.filter(function(v){return v.category===category}).forEach(function(v){
    if(v&&v.id)localIds[v.id]=1;
   });

   var merged=uniqueVideoList(network||[]).filter(function(v){
    return v&&v.id&&!localIds[v.id];
   }).slice(0,SEARCH_RENDER_LIMIT);

   if(!merged.length)return;
   addUniqueRow(
    'single-more:'+category,
    category+' · 更多',
    merged,
    '自動補充的兒童相關影片',
    {badge:'✨ 更多'},
    SEARCH_RENDER_LIMIT
   );
  }

  if(CATEGORY_RECOMMENDATION_CACHE[category]&&CATEGORY_RECOMMENDATION_CACHE[category].length){
   showCategory(CATEGORY_RECOMMENDATION_CACHE[category]);
  }else{
   setTimeout(function(){
    if(!homeRenderIsCurrent(renderToken))return;
    fetchCategoryRecommendations(category,false).then(showCategory);
   },60);
  }
 }
}
function updateHero(){
 var p=profile(),v=p.recent.length?videoById(p.recent[0]):availableVideos()[0];
 $('heroTitle').textContent=v?('繼續看：'+v.title):'今天想看什麼？';$('heroText').textContent='選擇英文、兒歌、卡通、故事、學習、自然或數字顏色，或直接播放兒童推薦。';updateUsageUI();
}
function renderProfile(){var p=profile();if($('profileBtn'))$('profileBtn').textContent=(p.avatar||'🙂')+' '+p.name;updateHero()}
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
  card.className='search-result-card';card.setAttribute('data-video-id',v.id);
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
   if(isFavorite(v.id)){
    removeFavoriteId(v.id);save();syncFavoriteUI(v.id);slot.innerHTML='';return;
   }
   var auto=autoClassifyVideo({title:v.title,channel:v.channel,query:queryValue});
   saveVideoAsFavorite(temp,auto.category);
   addBtn.textContent='★ 已收藏';addBtn.classList.add('active');addBtn.disabled=false;
   slot.innerHTML=categoryPickerHtml(auto.category);
   var sel=slot.querySelector('.category-select');
   slot.querySelector('.category-save').onclick=function(){
    saveVideoAsFavorite(temp,sel.value);
    slot.innerHTML='<div class="category-saved">✓ 已分類：'+esc(sel.value)+'</div>';
   };
  };
  if(profile().favorites.indexOf(v.id)>=0){
   addBtn.textContent='★ 已收藏';addBtn.classList.add('active');addBtn.disabled=false;
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








function updateStoredVideoMetaFromPlayer(){
 if(!player||!currentId||!player.getVideoData)return;
 try{
  var d=player.getVideoData(),title=d&&d.title||'',author=d&&d.author||'',v=videoById(currentId);
  if(v){if(title&&(!v.title||v.title==='YouTube 影片'||v.title==='新影片'))v.title=title;if(author&&!v.channel)v.channel=author;save();renderRows();renderManage()}
 }catch(e){}
}


function enterImmersiveFullscreen(){
 watchFullscreenScrollY=window.pageYOffset||document.documentElement.scrollTop||0;
 document.body.classList.add('watch-scroll-lock');

 setMiniPlayer(false);
 miniPlayerActive=false;
 miniPlayerSuppressed=true;
 immersiveFull=true;
 document.body.classList.add('watch-fullscreen');
 document.documentElement.classList.add('watch-fullscreen-root');
 $('playerSection').classList.add('immersive-fullscreen');
 $('fullBtn').textContent='✕ 退出全螢幕';
 try{window.scrollTo(0,0)}catch(e){}
}
function exitImmersiveFullscreen(){
 immersiveFull=false;
 document.body.classList.remove('watch-fullscreen');
 document.documentElement.classList.remove('watch-fullscreen-root');
 $('playerSection').classList.remove('immersive-fullscreen');
 $('fullBtn').textContent='⛶ 全螢幕';
 setTimeout(updateMiniPlayerOnScroll,80);

 document.body.classList.remove('watch-scroll-lock');
 try{window.scrollTo(0,watchFullscreenScrollY||0)}catch(e){}

 miniPlayerSuppressUntil=Date.now()+1800;
 try{closeMiniPlayer()}catch(e){}
 try{
  var stage=$('playerStage')||$('playerSection');
  if(stage&&stage.scrollIntoView)stage.scrollIntoView({block:'start'});
 }catch(e){}

 setTimeout(function(){
  miniPlayerSuppressed=false;
  updateMiniPlayerOnScroll();
 },1900);
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


var HOME_RENDER_GENERATION=0;
var HOME_RENDER_ROW_KEYS={};

function beginHomeRender(){
 HOME_RENDER_GENERATION+=1;
 HOME_RENDER_ROW_KEYS={};
 return HOME_RENDER_GENERATION;
}

function homeRenderIsCurrent(token){
 return token===HOME_RENDER_GENERATION;
}

function claimHomeRowKey(key,token){
 if(!homeRenderIsCurrent(token))return false;
 if(HOME_RENDER_ROW_KEYS[key])return false;
 HOME_RENDER_ROW_KEYS[key]=1;
 return true;
}


var CATEGORY_RECOMMENDATION_CACHE={};
var CATEGORY_RECOMMENDATION_BUSY={};
var CATEGORY_NETWORK_LIMIT=20;
var CATEGORY_CACHE_KEY='watch_child_recommendation_cache_v1';
var CATEGORY_CACHE_TTL=6*60*60*1000;

function loadCategoryRecommendationCache(){
 try{
  var raw=localStorage.getItem(CATEGORY_CACHE_KEY);
  if(!raw)return;
  var obj=JSON.parse(raw);
  if(!obj||!obj.savedAt||Date.now()-obj.savedAt>CATEGORY_CACHE_TTL)return;
  CATEGORY_RECOMMENDATION_CACHE=obj.data||{};
 }catch(e){}
}

function saveCategoryRecommendationCache(){
 try{
  localStorage.setItem(CATEGORY_CACHE_KEY,JSON.stringify({
   savedAt:Date.now(),
   data:CATEGORY_RECOMMENDATION_CACHE
  }));
 }catch(e){}
}

loadCategoryRecommendationCache();


function recommendationVideoKey(v){
 return String((v&&v.id)||'');
}

function uniqueVideoList(list){
 var seen={},out=[];
 (list||[]).forEach(function(v){
  if(!v)return;
  var id=recommendationVideoKey(v);
  if(!id||seen[id])return;
  seen[id]=1;out.push(v);
 });
 return out;
}

function normalizeNetworkRecommendation(v,category){
 if(!v)return null;
 var id=v.id||v.videoId||'';
 if(!id)return null;
 return {
  id:id,
  title:v.title||'兒童影片',
  channel:v.channel||v.author||'',
  image:v.image||'',
  category:category,
  recommended:true,
  curated:false,
  networkRecommendation:true,
  categoryManual:true,
  autoCategory:false,
  addedAt:Date.now()
 };
}

function childRecommendationScore(v,category){
 var t=((v&&v.title)||'').toLowerCase();
 var c=((v&&v.channel)||'').toLowerCase();
 var text=t+' '+c;
 var score=0;
 var good=['kids','kid','children','child','preschool','nursery','learning','educational','official','abc','phonics','song','songs','animal','animals','nature','color','colors','number','numbers','cartoon','story','stories','巧虎','朱妮托尼','妙妙犬布麗','bluey','bebefinn','super simple','lingokids','nat geo kids'];
 var bad=['reaction','prank','gameplay','gaming','news','politics','shorts','short ','live stream','直播新聞','成人','恐怖','horror','武器','暴力'];
 good.forEach(function(k){if(text.indexOf(k)>=0)score+=4});
 bad.forEach(function(k){if(text.indexOf(k)>=0)score-=8});
 if(category==='英文'&&(text.indexOf('english')>=0||text.indexOf('abc')>=0||text.indexOf('phonics')>=0))score+=8;
 if(category==='兒歌'&&(text.indexOf('song')>=0||text.indexOf('nursery')>=0||text.indexOf('兒歌')>=0))score+=8;
 if(category==='卡通'&&(text.indexOf('cartoon')>=0||text.indexOf('巧虎')>=0||text.indexOf('bluey')>=0))score+=8;
 if(category==='故事'&&(text.indexOf('story')>=0||text.indexOf('故事')>=0||text.indexOf('bluey')>=0))score+=8;
 if(category==='學習'&&(text.indexOf('learning')>=0||text.indexOf('educational')>=0||text.indexOf('學習')>=0))score+=8;
 if(category==='自然／動物'&&(text.indexOf('animal')>=0||text.indexOf('nature')>=0||text.indexOf('動物')>=0||text.indexOf('自然')>=0))score+=8;
 if(category==='數字／顏色'&&(text.indexOf('number')>=0||text.indexOf('color')>=0||text.indexOf('數字')>=0||text.indexOf('顏色')>=0))score+=8;
 return score;
}

function rankChildRecommendations(items,category){
 return (items||[]).map(function(v,i){
  return {v:v,s:childRecommendationScore(v,category),i:i};
 }).sort(function(a,b){
  if(b.s!==a.s)return b.s-a.s;
  return a.i-b.i;
 }).map(function(x){return x.v});
}


function fetchCategoryRecommendationsFast(category){
 if(CATEGORY_RECOMMENDATION_CACHE[category]&&CATEGORY_RECOMMENDATION_CACHE[category].length)return Promise.resolve(CATEGORY_RECOMMENDATION_CACHE[category].slice());
 var queries=(CHILD_RECOMMENDATION_QUERIES[category]||[]).slice();
 if(!queries.length)return Promise.resolve([]);
 return fetchSearchWithFallback(queries[0],1).then(function(res){
  var ranked=rankChildRecommendations((res&&res.items)||[],category);
  return uniqueVideoList(ranked.map(function(v){return normalizeNetworkRecommendation(v,category)}).filter(Boolean)).slice(0,12);
 }).catch(function(){return []});
}

function fetchCategoryRecommendations(category,force){
 if(!category)return Promise.resolve([]);
 if(!force&&CATEGORY_RECOMMENDATION_CACHE[category])return Promise.resolve(CATEGORY_RECOMMENDATION_CACHE[category].slice());
 if(CATEGORY_RECOMMENDATION_BUSY[category])return CATEGORY_RECOMMENDATION_BUSY[category];

 var queries=(CHILD_RECOMMENDATION_QUERIES[category]||[]).slice(0,4);
 if(!queries.length)return Promise.resolve([]);

 var task=Promise.all(queries.map(function(q){
  return fetchSearchWithFallback(q,1).then(function(res){
   return (res&&res.items)||[];
  }).catch(function(){return []});
 })).then(function(groups){
  var merged=[];
  groups.forEach(function(g){merged=merged.concat(g||[])});
  var ranked=rankChildRecommendations(merged,category);
  var out=uniqueVideoList(ranked.map(function(v){return normalizeNetworkRecommendation(v,category)}).filter(Boolean)).slice(0,CATEGORY_NETWORK_LIMIT);
  CATEGORY_RECOMMENDATION_CACHE[category]=out.slice();
  saveCategoryRecommendationCache();
  CATEGORY_RECOMMENDATION_BUSY[category]=null;
  return out;
 }).catch(function(){
  CATEGORY_RECOMMENDATION_BUSY[category]=null;
  return [];
 });

 CATEGORY_RECOMMENDATION_BUSY[category]=task;
 return task;
}

function mergeLocalAndNetworkCategory(category,network){
 var local=availableVideos().filter(function(v){return v.category===category});
 return uniqueVideoList(local.concat(network||[]));
}


function categoryRowId(category){
 return 'dynamic-category-'+String(category||'').replace(/[^\w\u4e00-\u9fff]+/g,'-');
}
function ensureCategoryPlaceholder(category,title,sub,renderToken){
 if(!homeRenderIsCurrent(renderToken))return null;
 var root=$('dynamicRows');if(!root)return null;
 var id=categoryRowId(category),sec=document.getElementById(id);
 if(sec)return sec;
 sec=document.createElement('section');
 sec.className='media-row category-loading-row';
 sec.id=id;
 sec.innerHTML='<div class="row-head"><div><h2>'+esc(title+' · 更多')+'</h2><span>'+esc(sub)+'</span></div><div class="category-load-status">正在載入推薦影片…</div></div><div class="category-skeleton-strip"><div class="category-skeleton"></div><div class="category-skeleton"></div><div class="category-skeleton"></div></div>';
 root.appendChild(sec);return sec;
}
function replaceCategoryPlaceholderWithVideos(category,title,sub,items,renderToken){
 if(!homeRenderIsCurrent(renderToken)||!items||!items.length)return false;
 var sec=document.getElementById(categoryRowId(category));
 if(sec&&sec.parentNode)sec.parentNode.removeChild(sec);
 if(!claimHomeRowKey('more:'+category,renderToken))return false;
 addRow(title+' · 更多',items,sub,{badge:'✨ 更多'});
 return true;
}
function showCategoryLoadFailure(category,renderToken){
 if(!homeRenderIsCurrent(renderToken))return;
 var sec=document.getElementById(categoryRowId(category));if(!sec)return;
 var st=sec.querySelector('.category-load-status');
 if(st)st.innerHTML='<button type="button" class="category-retry-btn">↻ 重新載入</button>';
 var b=st&&st.querySelector('button');
 if(b)b.onclick=function(){delete CATEGORY_RECOMMENDATION_CACHE[category];renderRows('all')};
 var sk=sec.querySelector('.category-skeleton-strip');
 if(sk)sk.innerHTML='<div class="category-empty-hint">目前沒有取得推薦影片，可稍後再試。</div>';
}

function renderCategoryWithNetwork(category,title,sub,shownIds,renderToken,networkDelay){
 if(!homeRenderIsCurrent(renderToken))return;
 var local=availableVideos().filter(function(v){return v.category===category}),localIds={};
 local.forEach(function(v){if(v&&v.id)localIds[v.id]=1});
 ensureCategoryPlaceholder(category,title,sub,renderToken);
 function paint(network){
  var extra=uniqueVideoList(network||[]).filter(function(v){return v&&v.id&&!localIds[v.id]&&!shownIds[v.id]}).slice(0,SEARCH_RENDER_LIMIT);
  if(!extra.length)return false;
  extra.forEach(function(v){shownIds[v.id]=1});
  return replaceCategoryPlaceholderWithVideos(category,title,sub,extra,renderToken);
 }
 if(CATEGORY_RECOMMENDATION_CACHE[category]&&CATEGORY_RECOMMENDATION_CACHE[category].length){paint(CATEGORY_RECOMMENDATION_CACHE[category]);return}
 setTimeout(function(){
  if(!homeRenderIsCurrent(renderToken))return;
  fetchCategoryRecommendationsFast(category).then(function(first){
   if(!homeRenderIsCurrent(renderToken))return;
   var ok=paint(first);
   setTimeout(function(){
    if(!homeRenderIsCurrent(renderToken))return;
    fetchCategoryRecommendations(category,true).then(function(full){
     if(document.getElementById(categoryRowId(category))&&!paint(full))showCategoryLoadFailure(category,renderToken);
    }).catch(function(){if(!ok)showCategoryLoadFailure(category,renderToken)});
   },900);
  }).catch(function(){showCategoryLoadFailure(category,renderToken)});
 },networkDelay||0);
}

function childRelatedQuery(v){
 if(!v)return '';
 var base=(v.title||'')+' '+(v.channel||'');
 var cat=v.category||'';
 var hints={
  '英文':' kids English learning alphabet phonics',
  '兒歌':' kids songs nursery rhymes child friendly',
  '卡通':' kids cartoon animation child friendly',
  '故事':' kids story bedtime story child friendly',
  '學習':' kids educational learning preschool',
  '自然／動物':' kids animals nature educational',
  '數字／顏色':' kids numbers colors learning'
 };
 return base+(hints[cat]||' kids child friendly');
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
 if($('tvFullscreenExitBtn'))$('tvFullscreenExitBtn').onclick=exitTvFullscreen;

 window.addEventListener('orientationchange',function(){
  if(tvModeActive)scheduleTvOrientationLayout();
 });
 window.addEventListener('resize',function(){
  if(tvModeActive)scheduleTvOrientationLayout();
 });

 if($('ktvQueueDrawerBtn'))$('ktvQueueDrawerBtn').onclick=toggleKtvQueueDrawer;
 if($('ktvQueueDrawerClose'))$('ktvQueueDrawerClose').onclick=function(){setKtvQueueDrawer(false)};
 if($('ktvQueueDrawerBackdrop'))$('ktvQueueDrawerBackdrop').onclick=function(){setKtvQueueDrawer(false)};
 window.addEventListener('resize',function(){
  if(window.innerWidth>900)setKtvQueueDrawer(false);
 });

 // Critical top-level navigation is bound first so an optional mode error
 // can never make Video / Music / KTV / TV buttons unclickable.
 try{
  if($('videoModeBtn'))$('videoModeBtn').onclick=showVideoMode;
  if($('musicModeBtn'))$('musicModeBtn').onclick=showMusicMode;
  if($('ktvModeBtn'))$('ktvModeBtn').onclick=showKtvMode;
  if($('tvModeBtn'))$('tvModeBtn').onclick=showTvMode;
  if($('brandHomeBtn'))$('brandHomeBtn').onclick=showVideoMode;
 }catch(criticalNavError){
  try{console.error('Critical navigation binding failed',criticalNavError)}catch(ignore){}
 }
 if($('tvDrawerBackdrop'))$('tvDrawerBackdrop').onclick=function(){setTvSidebarCollapsed(true)};
 window.addEventListener('orientationchange',function(){if(tvModeActive)setTimeout(function(){setTvSidebarCollapsed(true)},180)});

 if($('musicRetryBtn'))$('musicRetryBtn').onclick=function(){RADIO_SERVER_DISCOVERY_DONE=false;loadRadioCategory(radioCategory);};
 if($('searchMoreBtn'))$('searchMoreBtn').onclick=function(){runInternalSearch(false)};
 if($('tvMiniCloseBtn'))$('tvMiniCloseBtn').onclick=function(){
  tvPortraitMiniDismissed=true;
  setTvPortraitMini(false);
 };
 document.addEventListener('touchmove',function(e){
  if(document.body.classList.contains('watch-scroll-lock'))e.preventDefault();
 },{passive:false});

 document.querySelectorAll('.ktv-song-cat').forEach(function(b){
  b.onclick=function(){
   var cat=b.dataset.songCat||'';
   var list=cat==='__all__'?KTV_SONGS.slice():KTV_SONGS.filter(function(s){return s.tag===cat||s.region===cat||s.era===cat});
   $('ktvSingerPanel').classList.add('hidden');$('ktvSongPanel').classList.remove('hidden');
   renderKtvSongs(list,(cat==='__all__'?'全部':cat)+'歌曲',list.length+' 首');
   $('ktvStatus').textContent='已顯示 '+list.length+' 首 '+cat+' 歌曲';
  };
 });

 if($('tvSidebarToggleBtn'))$('tvSidebarToggleBtn').onclick=toggleTvSidebar;
 if($('tvPauseBtn'))$('tvPauseBtn').onclick=toggleTvPause;
 updateTvPauseBtn();
 try{

 if($('tvModeBtn'))$('tvModeBtn').onclick=showTvMode;
 document.querySelectorAll('.tv-nav').forEach(function(b){b.onclick=function(){renderTvNav(b.dataset.tvnav)}});
 if($('tvCountrySearch'))$('tvCountrySearch').oninput=function(){renderTvCountries(this.value)};
 if($('tvFavBtn'))$('tvFavBtn').onclick=toggleTvFavorite;
 if($('tvFullscreenBtn'))$('tvFullscreenBtn').onclick=toggleTvFullscreen;
 if($('tvReloadBtn'))$('tvReloadBtn').onclick=reloadTvEmbed;
 if($('tvOpenSourceBtn'))$('tvOpenSourceBtn').onclick=function(){if(tvCurrentUrl)window.open(tvCurrentUrl,'_blank','noopener')};
 renderTvCountries('');
if($('ktvClosePlayerBtn'))$('ktvClosePlayerBtn').onclick=closeKtvPlayer;
 if($('ktvReplayBtn'))$('ktvReplayBtn').onclick=replayKtvCurrent;
 if($('ktvPlayerCutBtn'))$('ktvPlayerCutBtn').onclick=cutKtvSong;
 if($('ktvPlayerQueueBtn'))$('ktvPlayerQueueBtn').onclick=function(){renderKtvNav('queue')};

 document.querySelectorAll('.ktv-singer-filter').forEach(function(b){
  b.onclick=function(){
   ktvSingerFilter=b.dataset.singerFilter||'all';
   document.querySelectorAll('.ktv-singer-filter').forEach(function(x){x.classList.toggle('active',x===b)});
   renderKtvSingers();
  };
 });
 document.querySelectorAll('.ktv-letter').forEach(function(b){
  b.onclick=function(){
   ktvSingerLetter=b.dataset.letter||'all';
   document.querySelectorAll('.ktv-letter').forEach(function(x){x.classList.toggle('active',x===b)});
   renderKtvSingers();
  };
 });

 if($('ktvModeBtn'))$('ktvModeBtn').onclick=showKtvMode;
 if($('ktvSearchBtn'))$('ktvSearchBtn').onclick=function(){searchKtv()};
 if($('ktvSearchInput'))$('ktvSearchInput').onkeydown=function(e){if(e.key==='Enter')searchKtv()};
 document.querySelectorAll('.ktv-nav').forEach(function(b){b.onclick=function(){
  if(b.dataset.ktvnav==='queue'&&window.innerWidth<=900){
   renderKtvQueue();
   setKtvQueueDrawer(true);
   return;
  }
  renderKtvNav(b.dataset.ktvnav);
 }});
 document.querySelectorAll('.ktv-search-type').forEach(function(b){b.onclick=function(){
  ktvSearchType=b.dataset.ktvtype;
  document.querySelectorAll('.ktv-search-type').forEach(function(x){x.classList.toggle('active',x===b)});
 }});
 if($('ktvStartBtn'))$('ktvStartBtn').onclick=startKtvQueue;
 if($('ktvCutBtn'))$('ktvCutBtn').onclick=cutKtvSong;
 if($('ktvClearQueueBtn'))$('ktvClearQueueBtn').onclick=function(){
  if(!confirm('確定清空所有已點歌曲？'))return;
  state.ktv.queue=[];save();renderKtvQueue();
 };
 try{
  renderKtvSingers();
  renderKtvQueue();
 }catch(ktvInitError){
  try{console.error('KTV initial render failed',ktvInitError)}catch(ignore){}
  if($('ktvStatus'))$('ktvStatus').textContent='KTV 資料初始化部分失敗，可切換頁面後重試。';
 }

 document.querySelectorAll('.radio-cat').forEach(function(b){
  b.onclick=function(){loadRadioCategory(b.dataset.radioCat)};
 });if($('videoModeBtn'))$('videoModeBtn').onclick=showVideoMode;
 if($('musicModeBtn'))$('musicModeBtn').onclick=showMusicMode;
 if($('musicSearchBtn'))$('musicSearchBtn').onclick=searchMusic;
 if($('musicSearchInput'))$('musicSearchInput').onkeydown=function(e){if(e.key==='Enter')searchMusic()};
 if($('musicPlayBtn'))$('musicPlayBtn').onclick=toggleMusicPlay;
 if($('musicStopBtn'))$('musicStopBtn').onclick=stopMusic;
 if($('musicNextBtn'))$('musicNextBtn').onclick=nextMusic;
 if($('musicPrevBtn'))$('musicPrevBtn').onclick=prevMusic;
 if($('musicFavBtn'))$('musicFavBtn').onclick=toggleMusicFavorite;
 if($('musicVolume')){
  $('musicVolume').value=String(state.music.volume||0.85);
  $('musicVolume').oninput=function(){state.music.volume=parseFloat(this.value)||0;$('musicAudio').volume=state.music.volume;save()};
 }
 document.querySelectorAll('.music-nav').forEach(function(b){b.onclick=function(){renderMusicNav(b.dataset.musicnav)}});
 if($('musicAudio')){
  $('musicAudio').volume=state.music.volume||0.85;
  $('musicAudio').addEventListener('play',function(){$('musicPlayBtn').textContent='⏸';if('mediaSession' in navigator)navigator.mediaSession.playbackState='playing'});
  $('musicAudio').addEventListener('pause',function(){$('musicPlayBtn').textContent='▶';if('mediaSession' in navigator)navigator.mediaSession.playbackState='paused'});
  $('musicAudio').addEventListener('error',function(){$('musicSearchStatus').textContent='目前串流來源中斷，請換另一個來源。'});
 }
 try{setupMediaSessionActions()}catch(mediaSessionError){
  try{console.warn('Media Session not available',mediaSessionError)}catch(ignore){}
 }

 if($('loopBtn'))$('loopBtn').onclick=toggleLoopPlayback;
 updateLoopBtn();
 if($('loopCurrentEnabled'))$('loopCurrentEnabled').checked=!!(state.playback&&state.playback.loopCurrent);
 if($('savePlaybackBtn'))$('savePlaybackBtn').onclick=function(){
  if(!state.playback)state.playback={loopCurrent:false};
  state.playback.loopCurrent=!!$('loopCurrentEnabled').checked;
  save();updateLoopBtn();
  alert(state.playback.loopCurrent?'已開啟目前影片循環播放':'已關閉循環；播放結束會接續相關推薦');
 };

 }catch(modeInitError){try{console.error('Optional mode init failed',modeInitError)}catch(ignore){}}

 bindSidebar();

 bindUiSafely();

 // Optional mini-player setup must never block the main UI.
 try{
  if($('miniPlayerClose'))$('miniPlayerClose').onclick=closeMiniPlayer;
  bindMiniPlayerScroll();
 }catch(e){}

 document.querySelectorAll('.avatar-grid button').forEach(function(b){b.onclick=function(){selectedAvatar=b.dataset.avatar;document.querySelectorAll('.avatar-grid button').forEach(function(x){x.classList.toggle('active',x.dataset.avatar===selectedAvatar)})}});
 $('homeSearchBtn').onclick=function(){if(searchTapLocked)return;searchTapLocked=true;setTimeout(function(){searchTapLocked=false},500);runInternalSearch(true)};
 $('homeSearchInput').addEventListener('keydown',function(e){if(e.key==='Enter'||e.keyCode===13)runInternalSearch(true)});
 $('brandHomeBtn').onclick=showVideoMode;
 if($('profileBtn'))$('profileBtn').onclick=toggleProfile;$('homeBtn').onclick=showHome;$('parentBtn').onclick=openParent;$('closeParentBtn').onclick=closeParent;$('backToHomeBtn').onclick=showHome;
 $('heroPlayBtn').onclick=function(){
 var rec=availableVideos().filter(function(v){return v.recommended});
 var p=profile(),recentMap={};
 (p.recent||[]).slice(0,6).forEach(function(id){recentMap[id]=1});
 var fresh=rec.filter(function(v){return !recentMap[v.id]});
 var pool=fresh.length?fresh:rec;
 var v=pool.length?pool[Math.floor(Math.random()*pool.length)]:(p.recent.length?videoById(p.recent[0]):availableVideos()[0]);
 if(v)selectVideo(v.id,availableVideos());
};
 $('prevBtn').onclick=prevVideo;$('nextBtn').onclick=nextVideo;$('playBtn').onclick=function(){if(!canPlay())return;if(playerMode==='iframe'){sendDirectCommand('playVideo');return}if(!player||!playerReady){if(currentId)playSelectedId(currentId);return}player.getPlayerState()===YT.PlayerState.PLAYING?player.pauseVideo():player.playVideo()};$('favBtn').onclick=toggleFav;
 $('fullBtn').onclick=toggleImmersiveFullscreen;
 $('addBtn').onclick=addVideo;$('batchAddBtn').onclick=batchAdd;
 $('savePinBtn').onclick=function(){var p=$('pinInput').value.trim();if(!/^\d{4,6}$/.test(p)){alert('請輸入 4～6 位數 PIN');return}state.pin=p;save();$('pinInput').value='';alert('PIN 已更新')};
 $('profileSelect').onchange=function(){state.activeProfile=this.value;loadParentFields();renderProfile()};$('dailyLimit').onchange=function(){profile().dailyLimit=parseInt(this.value,10)||0;save();updateUsageUI()};
 $('saveProfileBtn').onclick=saveProfileSettings;$('saveBedBtn').onclick=saveBed;$('saveWhitelistBtn').onclick=saveWhitelist;$('exportBtn').onclick=exportData;$('importInput').onchange=function(){if(this.files[0])importData(this.files[0])};
 $('modalCancel').onclick=function(){closeModal(false)};$('modalOk').onclick=function(){closeModal($('modalInput').value===state.pin)};
 document.addEventListener('fullscreenchange',function(){if(!document.fullscreenElement&&immersiveFull&&$('playerSection').classList.contains('immersive-fullscreen')){/* keep CSS immersive on iPad fallback */}if(!document.fullscreenElement&&document.body.classList.contains('tv-fullscreen'))exitTvFullscreen()});
 document.addEventListener('webkitfullscreenchange',function(){if(!document.webkitFullscreenElement&&immersiveFull&&$('playerSection').classList.contains('immersive-fullscreen')){/* keep CSS immersive */}});
 document.addEventListener('keydown',function(e){if((e.key==='Escape'||e.keyCode===27)&&immersiveFull)exitImmersiveFullscreen();if((e.key==='Escape'||e.keyCode===27)&&document.body.classList.contains('tv-fullscreen'))exitTvFullscreen()});
 if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)
 renderAll();showHome();
 setTimeout(loadYouTubeApiAsync,50);
});
})();

function installServiceWorkerUpdateFlow(){
 if(!('serviceWorker' in navigator))return;

 var reloadKey='watch_videotu_sw_reload_'+APP_BUILD;
 var versionKey='watch_videotu_app_build';

 function reloadOnce(){
  try{
   if(sessionStorage.getItem(reloadKey)==='1')return;
   sessionStorage.setItem(reloadKey,'1');
  }catch(e){}
  location.reload();
 }

 navigator.serviceWorker.register('sw.js?v='+APP_BUILD,{updateViaCache:'none'}).then(function(reg){
  try{reg.update()}catch(e){}

  if(reg.waiting){
   try{reg.waiting.postMessage({type:'SKIP_WAITING'})}catch(e){}
  }

  reg.addEventListener('updatefound',function(){
   var nw=reg.installing;
   if(!nw)return;
   nw.addEventListener('statechange',function(){
    if(nw.state==='installed'&&navigator.serviceWorker.controller){
     try{nw.postMessage({type:'SKIP_WAITING'})}catch(e){}
    }
   });
  });
 }).catch(function(e){
  try{console.warn('SW register/update failed',e)}catch(ignore){}
 });

 var changing=false;
 navigator.serviceWorker.addEventListener('controllerchange',function(){
  if(changing)return;
  changing=true;
  reloadOnce();
 });

 // If this browser remembers an older app build, force one SW/cache refresh cycle.
 try{
  var oldBuild=localStorage.getItem(versionKey);
  if(oldBuild!==APP_BUILD){
   localStorage.setItem(versionKey,APP_BUILD);
   navigator.serviceWorker.getRegistration().then(function(reg){
    if(reg){try{reg.update()}catch(e){}}
   });
  }
 }catch(e){}
}

if(document.readyState==='loading'){
 document.addEventListener('DOMContentLoaded',installServiceWorkerUpdateFlow);
}else{
 installServiceWorkerUpdateFlow();
}

