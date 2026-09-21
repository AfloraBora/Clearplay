/* Uses YouTube's ordinary quality menu, never reloads or reconstructs video. */
(()=>{
 const visible=n=>!!n&&n.getClientRects().length>0&&getComputedStyle(n).visibility!=='hidden';
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 async function select(player,target,valid=()=>true){
  const settings=player.querySelector('.ytp-settings-button');if(!settings)return {ok:false,reason:'missing'};
  // Do not compete with an already-open user menu.
  if(settings.getAttribute('aria-expanded')==='true')return {ok:false,reason:'busy'};
  let owned=false;
  try{
   if(!valid())return {ok:false,reason:'cancelled'};settings.click();owned=true;await sleep(100);
   const entry=[...player.querySelectorAll('.ytp-menuitem')].find(n=>visible(n)&&/^Quality$/i.test((n.querySelector('.ytp-menuitem-label')?.textContent||n.textContent.replace(/(?:Auto|\d{3,4}p).*$/i,'')).trim()));
   if(!entry)return {ok:false,reason:'missing'};if(!valid())return {ok:false,reason:'cancelled'};entry.click();await sleep(100);
   const rows=[...player.querySelectorAll('[role="menuitemradio"]')].filter(visible);
   const choices=rows.map(n=>({n,height:Number(n.textContent.match(/(\d{3,4})p/)?.[1])})).filter(x=>x.height&&!/premium/i.test(x.n.textContent)).sort((a,b)=>a.height-b.height);
   const chosen=target==='auto'?rows.find(n=>/^Auto\b/i.test(n.textContent.trim())):target==='highest'?choices.at(-1)?.n:(choices.find(x=>x.height>=Number(target))||choices.at(-1))?.n;
   if(!chosen)return {ok:false,reason:'missing'};if(!valid())return {ok:false,reason:'cancelled'};
   const height=Number(chosen.textContent.match(/(\d{3,4})p/)?.[1])||0;
   if(chosen.getAttribute('aria-checked')!=='true')chosen.click();
   return {ok:true,height};
  }finally{if(owned&&settings.getAttribute('aria-expanded')==='true')settings.click();}
 }
 globalThis.ClearplayMenu={select};
})();
