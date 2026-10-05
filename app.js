(function(){
  'use strict';
  var STORAGE_KEY='familytube_v1_library';
  var SETTINGS_KEY='familytube_v11_settings';
  var RECENT_KEY='familytube_v11_recent';
  var DEFAULT_VIDEOS=[{id:'M7lc1UVf-VE',title:'YouTube 播放測試影片',category:'測試',favorite:false,addedAt:Date.now()}];
  var videos=loadJSON(STORAGE_KEY,DEFAULT_VIDEOS);
  var settings=loadJSON(SETTINGS_KEY,{autoNext:true,kidLock:true,parentPin:'',timerMinutes:0});
  var recent=loadJSON(RECENT_KEY,[]);
  var activeCategory='全部', currentIndex=-1, player=null, playerReady=false, kidMode=false, pendingPinAction=null;
  var timerEnd=0,timerHandle=null;
  var pageOrigin=(location.protocol==='http:'||location.protocol==='https:')?(location.protocol+'//'+location.host):'';

  function el(id){return document.getElementById(id)}
  function cloneFallback(v){return v&&v.slice?v.slice():v}
  function loadJSON(key,fallback){try{var raw=localStorage.getItem(key);return raw?JSON.parse(raw):cloneFallback(fallback)}catch(e){return cloneFallback(fallback)}}
  function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(videos));localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));localStorage.setItem(RECENT_KEY,JSON.stringify(recent))}
  function escapeHTML(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function youtubeId(url){var m=String(url||'').trim().match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);if(m)return m[1];if(/^[A-Za-z0-9_-]{11}$/.test(String(url||'').trim()))return String(url).trim();return ''}
  function indexById(id){for(var i=0;i<videos.length;i++)if(videos[i].id===id)return i;return -1}
  function categories(){var out=['全部'];for(var i=0;i<videos.length;i++){var c=videos[i].category||'其他';if(out.indexOf(c)===-1)out.push(c)}return out}
  function categoryIcon(c){var map={'英文':'ABC','兒歌':'♫','故事':'📖','卡通':'★','學習':'✎','動物':'🐾','測試':'▶','其他':'●'};return map[c]||'▶'}
  function visibleVideos(){var arr=[];for(var i=0;i<videos.length;i++)if(activeCategory==='全部'||(videos[i].category||'其他')===activeCategory)arr.push({v:videos[i],index:i});return arr}
  function renderCategories(){var html='',cats=categories();for(var i=0;i<cats.length;i++)html+='<button type="button" class="category-chip '+(cats[i]===activeCategory?'active':'')+'" data-cat="'+escapeHTML(cats[i])+'">'+escapeHTML(cats[i])+'</button>';el('categoryBar').innerHTML=html}
  function renderHomeCategories(){var cats=categories(),html='';for(var i=0;i<cats.length;i++){if(cats[i]==='全部')continue;var count=0;for(var j=0;j<videos.length;j++)if((videos[j].category||'其他')===cats[i])count++;html+='<button class="category-tile" type="button" data-homecat="'+escapeHTML(cats[i])+'"><span class="category-icon">'+escapeHTML(categoryIcon(cats[i]))+'</span><strong>'+escapeHTML(cats[i])+'</strong><small>'+count+' 部影片</small></button>'}html+='<button class="category-tile all-tile" type="button" data-homecat="全部"><span class="category-icon">▶</span><strong>全部影片</strong><small>'+videos.length+' 部影片</small></button>';el('homeCategories').innerHTML=html}
  function posterHTML(v,idx){return '<article class="poster-card" data-index="'+idx+'"><div class="poster-thumb"><img loading="lazy" src="https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg" alt=""><span class="play-dot">▶</span></div><span class="eyebrow">'+escapeHTML(v.category||'其他')+'</span><h3>'+escapeHTML(v.title||'未命名影片')+'</h3></article>'}
  function renderShelves(){var recentHtml='',favHtml='',shown=0;for(var i=0;i<recent.length&&shown<8;i++){var idx=indexById(recent[i]);if(idx>=0){recentHtml+=posterHTML(videos[idx],idx);shown++}}el('recentShelf').innerHTML=recentHtml||'<div class="shelf-empty">看過的影片會出現在這裡。</div>';for(var j=0;j<videos.length;j++)if(videos[j].favorite)favHtml+=posterHTML(videos[j],j);el('favoriteShelf').innerHTML=favHtml||'<div class="shelf-empty">點影片旁的 ☆，就能收藏到這裡。</div>';if(recent.length){var last=indexById(recent[0]);if(last>=0){el('continueBtn').classList.remove('hidden');el('continueTitle').textContent=videos[last].title}else el('continueBtn').classList.add('hidden')}else el('continueBtn').classList.add('hidden')}
  function renderList(){var items=visibleVideos(),html='';if(!items.length){el('videoList').innerHTML='<div class="list-empty"><h3>這個分類還沒有影片</h3><p>請由家長新增影片。</p></div>';return}for(var i=0;i<items.length;i++){var v=items[i].v,idx=items[i].index;html+='<article class="video-card '+(idx===currentIndex?'active':'')+'" data-index="'+idx+'"><img class="thumb" loading="lazy" src="https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg" alt=""><div class="card-copy"><span class="eyebrow">'+escapeHTML(v.category||'其他')+'</span><h3>'+escapeHTML(v.title||'未命名影片')+'</h3><div class="card-bottom"><span class="fav-mini">'+(v.favorite?'★':'☆')+'</span><div class="card-actions parent-only"><button type="button" class="delete-btn" data-delete="'+idx+'">刪除</button></div></div></div></article>'}el('videoList').innerHTML=html}
  function renderSettings(){el('autoplayToggle').checked=!!settings.autoNext;el('kidLockToggle').checked=!!settings.kidLock;el('pinStatus').textContent=settings.parentPin?'已設定家長 PIN':'尚未設定 PIN';var buttons=document.querySelectorAll('[data-minutes]');for(var i=0;i<buttons.length;i++)buttons[i].classList.toggle('active',parseInt(buttons[i].getAttribute('data-minutes'),10)===parseInt(settings.timerMinutes||0,10))}
  function render(){renderCategories();renderHomeCategories();renderShelves();renderList();renderSettings();updateFavoriteButton()}

  function showView(name){el('homeView').classList.toggle('hidden',name!=='home');el('watchView').classList.toggle('hidden',name!=='watch');if(name==='home')window.scrollTo(0,0)}
  function showPlayerError(code){var box=el('playerError'),title=el('playerErrorTitle'),text=el('playerErrorText');title.textContent='影片無法播放';if(code===153){title.textContent='YouTube 錯誤 153';text.textContent=location.protocol==='file:'?'請把整個資料夾放到 GitHub Pages 後，用 https 網址開啟。':'YouTube 沒有收到網站來源識別，請重新整理頁面。'}else if(code===101||code===150)text.textContent='這部影片的上傳者禁止在其他網站嵌入播放。請改選其他影片。';else if(code===100)text.textContent='影片不存在、已刪除或設為私人。';else text.textContent='YouTube 回報播放器錯誤：'+code;box.classList.remove('hidden')}
  function hidePlayerError(){el('playerError').classList.add('hidden')}
  window.onYouTubeIframeAPIReady=function(){var vars={playsinline:1,rel:0,controls:1,fs:1,iv_load_policy:3};if(pageOrigin)vars.origin=pageOrigin;player=new YT.Player('player',{width:'100%',height:'100%',videoId:'',playerVars:vars,events:{onReady:function(){playerReady=true},onStateChange:function(e){if(e.data===YT.PlayerState.PLAYING)hidePlayerError();if(e.data===YT.PlayerState.ENDED&&settings.autoNext)nextVideo()},onError:function(e){showPlayerError(e.data)}}})};
  function addRecent(id){var arr=[id];for(var i=0;i<recent.length;i++)if(recent[i]!==id)arr.push(recent[i]);recent=arr.slice(0,20);save()}
  function playIndex(idx){if(idx<0||idx>=videos.length)return;if(location.protocol==='file:'){showView('watch');showPlayerError(153);return}hidePlayerError();currentIndex=idx;var v=videos[idx];activeCategory=v.category||'其他';addRecent(v.id);el('emptyPlayer').classList.add('hidden');el('nowTitle').textContent=v.title||'未命名影片';el('nowMeta').textContent=(v.category||'其他')+' · YouTube';el('libraryTitle').textContent=v.category||'選擇影片';showView('watch');render();if(playerReady&&player&&player.loadVideoById)player.loadVideoById(v.id);else setTimeout(function(){if(playerReady&&player)player.loadVideoById(v.id)},700)}
  function nextVideo(){if(!videos.length)return;playIndex(currentIndex<0?0:(currentIndex+1)%videos.length)}
  function prevVideo(){if(!videos.length)return;playIndex(currentIndex<0?0:(currentIndex-1+videos.length)%videos.length)}
  function togglePlay(){if(!playerReady||!player)return;var s=player.getPlayerState();if(s===YT.PlayerState.PLAYING)player.pauseVideo();else player.playVideo()}
  function fullscreen(){var frame=el('videoFrame'),iframe=frame.querySelector('iframe');var req=frame.requestFullscreen||frame.webkitRequestFullscreen;if(req){try{req.call(frame)}catch(e){}}else if(iframe&&iframe.webkitEnterFullscreen){try{iframe.webkitEnterFullscreen()}catch(e2){}}}
  function updateFavoriteButton(){if(currentIndex<0||!videos[currentIndex]){el('favoriteBtn').textContent='☆';el('favoriteBtn').classList.remove('active');return}var on=!!videos[currentIndex].favorite;el('favoriteBtn').textContent=on?'★':'☆';el('favoriteBtn').classList.toggle('active',on)}
  function toggleFavorite(){if(currentIndex<0||!videos[currentIndex])return;videos[currentIndex].favorite=!videos[currentIndex].favorite;save();render()}
  function openModal(id){el(id).classList.remove('hidden');el(id).setAttribute('aria-hidden','false')}
  function closeModal(id){el(id).classList.add('hidden');el(id).setAttribute('aria-hidden','true')}
  function setKidMode(on){kidMode=!!on;document.body.classList.toggle('kid-mode',kidMode);el('focusBtn').textContent=kidMode?'離開兒童模式':'進入兒童模式';if(kidMode)showView('home')}
  function requireParent(action){if(!settings.parentPin){action();return}pendingPinAction=action;el('pinInput').value='';el('pinMsg').textContent='';openModal('pinModal');setTimeout(function(){el('pinInput').focus()},100)}
  function verifyPin(){if(String(el('pinInput').value)===String(settings.parentPin)){closeModal('pinModal');var fn=pendingPinAction;pendingPinAction=null;if(fn)fn()}else el('pinMsg').textContent='PIN 不正確，請再試一次。'}
  function startTimer(minutes){settings.timerMinutes=minutes;save();if(timerHandle){clearInterval(timerHandle);timerHandle=null}if(!minutes){timerEnd=0;el('timerBadge').classList.add('hidden');renderSettings();return}timerEnd=Date.now()+minutes*60000;el('timerBadge').classList.remove('hidden');timerHandle=setInterval(updateTimer,1000);updateTimer();renderSettings()}
  function updateTimer(){if(!timerEnd)return;var left=Math.max(0,timerEnd-Date.now()),sec=Math.ceil(left/1000),m=Math.floor(sec/60),s=sec%60;el('timerBadge').textContent='⏱ '+m+':'+(s<10?'0':'')+s;if(left<=0){clearInterval(timerHandle);timerHandle=null;timerEnd=0;el('timerBadge').classList.add('hidden');if(player&&player.pauseVideo)player.pauseVideo();openModal('timeUpModal')}}

  el('homeBtn').onclick=function(){showView('home')};
  el('homeCategories').onclick=function(e){var b=e.target.closest?e.target.closest('[data-homecat]'):null;if(!b)return;activeCategory=b.getAttribute('data-homecat');showView('watch');render()};
  function shelfClick(e){var card=e.target.closest?e.target.closest('[data-index]'):null;if(card)playIndex(parseInt(card.getAttribute('data-index'),10))}
  el('recentShelf').onclick=shelfClick;el('favoriteShelf').onclick=shelfClick;
  el('continueBtn').onclick=function(){if(!recent.length)return;var idx=indexById(recent[0]);if(idx>=0)playIndex(idx)};
  el('categoryBar').onclick=function(e){var b=e.target.closest?e.target.closest('[data-cat]'):null;if(!b)return;activeCategory=b.getAttribute('data-cat');render()};
  el('videoList').onclick=function(e){var d=e.target.getAttribute&&e.target.getAttribute('data-delete');if(d!==null){e.stopPropagation();var idx=parseInt(d,10);requireParent(function(){if(confirm('要從這台裝置刪除這部影片嗎？')){var id=videos[idx].id;videos.splice(idx,1);recent=recent.filter(function(x){return x!==id});if(currentIndex===idx)currentIndex=-1;else if(currentIndex>idx)currentIndex--;save();render()}});return}var card=e.target.closest?e.target.closest('.video-card'):null;if(card)playIndex(parseInt(card.getAttribute('data-index'),10))};
  el('addBtn').onclick=function(){requireParent(function(){openModal('parentModal');setTimeout(function(){el('urlInput').focus()},100)})};
  el('closeModal').onclick=function(){closeModal('parentModal')};
  el('parentBtn').onclick=function(){requireParent(function(){openModal('settingsModal')})};
  el('closeSettings').onclick=function(){closeModal('settingsModal')};
  el('closePin').onclick=function(){pendingPinAction=null;closeModal('pinModal')};el('pinConfirmBtn').onclick=verifyPin;el('pinInput').onkeydown=function(e){if(e.key==='Enter')verifyPin()};
  el('saveVideoBtn').onclick=function(){var id=youtubeId(el('urlInput').value);if(!id){el('formMsg').textContent='網址格式無法辨識，請貼一般 YouTube、youtu.be 或 Shorts 網址。';return}var title=el('titleInput').value.trim()||'新影片',cat=el('categoryInput').value.trim()||'其他';videos.push({id:id,title:title,category:cat,favorite:false,addedAt:Date.now()});save();el('urlInput').value='';el('titleInput').value='';el('categoryInput').value='';el('formMsg').textContent='已加入影片庫。';activeCategory='全部';render();setTimeout(function(){closeModal('parentModal');el('formMsg').textContent=''},500)};
  el('prevBtn').onclick=prevVideo;el('nextBtn').onclick=nextVideo;el('playPauseBtn').onclick=togglePlay;el('fullscreenBtn').onclick=fullscreen;el('favoriteBtn').onclick=toggleFavorite;
  el('focusBtn').onclick=function(){if(kidMode){requireParent(function(){setKidMode(false)})}else setKidMode(true)};
  el('autoplayToggle').onchange=function(){settings.autoNext=this.checked;save()};el('kidLockToggle').onchange=function(){settings.kidLock=this.checked;save()};
  el('savePinBtn').onclick=function(){var p=String(el('newPinInput').value||'').trim();if(!/^\d{4,6}$/.test(p)){alert('請設定 4～6 位數字 PIN');return}settings.parentPin=p;el('newPinInput').value='';save();renderSettings();alert('家長 PIN 已設定')};
  document.querySelector('.timer-options').onclick=function(e){var b=e.target.closest?e.target.closest('[data-minutes]'):null;if(!b)return;startTimer(parseInt(b.getAttribute('data-minutes'),10)||0)};
  el('timerBadge').onclick=function(){requireParent(function(){openModal('settingsModal')})};
  el('timeUpOk').onclick=function(){closeModal('timeUpModal');showView('home')};
  el('exportBtn').onclick=function(){var blob=new Blob([JSON.stringify({version:'1.1',videos:videos},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='familytube-library-v1.1.json';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)};
  el('importBtn').onclick=function(){el('importFile').click()};el('importFile').onchange=function(){var f=this.files&&this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var data=JSON.parse(r.result);if(!data.videos||!Array.isArray(data.videos))throw new Error('bad');videos=data.videos;save();render();alert('匯入完成')}catch(e){alert('檔案格式不正確')}};r.readAsText(f)};
  el('resetBtn').onclick=function(){if(confirm('確定要清除這台裝置的 FamilyTube 資料嗎？')){localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(SETTINGS_KEY);localStorage.removeItem(RECENT_KEY);location.reload()}};
  window.addEventListener('keydown',function(e){if(e.key==='ArrowRight')nextVideo();if(e.key==='ArrowLeft')prevVideo();if(e.key===' '&&document.activeElement.tagName!=='INPUT'){e.preventDefault();togglePlay()}});
  if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js').catch(function(){})})}
  render();showView('home');
})();
