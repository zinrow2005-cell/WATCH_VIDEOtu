
function firstSuccessful(promises,timeoutMs){
 return new Promise(function(resolve,reject){
  var settled=false,failed=0,total=promises.length;
  var timer=setTimeout(function(){
   if(settled)return;
   settled=true;
   reject(new Error('搜尋來源逾時'));
  },timeoutMs);
  promises.forEach(function(p){
   p.then(function(v){
    if(settled)return;
    settled=true;
    clearTimeout(timer);
    resolve(v);
   },function(){
    failed++;
    if(!settled&&failed>=total){
     settled=true;
     clearTimeout(timer);
     reject(new Error('所有搜尋來源都沒有回應'));
    }
   });
  });
 });
}
function ok(ms,v){return new Promise(r=>setTimeout(()=>r(v),ms))}
function bad(ms){return new Promise((_,j)=>setTimeout(()=>j(new Error('x')),ms))}
(async()=>{
 let passed=0;
 for(let i=0;i<10;i++){
  let r=await firstSuccessful([bad(15),ok(20+i,{x:i}),bad(30)],100);
  if(r.x===i)passed++;
 }
 for(let i=0;i<5;i++){
  try{await firstSuccessful([bad(5),bad(10),bad(15)],50)}
  catch(e){if(/所有搜尋來源/.test(e.message))passed++}
 }
 console.log('passed='+passed+'/15');
 if(passed!==15)process.exit(2);
})();
