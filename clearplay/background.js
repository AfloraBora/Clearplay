importScripts('quality.js');
chrome.runtime.onInstalled.addListener(async()=>{const {settings}=await chrome.storage.local.get('settings');if(!settings)await chrome.storage.local.set({settings:ClearplayQuality.defaults()});});
chrome.runtime.onMessage.addListener((m,sender,reply)=>{
 const isUI=sender.url?.startsWith(chrome.runtime.getURL('')),isYT=sender.tab&&sender.url?.startsWith('https://www.youtube.com/');if(!isUI&&!isYT)return;
 (async()=>{
  if(m.type==='init'){const s=await chrome.storage.local.get('settings');return {settings:ClearplayQuality.clean(s.settings)};}
  if(m.type==='save'&&isUI){const settings=ClearplayQuality.clean(m.settings);await chrome.storage.local.set({settings});return {settings};}
  if(m.type==='status'&&isYT){await chrome.storage.session.set({['tab:'+sender.tab.id]:{...m.status,time:Date.now()}});return {};}
  if(m.type==='active'&&isUI){const [tab]=await chrome.tabs.query({active:true,currentWindow:true});if(!tab)return {};try{return {tabId:tab.id,status:await chrome.tabs.sendMessage(tab.id,{type:'status'})};}catch{return {};}}
  if(m.type==='bypass'&&isUI){const [tab]=await chrome.tabs.query({active:true,currentWindow:true});if(!tab)return {};try{return await chrome.tabs.sendMessage(tab.id,{type:'bypass',value:m.value===true});}catch{return {error:'Open or refresh a YouTube video first'};}}
  return {};
 })().then(reply).catch(()=>reply({error:'Could not access local settings'}));return true;
});
chrome.tabs.onRemoved.addListener(id=>chrome.storage.session.remove('tab:'+id));
