(()=>{'use strict';
const $=id=>document.getElementById(id), modal=$('ktvLyricStudio');if(!modal)return;
const nodes=[['ktvPlayerStage','ktvLyricStudioStageSlot'],['ktvTimelineEditor','ktvLyricStudioTimelineSlot'],['ktvLineEditor','ktvLyricStudioLineSlot']];const homes=new Map();let previousFocus=null;let updater=null;
function updateTimeline(){
 const engine=window.ktvLyricsEngine;if(!engine?.getTimelineState)return;
 const data=engine.getTimelineState(),state=$('ktvStudioSyncStatus'),current=$('ktvStudioCurrentLine'),next=$('ktvStudioNextLine'),playhead=$('ktvStudioPlayhead');
 if(state)state.textContent=data.reliable?'● 同步中 · '+format(data.now):'○ 未取得可靠播放時間';
 if(current)current.textContent=data.active?.text|| (data.items.length?'等待第一句歌詞…':'尚未載入同步歌詞');
 if(next)next.textContent=data.next?'下一句：'+data.next.text:'下一句：—';
 if(playhead){const track=$('ktvTimelineTrack');const ruler=$('ktvTimelineRuler');const scale=Number($('ktvTimelineScale')?.value)||6;const px=150/scale;
   if(!ruler)return;
   if(data.reliable&&track){track.appendChild(playhead);playhead.hidden=false;playhead.style.left=Math.max(0,data.now*px)+'px';
     if(ruler.dataset.follow==='true'){const scroll=$('ktvTimelineScroll');const target=Math.max(0,data.now*px-scroll.clientWidth/2);if(Math.abs(scroll.scrollLeft-target)>scroll.clientWidth*.33)scroll.scrollLeft=target;}
   }else playhead.hidden=true;
   ruler.replaceChildren();const maxTime=Math.max(60,...data.items.map(item=>item.time+5));let last=-1;
   data.items.forEach((item,i)=>{const index=i===0||i===data.items.length-1||item.time-last>=30;if(!index)return;last=item.time;const tag=document.createElement('span');tag.className='ktv-studio-segment';tag.style.left=(item.time/maxTime*100)+'%';tag.textContent='♫ '+format(item.time);tag.title=item.text;tag.setAttribute('aria-label','歌詞段落 '+format(item.time));ruler.append(tag)});
 }
}
function format(s){return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')}

function open(){if(!modal.hidden)return;const stop=$('simpleStop');if(stop&&!stop.disabled){alert('請先停止錄影，再進入字幕編輯工作室。');return}previousFocus=document.activeElement;
for(const [id,slotId] of nodes){const el=$(id);if(!el)continue;const marker=document.createComment('restore '+id);el.parentNode.insertBefore(marker,el);homes.set(id,marker);$(slotId).appendChild(el)}
modal.hidden=false;document.body.classList.add('ktv-lyric-workspace-active');$('ktvLyricStudioClose').focus();window.dispatchEvent(new Event('resize'));updateTimeline();updater=setInterval(updateTimeline,300)}
function close(){if(modal.hidden)return;clearInterval(updater);updater=null;for(const [id] of nodes){const el=$(id),marker=homes.get(id);if(el&&marker?.parentNode){marker.parentNode.insertBefore(el,marker);marker.remove()}}homes.clear();modal.hidden=true;document.body.classList.remove('ktv-lyric-workspace-active');previousFocus?.focus?.();window.dispatchEvent(new Event('resize'))}
$('ktvOpenLyricStudio')?.addEventListener('click',open);$('ktvOpenLyricStudioSettings')?.addEventListener('click',open);$('ktvLyricStudioClose')?.addEventListener('click',close);
document.addEventListener('keydown',e=>{if(!modal.hidden&&e.key==='Escape'){e.preventDefault();close()}if(!modal.hidden&&e.key==='Tab'){const a=[...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(el=>el.getClientRects().length);if(!a.length)return;const i=a.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();a[a.length-1].focus()}else if(!e.shiftKey&&i===a.length-1){e.preventDefault();a[0].focus()}}});
$('ktvStudioFollow')?.addEventListener('change',e=>{$('ktvTimelineRuler').dataset.follow=String(e.target.checked)});
window.ktvLyricWorkspace={open,close};
})();