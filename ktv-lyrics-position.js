(()=>{'use strict';
const bar=document.getElementById('ktvLyricsSyncBar');
const stage=document.getElementById('ktvPlayerStage');
const handle=document.getElementById('ktvLyricsSyncDrag');
if(!bar||!stage||!handle)return;
const KEY='ktv-lyric-toolbar-position-v1';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
let position=null,active=null;
try{let saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&Number.isFinite(saved.x)&&Number.isFinite(saved.y))position={x:clamp(saved.x,0,1),y:clamp(saved.y,0,1)}}catch(_){}
function apply(){if(!position)return;const rect=stage.getBoundingClientRect();if(!rect.width||!rect.height)return;
bar.classList.add('ktv-lyrics-positioned');
const maxX=Math.max(0,rect.width-bar.offsetWidth),maxY=Math.max(0,rect.height-bar.offsetHeight);
bar.style.left=Math.round(maxX*position.x)+'px';bar.style.top=Math.round(maxY*position.y)+'px';}
function start(e){if(active||e.pointerType==='mouse'&&e.button!==0)return;
const stageRect=stage.getBoundingClientRect(),r=bar.getBoundingClientRect();
if(!stageRect.width||!stageRect.height)return;
e.preventDefault();e.stopPropagation();
active={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left-stageRect.left,top:r.top-stageRect.top};
handle.classList.add('ktv-dragging');handle.setPointerCapture(e.pointerId);
bar.classList.add('ktv-lyrics-positioned');bar.style.left=active.left+'px';bar.style.top=active.top+'px';}
function move(e){if(!active||e.pointerId!==active.id)return;e.preventDefault();
const r=stage.getBoundingClientRect(),mx=Math.max(0,r.width-bar.offsetWidth),my=Math.max(0,r.height-bar.offsetHeight);
const l=clamp(active.left+e.clientX-active.x,0,mx),t=clamp(active.top+e.clientY-active.y,0,my);
position={x:mx?l/mx:0,y:my?t/my:0};bar.style.left=l+'px';bar.style.top=t+'px';}
function end(e){if(!active||e.pointerId!==active.id)return;move(e);active=null;handle.classList.remove('ktv-dragging');
try{localStorage.setItem(KEY,JSON.stringify(position))}catch(_){} }
handle.addEventListener('pointerdown',start);handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',end);
handle.addEventListener('pointercancel',end);
handle.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();e.stopPropagation();const r=stage.getBoundingClientRect();if(!position)position={x:.5,y:.88};
const maxX=Math.max(1,r.width-bar.offsetWidth),maxY=Math.max(1,r.height-bar.offsetHeight),step=e.shiftKey?30:10;
if(e.key==='ArrowLeft')position.x=clamp(position.x-step/maxX,0,1);
if(e.key==='ArrowRight')position.x=clamp(position.x+step/maxX,0,1);
if(e.key==='ArrowUp')position.y=clamp(position.y-step/maxY,0,1);
if(e.key==='ArrowDown')position.y=clamp(position.y+step/maxY,0,1);
apply();try{localStorage.setItem(KEY,JSON.stringify(position))}catch(_){} });
if(position)requestAnimationFrame(apply);
window.addEventListener('resize',()=>requestAnimationFrame(apply));
if(typeof ResizeObserver!=='undefined'){new ResizeObserver(()=>requestAnimationFrame(apply)).observe(stage);}
})();
