'use strict';
let spotifyAPI=null,spotifyPromise=null;
function loadSpotify(){
 if(spotifyAPI)return Promise.resolve(spotifyAPI);
 if(spotifyPromise)return spotifyPromise;
 spotifyPromise=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://open.spotify.com/embed/iframe-api/v1';
  const fail=()=>{spotifyPromise=null;script.remove();reject(Error('Spotify unavailable'))};
  const timeout=setTimeout(fail,15000);
  script.onerror=()=>{clearTimeout(timeout);fail()};
  window.onSpotifyIframeApiReady=api=>{clearTimeout(timeout);spotifyAPI=api;resolve(api)};
  document.head.append(script);
 });return spotifyPromise;
}
async function ensureSpotify(t,generation){
 let controller,dead=false,playTimer,readyTimer;
 const live=()=>!dead&&generation===playerGeneration;
 try{
  const api=await loadSpotify();if(!live())return;
  const mount=element('div');$('#player').replaceChildren(mount);
  let position=0,duration=0,started=false,reportedEnd=false;
  readyTimer=setTimeout(()=>{if(live()&&!playerIsReady){pendingPlay=false;playback('loadfail');playerTrack=null}},15000);
  api.createController(mount,{uri:'spotify:track:'+t.media.id,width:'100%',height:352},c=>{
   controller=c;if(!live()){c.destroy();return}
   const requestPlay=()=>{pendingPlay=true;playback('preparing');c.resume();clearTimeout(playTimer);playTimer=setTimeout(()=>{if(live()&&pendingPlay&&!isPlaying){pendingPlay=false;playback('blocked')}},8000)};
   ytPlayer={playVideo:requestPlay,pauseVideo:()=>{clearTimeout(playTimer);pendingPlay=false;c.pause()},seekTo:n=>{if(n===0){reportedEnd=false;c.restart()}},getCurrentTime:()=>position/1000,getDuration:()=>duration/1000,destroy:()=>{dead=true;clearTimeout(playTimer);clearTimeout(readyTimer);c.destroy()}};
   c.addListener('ready',()=>{if(!live())return;clearTimeout(readyTimer);playerIsReady=true;const iframe=$('#player iframe');if(iframe)iframe.title=t.title+' — Spotify';if(pendingPlay)requestPlay();else playback('ready')});
   c.addListener('playback_started',()=>{if(!live())return;started=true;reportedEnd=false;pendingPlay=false;clearTimeout(playTimer);playback('playing')});
   c.addListener('playback_update',e=>{if(!live())return;const d=e.data||{};position=Math.max(0,Number(d.position)||0);duration=Math.max(0,Number(d.duration)||0);
    if(started&&duration>0&&position>=duration-50){if(!reportedEnd){reportedEnd=true;pendingPlay=false;clearTimeout(playTimer);playback('ended');window.SonoraMemories?.ended()}return}
    if(!d.isPaused&&!d.isBuffering){started=true;pendingPlay=false;clearTimeout(playTimer);reportedEnd=false;playback('playing')}
    else if(d.isBuffering)playback('buffering');
    else if(!pendingPlay){playback(started?'paused':'ready')}
   });
  });
 }catch{clearTimeout(readyTimer);if(live()){pendingPlay=false;playerTrack=null;playback('loadfail')}}
}
