(()=>{'use strict';
const $=id=>document.getElementById(id);const open=$('simpleLyricsOpen'),panel=$('simpleLyricsPanel'),view=$('simpleLyricsText'),hint=$('simpleLyricsStatus'),input=$('simpleLyricsInput');if(!open||!panel)return;
const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<1100);
open.hidden=!mobile;if(!mobile)return;
let song={title:'',artist:''},epoch=0;
const normalize=s=>(s||'').replace(/\s*[（(][^）)]*(?:KTV|伴奏|官方|MV|字幕|karaoke|live)[^）)]*[）)]/ig,'').replace(/\s*[-–—|]\s*(?:KTV|官方MV|伴奏|字幕).*$/ig,'').trim();
const stripLRC=text=>(text||'').replace(/^\[(?:\d{1,3}:\d{2}(?:\.\d+)?|\w+:[^\]]*)\]\s*/gm,'').trim();
function show(text){view.textContent=stripLRC(text)||'目前沒有可顯示的歌詞。';view.scrollTop=0;}
window.addEventListener('ktv-recording-review-open',e=>{song={title:normalize(e.detail?.title||''),artist:normalize(e.detail?.artist||'')};panel.hidden=true;input.hidden=true;$('simpleLyricsApply').hidden=true;view.textContent='尚未取得歌詞，請按「搜尋這首歌的歌詞」。';hint.textContent=song.title?`正在自動搜尋：${song.artist} ${song.title}`:'無法識別歌曲名稱，請貼上歌詞。';if(song.title)searchLyrics();});
open.onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden){view.scrollTop=0;panel.scrollIntoView({block:'nearest',behavior:'smooth'});}};
$('simpleLyricsClose').onclick=()=>panel.hidden=true;
$('simpleLyricsEdit').onclick=()=>{input.hidden=!input.hidden;$('simpleLyricsApply').hidden=input.hidden;if(!input.hidden)input.focus();};
$('simpleLyricsApply').onclick=()=>{show(input.value);hint.textContent='已顯示你提供的歌詞（僅供此次預覽）';input.hidden=true;$('simpleLyricsApply').hidden=true;};
async function searchLyrics(){const title=song.title?.trim(),artist=song.artist?.trim();if(!title){hint.textContent='找不到歌曲名稱，請使用「貼上歌詞」。';return;}const token=++epoch;hint.textContent='正在搜尋歌詞…';try{const u='https://lrclib.net/api/search?'+new URLSearchParams(artist?{track_name:title,artist_name:artist}:{track_name:title});let res=await fetch(u,{headers:{Accept:'application/json'}});if(res.ok){let initial=await res.json();if(Array.isArray(initial)&&initial.length===0&&artist)res=await fetch('https://lrclib.net/api/search?'+new URLSearchParams({q:title}),{headers:{Accept:'application/json'}});else {res={ok:true,json:async()=>initial}}}if(!res.ok)throw Error('歌詞來源目前無法連線');const all=await res.json();if(token!==epoch)return;const list=Array.isArray(all)?all:[];const entry=list.find(x=>x.plainLyrics)||list.find(x=>x.syncedLyrics);if(!entry){hint.textContent='目前沒有找到歌詞，可以自行貼上。';return;}show(entry.plainLyrics||entry.syncedLyrics);hint.textContent=`已取得歌詞（${entry.trackName||title}），請自行核對歌曲版本。`; }catch(e){hint.textContent='無法取得歌詞：'+e.message+'；可自行貼上歌詞。';}}
$('simpleLyricsSearch').onclick=searchLyrics;
})();
