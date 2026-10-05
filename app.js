(function(){
  'use strict';
  var STORAGE_KEY='familytube_v1_library';
  var SETTINGS_KEY='familytube_v1_settings';
  var DEFAULT_VIDEOS=[{id:'M7lc1UVf-VE',title:'YouTube 播放測試影片',category:'測試',addedAt:Date.now()}];
  var videos=loadJSON(STORAGE_KEY,DEFAULT_VIDEOS);
  var settings=loadJSON(SETTINGS_KEY,{autoNext:true,kidLock:true});
  var activeCategory='全部', currentIndex=-1, player=null, playerReady=false;
  var pageOrigin=(location.protocol==='http:'||location.protocol==='https:')?(location.protocol+'//'+location.host):'';

  function el(id){return document.getElementById(id)}
  function loadJSON(key,fallback){try{var raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback.slice?fallback.slice():fallback}catch(e){return fallback.slice?fallback.slice():fallback}}
  function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(videos));localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
  function escapeHTML(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function youtubeId(url){
    var m=String(url||'').trim().match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
    if(m)return m[1];
    if(/^[A-Za-z0-9_-]{11}$/.test(String(url||'').trim()))return String(url).trim();
    return '';
  }
  function categories(){var out=['全部'];for(var i=0;i<videos.length;i++){var c=videos[i].category||'其他';if(out.indexOf(c)===-1)out.push(c)}return out}
  function renderCategories(){
    var html='',cats=categories();
    for(var i=0;i<cats.length;i++)html+='<button type="button" class="category-chip '+(cats[i]===activeCategory?'active':'')+'" data-cat="'+escapeHTML(cats[i])+'">'+escapeHTML(cats[i])+'</button>';
    el('categoryBar').innerHTML=html;
  }
  function visibleVideos(){var arr=[];for(var i=0;i<videos.length;i++)if(activeCategory==='全部'||(videos[i].category||'其他')===activeCategory)arr.push({v:videos[i],index:i});return arr}
  function renderList(){
    var items=visibleVideos(),html='';
    if(!items.length){el('videoList').innerHTML='<div class="empty-player" style="position:static;min-height:220px;border-radius:16px"><div><h2>這個分類還沒有影片</h2><p>請到家長設定新增。</p></div></div>';return}
    for(var i=0;i<items.length;i++){
      var v=items[i].v,idx=items[i].index;
      html+='<article class="video-card '+(idx===currentIndex?'active':'')+'" data-index="'+idx+'">'+
        '<img class="thumb" loading="lazy" src="https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg" alt="">'+
        '<div><span class="eyebrow">'+escapeHTML(v.category||'其他')+'</span><h3>'+escapeHTML(v.title||'未命名影片')+'</h3><p>YouTube</p>'+
        '<div class="card-actions parent-only"><button type="button" class="delete-btn" data-delete="'+idx+'">刪除</button></div></div></article>';
    }
    el('videoList').innerHTML=html;
  }
  function render(){renderCategories();renderList();el('autoplayToggle').checked=!!settings.autoNext;el('kidLockToggle').checked=!!settings.kidLock}

  function showPlayerError(code){
    var box=el('playerError'),title=el('playerErrorTitle'),text=el('playerErrorText');
    if(!box)return;
    title.textContent='影片無法播放';
    if(code===153){
      title.textContent='YouTube 錯誤 153';
      if(location.protocol==='file:') text.textContent='這個版本不能直接從「檔案」開啟播放。請把整個資料夾放到 GitHub Pages 後，用 https 網址開啟。';
      else text.textContent='YouTube 沒有收到網站來源識別。請確認目前是用正常 https 網址開啟，並重新整理頁面。';
    }else if(code===101||code===150){text.textContent='這部影片的上傳者禁止在其他網站嵌入播放。請改選其他影片。';}
    else if(code===100){text.textContent='影片不存在、已刪除或設為私人。';}
    else{text.textContent='YouTube 回報播放器錯誤：'+code;}
    box.classList.remove('hidden');
  }
  function hidePlayerError(){var box=el('playerError');if(box)box.classList.add('hidden')}
  window.onYouTubeIframeAPIReady=function(){
    var vars={playsinline:1,rel:0,controls:1,fs:1,iv_load_policy:3};
    if(pageOrigin) vars.origin=pageOrigin;
    player=new YT.Player('player',{width:'100%',height:'100%',videoId:'',playerVars:vars,events:{onReady:function(){playerReady=true},onStateChange:function(e){if(e.data===YT.PlayerState.PLAYING)hidePlayerError();if(e.data===YT.PlayerState.ENDED&&settings.autoNext)nextVideo()},onError:function(e){showPlayerError(e.data)}}});
  };
  function playIndex(idx){
    if(idx<0||idx>=videos.length)return;
    if(location.protocol==='file:'){showPlayerError(153);return;}
    hidePlayerError();
    currentIndex=idx;var v=videos[idx];el('emptyPlayer').classList.add('hidden');el('nowTitle').textContent=v.title||'未命名影片';el('nowMeta').textContent=(v.category||'其他')+' · YouTube';renderList();
    if(playerReady&&player&&player.loadVideoById)player.loadVideoById(v.id);else setTimeout(function(){if(playerReady&&player)player.loadVideoById(v.id)},700);
  }
  function nextVideo(){if(!videos.length)return;playIndex(currentIndex<0?0:(currentIndex+1)%videos.length)}
  function prevVideo(){if(!videos.length)return;playIndex(currentIndex<0?0:(currentIndex-1+videos.length)%videos.length)}
  function togglePlay(){if(!playerReady||!player)return;var s=player.getPlayerState();if(s===YT.PlayerState.PLAYING)player.pauseVideo();else player.playVideo()}
  function fullscreen(){var frame=el('videoFrame');var req=frame.requestFullscreen||frame.webkitRequestFullscreen||frame.webkitEnterFullscreen;if(req){try{req.call(frame)}catch(e){var iframe=frame.querySelector('iframe');if(iframe&&iframe.webkitEnterFullscreen)iframe.webkitEnterFullscreen()}}}
  function openModal(id){el(id).classList.remove('hidden');el(id).setAttribute('aria-hidden','false')}
  function closeModal(id){el(id).classList.add('hidden');el(id).setAttribute('aria-hidden','true')}
  function setKidMode(on){document.body.classList.toggle('kid-mode',on);el('focusBtn').textContent=on?'離開兒童模式':'兒童模式'}

  el('categoryBar').onclick=function(e){var b=e.target.closest?e.target.closest('[data-cat]'):null;if(!b)return;activeCategory=b.getAttribute('data-cat');render()};
  el('videoList').onclick=function(e){var d=e.target.getAttribute&&e.target.getAttribute('data-delete');if(d!==null){e.stopPropagation();var idx=parseInt(d,10);if(confirm('要從這台裝置刪除這部影片嗎？')){videos.splice(idx,1);if(currentIndex===idx)currentIndex=-1;else if(currentIndex>idx)currentIndex--;save();render()}return}var card=e.target.closest?e.target.closest('.video-card'):null;if(card)playIndex(parseInt(card.getAttribute('data-index'),10))};
  el('addBtn').onclick=function(){openModal('parentModal');setTimeout(function(){el('urlInput').focus()},100)};
  el('closeModal').onclick=function(){closeModal('parentModal')};
  el('parentBtn').onclick=function(){openModal('settingsModal')};
  el('closeSettings').onclick=function(){closeModal('settingsModal')};
  el('saveVideoBtn').onclick=function(){var id=youtubeId(el('urlInput').value);if(!id){el('formMsg').textContent='網址格式無法辨識，請貼一般 YouTube、youtu.be 或 Shorts 網址。';return}var title=el('titleInput').value.trim()||'新影片';var cat=el('categoryInput').value.trim()||'其他';videos.push({id:id,title:title,category:cat,addedAt:Date.now()});save();el('urlInput').value='';el('titleInput').value='';el('categoryInput').value='';el('formMsg').textContent='已加入影片庫。';activeCategory='全部';render();setTimeout(function(){closeModal('parentModal');el('formMsg').textContent=''},500)};
  el('prevBtn').onclick=prevVideo;el('nextBtn').onclick=nextVideo;el('playPauseBtn').onclick=togglePlay;el('fullscreenBtn').onclick=fullscreen;
  el('focusBtn').onclick=function(){setKidMode(!document.body.classList.contains('kid-mode'))};
  el('autoplayToggle').onchange=function(){settings.autoNext=this.checked;save()};el('kidLockToggle').onchange=function(){settings.kidLock=this.checked;save()};
  el('exportBtn').onclick=function(){var blob=new Blob([JSON.stringify({version:1,videos:videos},null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='familytube-library.json';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)};
  el('importBtn').onclick=function(){el('importFile').click()};
  el('importFile').onchange=function(){var f=this.files&&this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var data=JSON.parse(r.result);if(!data.videos||!Array.isArray(data.videos))throw new Error('bad');videos=data.videos;save();render();alert('匯入完成')}catch(e){alert('檔案格式不正確')}};r.readAsText(f)};
  el('resetBtn').onclick=function(){if(confirm('確定要清除這台裝置的 FamilyTube 資料嗎？')){localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(SETTINGS_KEY);location.reload()}};
  window.addEventListener('keydown',function(e){if(e.key==='ArrowRight')nextVideo();if(e.key==='ArrowLeft')prevVideo();if(e.key===' '){e.preventDefault();togglePlay()}});
  if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js').catch(function(){})})}
  render();
})();
