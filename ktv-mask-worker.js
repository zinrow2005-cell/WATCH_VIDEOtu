// KTV v1.5.7.22: run expensive alpha refinement away from the UI / recorder thread.
self.onmessage = event => {
 const {id,width:w,height:h,buffer,tune}=event.data;
 try {
  const px=new Uint8ClampedArray(buffer),cutoutTune=tune;
 for(let i=0;i<px.length;i+=4){const m=px[i]/255;const threshold=.29+cutoutTune.residue*.0017-cutoutTune.detail*.0009;const width=.52-cutoutTune.feather*.0018+cutoutTune.detail*.0005;const t=Math.max(0,Math.min(1,(m-threshold)/Math.max(.18,width)));const a=t*t*(3-2*t);px[i]=px[i+1]=px[i+2]=255;px[i+3]=Math.round(a*255)}
 // Remove disconnected segmentation islands (background furniture, tiny ghost figures).
 // Analyze a reduced mask so the camera loop stays responsive on desktop/mobile.
 const cell=4, gw=Math.ceil(w/cell), gh=Math.ceil(h/cell), occupancy=new Uint8Array(gw*gh);
 for(let gy=0;gy<gh;gy++)for(let gx=0;gx<gw;gx++){
   const xx=Math.min(w-1,gx*cell+2),yy=Math.min(h-1,gy*cell+2);
   occupancy[gy*gw+gx]=px[(yy*w+xx)*4+3]>(95+Math.round(cutoutTune.residue*.45))?1:0;
 }
 const visited=new Uint8Array(gw*gh),queue=new Int32Array(gw*gh);
 let best=[],bestSize=0,bestScore=-1;
 for(let start=0;start<occupancy.length;start++){
   if(!occupancy[start]||visited[start])continue;
   let front=0,end=1;queue[0]=start;visited[start]=1;
   while(front<end){const v=queue[front++],x=v%gw,y=(v/gw)|0;
     const neighbors=[x>0?v-1:-1,x<gw-1?v+1:-1,y>0?v-gw:-1,y<gh-1?v+gw:-1];
     for(const n of neighbors)if(n>=0&&occupancy[n]&&!visited[n]){visited[n]=1;queue[end++]=n;}
   }
   // Prefer the sizeable connected shape nearest the image centre/lower torso.
   // This avoids selecting a large stray background component at an edge.
   let sx=0,sy=0;for(let q=0;q<end;q++){const k=queue[q];sx+=k%gw;sy+=(k/gw)|0;}
   const cx=sx/end/gw,cy=sy/end/gh;
   const d=Math.hypot((cx-.5)*1.35,(cy-.61)*.85);
   const score=end*(1-.60*Math.min(1,d));
   if(score>bestScore){bestScore=score;bestSize=end;best=Array.from(queue.subarray(0,end));}
 }
 // Skip destructive filtering if confidence is too low; retain previous valid frame instead.
 if(bestSize>Math.max(40,gw*gh*.009)){
   const kept=new Uint8Array(gw*gh);for(const v of best)kept[v]=1;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){
     const gx=(x/cell)|0,gy=(y/cell)|0,i=(y*w+x)*4;
     let isNear=false;
     for(let yy=Math.max(0,gy-1);yy<=Math.min(gh-1,gy+1)&&!isNear;yy++)
       for(let xx=Math.max(0,gx-1);xx<=Math.min(gw-1,gx+1);xx++)if(kept[yy*gw+xx]){isNear=true;break}
     if(!isNear)px[i+3]=0;
   }
 }
  self.postMessage({id,buffer},[buffer]);
 }catch(e){self.postMessage({id,error:String(e)});}
};
