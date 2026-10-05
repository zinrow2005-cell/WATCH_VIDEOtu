
var LEGACY_IPAD=true,SEARCH_PARALLEL_LIMIT=2;
function batched(tasks){
 return new Promise(function(resolve,reject){
  var index=0,active=0,done=false,failed=0,total=tasks.length;
  var timer=setTimeout(function(){if(done)return;done=true;reject(new Error('timeout'))},400);
  function launchNext(){
   if(done)return;
   while(active<SEARCH_PARALLEL_LIMIT && index<total){
    var task=tasks[index++]; active++;
    (function(fn){
     fn().then(function(res){
      if(done)return;done=true;clearTimeout(timer);resolve(res);
     },function(){
      active--;failed++;
      if(failed>=total){done=true;clearTimeout(timer);reject(new Error('all failed'));return;}
      setTimeout(launchNext,5);
     });
    })(task);
   }
  }
  launchNext();
 });
}
function ok(ms,v){return function(){return new Promise(function(r){setTimeout(function(){r(v)},ms)})}}
function bad(ms){return function(){return new Promise(function(_,j){setTimeout(function(){j(new Error('x'))},ms)})}}
(async function(){
 var pass=0;
 for(var i=0;i<15;i++){
  var r=await batched([bad(5),bad(8),ok(12,{n:i}),bad(20)]);
  if(r.n===i)pass++;
 }
 for(var j=0;j<5;j++){
  try{await batched([bad(5),bad(8),bad(10)])}
  catch(e){if(e.message==='all failed')pass++}
 }
 console.log('passed='+pass+'/20');
 if(pass!==20)process.exit(2);
})();
