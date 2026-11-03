'use strict';
/* Ephemeral view and queue state; diary schema and cloud storage stay compatible. */
(()=>{
const host=$('.universe'),scene=element('div','universe-scene');
while(host.firstChild)scene.append(host.firstChild);host.append(scene);
const book=element('div','memory-book');book.innerHTML='<div class="book-leaves"></div><div class="book-cover"><span class="eyebrow">SONORA · VOL. 01</span><div class="cover-orbit"><i>✦</i><i>✧</i><i>✶</i></div><h2></h2><p></p><span class="cover-signature">A LITTLE UNIVERSE, KEPT CLOSE</span></div>';book.setAttribute('aria-hidden','true');host.append(book);
const pages=element('section','diary-pages');pages.id='diary-pages';pages.hidden=true;pages.innerHTML='<div class="diary-masthead"><span class="eyebrow">SONORA / THE MEMORY JOURNAL</span><span class="diary-volume">01</span></div><h2 id="diary-heading" tabindex="-1"></h2><p class="diary-subtitle"></p><div class="diary-toolbar"><span id="diary-count"></span><button id="play-memories" class="primary"></button></div><div id="diary-entries"></div><footer class="diary-colophon">DAEZAL × SONORA <span>✦</span></footer>';host.append(pages);
const dock=element('section','memory-dock');dock.setAttribute('aria-label','Music player');dock.innerHTML='<div class="dock-track"><button id="dock-record" class="dock-record" aria-label="Play / pause"><i>S</i></button><div><strong id="dock-title"></strong><small id="dock-artist"></small></div></div><div class="dock-transport"><div class="transport-buttons"><button id="queue-shuffle" aria-pressed="false">⤨</button><button id="queue-prev">↤</button><button id="queue-play" class="transport-play">▶</button><button id="queue-next">↦</button><button id="queue-repeat" aria-pressed="false">↻</button></div><div class="seek-row"><span id="elapsed">0:00</span><input id="memory-seek" type="range" min="0" max="1000" value="0"><span id="duration">0:00</span></div></div><div class="dock-end"><small id="dock-status" role="status"></small><button id="queue-toggle" class="ghost" aria-expanded="false" aria-controls="memory-queue"></button></div><section id="memory-queue" hidden><div class="queue-heading"><strong></strong><button id="queue-close">×</button></div><p class="queue-hint"></p><div id="queue-items"></div></section>';
dock.hidden=true;document.body.append(dock);
let mode='universe',busy=false,queue=[],position=-1,shuffled=false,repeat='off',internal=false,opened=null,endedTimer,renderedSignature='';
const word=(en,vi)=>language==='vi'?vi:en;
const ordered=()=>visible().map((t,i)=>({t,i})).sort((a,b)=>(b.t.date||'').localeCompare(a.t.date||'')||a.i-b.i).map(x=>x.t);
const titleFor=t=>t.demo?tr(t.note):t.note;
const button=(label,cls,action)=>{const b=element('button',cls,label);b.type='button';b.onclick=action;return b};
function texts(){
$('#view-toggle').innerHTML=(mode==='diary'?'Universe':'Diary')+' <span aria-hidden="true">'+(mode==='diary'?'✧':'↗')+'</span>';
$('#view-toggle').setAttribute('aria-expanded',String(mode==='diary'));
$('.book-cover h2').textContent=word('My little universe.','Vũ trụ nhỏ của tôi.');$('.book-cover p').textContent=word('Some songs become pages.','Có những bài hát hóa thành trang viết.');
$('#diary-heading').textContent=word('Days worth keeping.','Những ngày muốn giữ.');$('.diary-subtitle').textContent=word('A song, a feeling, a page of your life.','Một bài hát, một cảm xúc, một trang đời.');
$('#play-memories').textContent=word('▶ Play my memories','▶ Nghe những ký ức');
$('#diary-count').textContent=ordered().length+word(' memories · newest first',' ký ức · mới nhất trước');$('#play-memories').disabled=!ordered().length;
const labels={'queue-shuffle':word('Shuffle queue','Trộn danh sách'),'queue-prev':word('Previous memory','Ký ức trước'),'queue-next':word('Next memory','Ký ức tiếp theo'),'queue-repeat':word('Repeat: ','Lặp: ')+({off:word('off','tắt'),all:word('all','tất cả'),one:word('one','một bài')})[repeat],'memory-seek':word('Seek in current song','Tua bài đang phát'),'queue-close':word('Close queue','Đóng danh sách')};
for(const [id,label] of Object.entries(labels)){$('#'+id).setAttribute('aria-label',label);$('#'+id).title=label}
$('#queue-toggle').textContent=word('Queue','Danh sách')+' · '+queue.length;
$('.queue-heading strong').textContent=word('Your listening journey','Hành trình lắng nghe');$('.queue-hint').textContent=word('A snapshot of the memories you chose.','Danh sách những ký ức cậu đã chọn nghe.');
updateDock();
}
function render(){
queue=queue.filter(id=>state.tracks.some(t=>t.id===id));position=queue.indexOf(selected);
texts();const list=ordered(),signature=JSON.stringify([language,opened,selected,list]);
if(signature!==renderedSignature){renderedSignature=signature;const root=$('#diary-entries');root.replaceChildren();if(!list.length){const empty=element('div','diary-empty');empty.append(element('span','','✧'),element('h3','',word('A page waiting for you.','Một trang đang đợi cậu.')),element('p','',query?word('Try another search or constellation.','Thử từ khóa hoặc chòm sao khác nhé.'):word('Keep a song. Write a little. Begin here.','Giữ một bài hát. Viết vài dòng. Bắt đầu ở đây.')));empty.append(button(word('＋ Add a memory','＋ Thêm ký ức'),'ghost',()=>$('#add').click()));root.append(empty)}
list.forEach((t,i)=>{const card=element('article','diary-entry'+(selected===t.id?' current':''));card.style.setProperty('--color',t.color);card.dataset.trackColor=t.id;
const top=button('','entry-open',()=>{opened=opened===t.id?null:t.id;render();const b=[...root.querySelectorAll('.entry-open')][i];b?.focus({preventScroll:true})});top.setAttribute('aria-expanded',String(opened===t.id));const icon=element('span','entry-symbol shape-icon shape-'+shapeFor(t));const info=element('span','entry-info');info.append(element('small','',t.date?t.date.split('-').reverse().join('.') : word('UNDATED','CHƯA GHI NGÀY')),element('strong','',t.title),element('span','entry-artist',t.artist||word('A personal memory','Một ký ức riêng')));top.append(icon,info,element('span','entry-number',String(i+1).padStart(2,'0')));card.append(top);
const excerpt=element('p','entry-excerpt',titleFor(t)||word('A feeling waiting for words.','Một cảm xúc đang đợi thành lời.'));card.append(excerpt);
const bottom=element('div','entry-bottom');bottom.append(element('span','',groupName(state.groups.find(g=>g.id===t.group))),button(word('Listen ↗','Lắng nghe ↗'),'entry-listen',()=>start(t.id)));card.append(bottom);
if(opened===t.id){card.classList.add('expanded');const detail=element('div','entry-expanded');detail.append(element('span','eyebrow',word('THE MEMORY','KÝ ỨC')),element('blockquote','',titleFor(t)||word('No words yet. Just this song.','Chưa có lời viết. Chỉ một bài hát.')));detail.append(button(word('Edit this memory','Sửa ký ức này'),'ghost',()=>{editing=t.id;const previous=selected;selected=t.id;$('#edit').click();selected=previous}));card.append(detail)}root.append(card)});}
renderQueue();if(!state.tracks.length){dock.hidden=true;document.body.classList.remove('has-memory-dock')}
}
function renderQueue(){const root=$('#queue-items');root.replaceChildren();queue.forEach((id,i)=>{const t=state.tracks.find(t=>t.id===id);if(!t)return;const b=button('','queue-item'+(id===selected?' active':''),()=>play(id));b.setAttribute('aria-current',id===selected?'true':'false');b.append(element('span','',String(i+1).padStart(2,'0')),element('strong','',t.title),element('small','',t.artist));root.append(b)});if(!queue.length)root.append(element('p','empty',word('Choose “Play my memories” to begin.','Chọn “Nghe những ký ức” để bắt đầu.')))}
function randomize(ids){const copy=ids.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function start(id){queue=ordered().map(t=>t.id);if(shuffled)queue=id?[id,...randomize(queue.filter(x=>x!==id))]:randomize(queue);const first=id||queue[0];if(first)play(first)}
function play(id){if(!state.tracks.some(t=>t.id===id))return;clearTimeout(endedTimer);internal=true;select(id);internal=false;position=queue.indexOf(id);dock.hidden=false;document.body.classList.add('has-memory-dock');if(!isPlaying&&!pendingPlay)$('#record-toggle').click();render()}
function step(delta,automatic=false){clearTimeout(endedTimer);queue=queue.filter(id=>state.tracks.some(t=>t.id===id));if(!queue.length)return;
position=queue.indexOf(selected);if(automatic&&repeat==='one'){if(current()?.media.type==='playlist')ytPlayer?.playVideoAt?.(0);else{ytPlayer?.seekTo?.(0,true);ytPlayer?.playVideo?.()}return}
let next=position+delta;if(next<0||next>=queue.length){if(repeat==='all')next=(next+queue.length)%queue.length;else return}play(queue[next])}
function ended(){// A playlist remains one diary item until its final video ends.
if(current()?.media.type==='playlist'){const list=ytPlayer?.getPlaylist?.();if(!list?.length||ytPlayer.getPlaylistIndex()<list.length-1)return}
clearTimeout(endedTimer);const id=selected;endedTimer=setTimeout(()=>{if(selected===id&&playbackStatus==='ended')step(1,true)},700)}
function updateDock(){const t=current();$('#dock-title').textContent=t?.title||word('Your memories','Những ký ức');$('#dock-artist').textContent=t?.artist||'SONORA';$('#dock-status').textContent=tr(playbackStatus);const playing=playbackStatus==='playing'||pendingPlay;$('#queue-play').textContent=playing?'Ⅱ':'▶';const label=word(playing?'Pause':'Play',playing?'Tạm dừng':'Phát');$('#queue-play').setAttribute('aria-label',label);$('#dock-record').setAttribute('aria-label',label);$('#queue-prev').disabled=!queue.length||(position<=0&&repeat!=='all');$('#queue-next').disabled=!queue.length||(position>=queue.length-1&&repeat!=='all');$('#queue-repeat').textContent=repeat==='one'?'↻¹':'↻';$('#queue-repeat').setAttribute('aria-pressed',String(repeat!=='off'));$('#queue-shuffle').setAttribute('aria-pressed',String(shuffled))}
async function transition(){
 if(busy)return;
 busy=true;
 const toDiary=mode==='universe',toggle=$('#view-toggle'),cover=$('.book-cover');
 const animations=[];
 const finishOnResize=()=>animations.forEach(a=>a.cancel());
 toggle.disabled=true;
 host.setAttribute('aria-busy','true');
 // Both views retain exactly the same layout throughout the reversible timeline.
 document.body.classList.remove('exhibition');
 $('#exhibit').textContent=tr('◈ Triển lãm');
 $('#exhibit').setAttribute('aria-pressed','false');
 scene.inert=true;pages.inert=true;
 try{
  host.classList.add('turning');
  scene.style.visibility='visible';
  pages.hidden=false;
  book.style.display='block';
  book.style.opacity='1';
  const full=scene.getBoundingClientRect(),bounds=book.getBoundingClientRect();
  const sx=bounds.width/Math.max(full.width,1),sy=bounds.height/Math.max(full.height,1);
  const compact=`scale(${sx},${sy})`;
  const frames=[
   [scene,[
    {offset:0,transform:'scale(1)',opacity:1,borderRadius:'0px'},
    {offset:.34,transform:compact,opacity:1,borderRadius:'18px'},
    {offset:.43,transform:compact,opacity:0,borderRadius:'18px'},
    {offset:1,transform:compact,opacity:0,borderRadius:'18px'}
   ]],
   [book,[
    {offset:0,opacity:0},{offset:.29,opacity:0},
    {offset:.39,opacity:1},{offset:.63,opacity:1},{offset:.81,opacity:0},{offset:1,opacity:0}
   ]],
   [book.querySelector('.book-leaves'),[
    {offset:0,opacity:1},{offset:.43,opacity:1},{offset:.55,opacity:0},{offset:1,opacity:0}
   ]],
   [cover,[
    {offset:0,transform:'rotateY(0deg)'},
    {offset:.43,transform:'rotateY(0deg)'},
    {offset:.77,transform:'rotateY(-155deg)'},
    {offset:1,transform:'rotateY(-155deg)'}
   ]],
   [pages,[
    {offset:0,transform:compact,opacity:0,borderRadius:'18px'},
    {offset:.39,transform:compact,opacity:0,borderRadius:'18px'},
    {offset:.44,transform:compact,opacity:1,borderRadius:'18px'},
    {offset:.56,transform:compact,opacity:1,borderRadius:'18px'},
    {offset:1,transform:'scale(1)',opacity:1,borderRadius:'0px'}
   ]]
  ];
  if(!reduced.matches){
   const options={duration:1900,easing:'cubic-bezier(.4,0,.2,1)',fill:'both',direction:toDiary?'normal':'reverse'};
   for(const [node,keyframes] of frames)animations.push(node.animate(keyframes,options));
   // Start every layer on the same clock; closing is the exact inverse of opening.
   const start=document.timeline.currentTime;
   animations.forEach(a=>{a.startTime=start});
   window.addEventListener('resize',finishOnResize,{once:true});
   await Promise.allSettled(animations.map(a=>a.finished));
  }
 }finally{
  // Set the stable state before removing animation effects to prevent a flash.
  mode=toDiary?'diary':'universe';
  scene.style.visibility=toDiary?'hidden':'visible';
  pages.hidden=!toDiary;
  scene.inert=toDiary;pages.inert=!toDiary;
  book.style.display='none';
  host.classList.toggle('diary-mode',toDiary);
  animations.forEach(a=>a.cancel());
  window.removeEventListener('resize',finishOnResize);
  host.classList.remove('turning');host.removeAttribute('aria-busy');
  toggle.disabled=false;busy=false;texts();
  // Keep the journal's scroll position when returning to an already-read page.
  toggle.focus({preventScroll:true});
 }
}
$('#view-toggle').onclick=transition;$('#play-memories').onclick=()=>start();$('#queue-next').onclick=()=>step(1);$('#queue-prev').onclick=()=>step(-1);$('#queue-play').onclick=$('#dock-record').onclick=()=>$('#record-toggle').click();
$('#queue-shuffle').onclick=()=>{shuffled=!shuffled;if(shuffled&&queue.length){queue=[selected,...randomize(queue.filter(id=>id!==selected))].filter(id=>state.tracks.some(t=>t.id===id))}else if(queue.length){const ids=new Set(queue);queue=state.tracks.filter(t=>ids.has(t.id)).sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(t=>t.id)}render()};
$('#queue-repeat').onclick=()=>{repeat=({off:'all',all:'one',one:'off'})[repeat];texts()};
$('#queue-toggle').onclick=()=>{const panel=$('#memory-queue');panel.hidden=!panel.hidden;$('#queue-toggle').setAttribute('aria-expanded',String(!panel.hidden))};$('#queue-close').onclick=()=>{$('#memory-queue').hidden=true;$('#queue-toggle').setAttribute('aria-expanded','false');$('#queue-toggle').focus()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#memory-queue').hidden)$('#queue-close').click()});
$('#memory-seek').oninput=e=>{const duration=ytPlayer?.getDuration?.();if(duration>0)ytPlayer.seekTo(Number(e.target.value)/1000*duration,true)};
const time=n=>Number.isFinite(n)?Math.floor(n/60)+':'+String(Math.floor(n%60)).padStart(2,'0'):'0:00';setInterval(()=>{if(document.hidden||dock.hidden)return;let d=0,t=0;try{d=ytPlayer?.getDuration?.()||0;t=ytPlayer?.getCurrentTime?.()||0}catch{}$('#elapsed').textContent=time(t);$('#duration').textContent=time(d);$('#memory-seek').disabled=d<=0;if(document.activeElement!==$('#memory-seek'))$('#memory-seek').value=d?Math.min(1000,t/d*1000):0;$('#memory-seek').setAttribute('aria-valuetext',time(t)+' / '+time(d))},800);
window.SonoraMemories={render,ended,selection(id){if(!internal&&id!==selected){clearTimeout(endedTimer);queue=[];position=-1}},playback(status){if(status==='playing'||status==='preparing'){dock.hidden=false;document.body.classList.add('has-memory-dock')}queueMicrotask(updateDock)},reset(){clearTimeout(endedTimer);queue=[];position=-1;opened=null;$('#memory-queue').hidden=true;dock.hidden=true;document.body.classList.remove('has-memory-dock')}};
render();
})();
