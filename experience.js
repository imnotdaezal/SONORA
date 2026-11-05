'use strict';
(()=>{
 let speed='soft',volume=75,lastVolume=75;try{speed=localStorage.getItem('sonora-speed')||speed;const v=localStorage.getItem('sonora-volume');if(v!==null&&Number.isFinite(Number(v)))volume=Math.max(0,Math.min(100,Number(v)))}catch{}
 const speeds={quick:1400,soft:2400,slow:3200};if(!speeds[speed])speed='soft';if(volume>0)lastVolume=volume;
 const settings=element('section','experience-settings');settings.innerHTML='<span class="eyebrow" data-i18n="experience"></span><label><span data-i18n="transitionSpeed"></span><select id="transition-speed"><option value="quick" data-i18n="speedQuick"></option><option value="soft" data-i18n="speedSoft"></option><option value="slow" data-i18n="speedSlow"></option></select></label>';
 $('#account-dialog').append(settings);$('#transition-speed').value=speed;$('#transition-speed').onchange=e=>{speed=e.target.value;try{localStorage.setItem('sonora-speed',speed)}catch{}};
 const row=element('div','desktop-volume');row.innerHTML='<button id="volume-mute" type="button">◖</button><input id="volume-range" type="range" min="0" max="100" step="1"><output id="volume-level"></output><small id="volume-note" hidden></small>';
 $('.dock-end').prepend(row);
 function applyVolume(){if(current()?.media.type==='spotify')return;try{ytPlayer?.setVolume?.(volume);if(volume===0)ytPlayer?.mute?.();else ytPlayer?.unMute?.()}catch{}}
 function refresh(){const spotify=current()?.media.type==='spotify';$('#volume-mute').disabled=spotify;$('#volume-range').disabled=spotify;$('#volume-range').value=volume;$('#volume-range').setAttribute('aria-label',tr('volume'));$('#volume-range').setAttribute('aria-valuetext',volume+'%');$('#volume-level').textContent=volume+'%';$('#volume-mute').textContent=volume===0?'×':'◖';$('#volume-mute').setAttribute('aria-label',tr(volume===0?'unmute':'mute'));$('#volume-mute').setAttribute('aria-pressed',String(volume===0));$('#volume-note').hidden=!spotify;$('#volume-note').textContent=tr('systemVolume');row.classList.toggle('system-volume',spotify)}
 function change(v){volume=v;if(v>0)lastVolume=v;try{localStorage.setItem('sonora-volume',String(volume))}catch{}applyVolume();refresh()}
 $('#volume-range').oninput=e=>change(Number(e.target.value));$('#volume-mute').onclick=()=>change(volume===0?lastVolume:0);
 new MutationObserver(refresh).observe($('#song-title'),{childList:true});new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 window.SonoraExperience={transitionDuration:()=>speeds[speed],applyVolume};translateUI();refresh();
})();
