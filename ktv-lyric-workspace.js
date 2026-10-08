(()=>{'use strict';
const $=id=>document.getElementById(id), modal=$('ktvLyricStudio');if(!modal)return;
const nodes=[['ktvPlayerStage','ktvLyricStudioStageSlot'],['ktvTimelineEditor','ktvLyricStudioTimelineSlot'],['ktvLineEditor','ktvLyricStudioLineSlot']];const homes=new Map();let previousFocus=null;
function open(){if(!modal.hidden)return;const stop=$('ktvQuickStop');if(stop&&!stop.disabled){alert('請先停止錄影，再進入字幕編輯工作室。');return}previousFocus=document.activeElement;
for(const [id,slotId] of nodes){const el=$(id);if(!el)continue;const marker=document.createComment('restore '+id);el.parentNode.insertBefore(marker,el);homes.set(id,marker);$(slotId).appendChild(el)}
modal.hidden=false;document.body.classList.add('ktv-lyric-workspace-active');$('ktvLyricStudioClose').focus();window.dispatchEvent(new Event('resize'))}
function close(){if(modal.hidden)return;for(const [id] of nodes){const el=$(id),marker=homes.get(id);if(el&&marker?.parentNode){marker.parentNode.insertBefore(el,marker);marker.remove()}}homes.clear();modal.hidden=true;document.body.classList.remove('ktv-lyric-workspace-active');previousFocus?.focus?.();window.dispatchEvent(new Event('resize'))}
$('ktvOpenLyricStudio')?.addEventListener('click',open);$('ktvOpenLyricStudioSettings')?.addEventListener('click',open);$('ktvLyricStudioClose')?.addEventListener('click',close);
document.addEventListener('keydown',e=>{if(!modal.hidden&&e.key==='Escape'){e.preventDefault();close()}if(!modal.hidden&&e.key==='Tab'){const a=[...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(el=>el.getClientRects().length);if(!a.length)return;const i=a.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();a[a.length-1].focus()}else if(!e.shiftKey&&i===a.length-1){e.preventDefault();a[0].focus()}}});
window.ktvLyricWorkspace={open,close};
})();