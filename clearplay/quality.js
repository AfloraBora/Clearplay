/* Pure selection logic, shared by the player and tests. No network calls. */
(()=>{
 const tiers={tiny:144,small:240,medium:360,large:480,hd720:720,hd1080:1080,hd1440:1440,hd2160:2160,hd2880:2880,hd4320:4320,highres:4320};
 const defaults=()=>({enabled:true,target:'1080',bufferSeconds:0,indicator:true,sound:true});
 const clean=s=>({enabled:typeof s?.enabled==='boolean'?s.enabled:true,target:['1080','1440','2160','highest'].includes(s?.target)?s.target:'1080',bufferSeconds:[0,5,10,20].includes(s?.bufferSeconds)?s.bufferSeconds:0,indicator:typeof s?.indicator==='boolean'?s.indicator:true,sound:true});
 function choose(levels,target){const available=[...new Set(Array.isArray(levels)?levels:[])].filter(q=>tiers[q]).sort((a,b)=>tiers[a]-tiers[b]);if(!available.length)return null;if(target==='highest')return available.at(-1);return available.find(q=>tiers[q]>=Number(target))||available.at(-1);}
 function ahead(video){if(!video)return 0;for(let i=0;i<video.buffered.length;i++)if(video.buffered.start(i)<=video.currentTime+.05&&video.buffered.end(i)>video.currentTime)return Math.max(0,video.buffered.end(i)-video.currentTime);return 0;}
 const label=q=>tiers[q]?tiers[q]+'p':q==='auto'?'Auto':'Waiting';const api={tiers,defaults,clean,choose,ahead,label};globalThis.ClearplayQuality=api;if(typeof module!=='undefined')module.exports=api;
})();
