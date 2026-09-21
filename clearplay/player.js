/* Quality changes go through the existing YouTube menu. Status polling is read-only. */
(()=>{
 if(window.__clearplayLoaded)return;window.__clearplayLoaded=true;
 const Q=globalThis.ClearplayQuality,channel='clearplay-v1';
 let settings=Q.defaults(),configured=false,currentId='',currentPlayer=null,bypass=false,generation=0,appliedKey='',inFlight=false,retryAt=0,attempts=0,selectedHeight=0,problem='',lastStatus='',ownedVideo=null,holdStarted=0,bufferDone=false,bufferTimedOut=false;
 const emit=data=>{const key=JSON.stringify(data);if(key!==lastStatus){lastStatus=key;window.postMessage({channel,direction:'out',type:'status',...data},location.origin);}};
 function release(resume=false){const v=ownedVideo;ownedVideo=null;holdStarted=0;if(resume&&v?.paused)v.play().catch(()=>{});}
 function invalidate(){generation++;appliedKey='';attempts=0;retryAt=0;problem='';selectedHeight=0;}
 function report(v,state,message){const height=v?.videoHeight||0;emit({state,message,enabled:settings.enabled,bypass,preferred:settings.target,target:selectedHeight?selectedHeight+'p':'',actual:height?height+'p':'Waiting',decoded:height?`${v.videoWidth}×${height}`:'',bufferSeconds:Math.floor(Q.ahead(v))});}
 function tick(){
  if(!configured)return;const p=document.getElementById('movie_player'),id=location.pathname==='/watch'?new URL(location.href).searchParams.get('v'):null;
  if(!p||!id){release(false);report(null,'idle','Open a YouTube watch page');return;}
  if(id!==currentId){release(false);currentId=id;currentPlayer=p;bypass=false;bufferDone=false;bufferTimedOut=false;invalidate();}
  else if(p!==currentPlayer){release(false);currentPlayer=p;invalidate();}
  const v=p.querySelector('video');if(!v)return;
  if(p.classList.contains('ad-showing')||p.classList.contains('ad-interrupting')){release(false);report(v,'ad','Waiting for the main video');return;}
  const target=!settings.enabled||bypass?'auto':settings.target,key=currentId+'|'+target;
  // Off on initial load leaves YouTube alone. Auto is requested only to release
  // a lock previously requested by this page, not on each polling tick.
  if(target==='auto'&&!appliedKey&&attempts===0&&!problem){appliedKey=key;}
  if(appliedKey!==key&&!inFlight&&Date.now()>=retryAt&&attempts<3){
   const token=generation;inFlight=true;attempts++;retryAt=Date.now()+4000;
   ClearplayMenu.select(p,target,()=>token===generation&&p===currentPlayer&&location.pathname==='/watch'&&new URL(location.href).searchParams.get('v')===currentId).then(result=>{
    if(token!==generation)return;
    if(result.ok){appliedKey=key;selectedHeight=result.height;problem='';}
    else{problem=result.reason==='busy'?'Close YouTube’s settings menu to apply quality':'Could not select quality. Use YouTube’s Quality menu.';if(result.reason==='busy'){attempts--;retryAt=Date.now()+1500;}}
   }).catch(()=>{if(token===generation)problem='Could not select quality. Use YouTube’s Quality menu.';}).finally(()=>{inFlight=false;});
  }
  if(target==='auto'){release(true);report(v,'paused',bypass?'YouTube chooses for this video':'Quality lock is off');return;}
  if(problem&&!inFlight){report(v,'error',problem);return;}
  if(appliedKey!==key){report(v,'switching','Selecting your preferred quality');return;}
  const live=!Number.isFinite(v.duration)||p.querySelector('.ytp-live-badge')?.getAttribute('disabled')===null&&p.querySelector('.ytp-live-badge')?.offsetParent!==null;
  if(settings.bufferSeconds&&!bufferDone&&!ownedVideo&&!live&&!v.paused&&v.readyState>=2&&v.videoHeight>=selectedHeight){ownedVideo=v;holdStarted=Date.now();v.pause();}
  if(ownedVideo){const need=Math.min(settings.bufferSeconds,Math.max(0,v.duration-v.currentTime-.2));if(Q.ahead(v)>=need){bufferDone=true;release(true);}else if(Date.now()-holdStarted>=30000){bufferDone=true;bufferTimedOut=true;release(false);}else{report(v,'buffering','Buffering before playback');return;}}
  if(bufferTimedOut&&v.paused){report(v,'buffer-timeout','Press Play to continue');return;}if(!v.paused)bufferTimedOut=false;
  const limited=settings.target!=='highest'&&selectedHeight<Number(settings.target),reached=v.videoHeight>=selectedHeight&&selectedHeight>0;
  report(v,reached?(limited?'limited':'locked'):'waiting',reached?`${v.videoHeight}p playing`:`Waiting for ${selectedHeight}p; currently ${v.videoHeight||0}p`);
 }
 window.addEventListener('message',e=>{const m=e.data;if(e.source!==window||e.origin!==location.origin||m?.channel!==channel||m.direction!=='in')return;
  if(m.type==='settings'){const next=Q.clean(m.settings),qualityChanged=next.enabled!==settings.enabled||next.target!==settings.target,wasConfigured=configured,previous=appliedKey;settings=next;if(qualityChanged){invalidate();if(wasConfigured&&!next.enabled){appliedKey=previous||'release';problem='release';}bufferDone=true;release(true);}if(!settings.bufferSeconds)release(true);configured=true;tick();}
  if(m.type==='bypass'){const next=m.value===true;if(next!==bypass){bypass=next;invalidate();appliedKey='transition';bufferDone=true;bufferTimedOut=false;release(true);}tick();}
  if(m.type==='status')tick();
 });
 function manual(e){if(!e.isTrusted)return;if((e.type==='keydown'&&[' ','k','K','MediaPlayPause'].includes(e.key))||(e.type==='pointerdown'&&e.target.closest?.('#movie_player'))){if(ownedVideo){release(false);bufferDone=true;}}}
 document.addEventListener('pointerdown',manual,true);document.addEventListener('keydown',manual,true);
 document.addEventListener('yt-navigate-start',()=>{release(false);generation++;});document.addEventListener('yt-navigate-finish',tick);setInterval(tick,1500);
})();
