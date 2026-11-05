'use strict';
(()=>{
 let deferredPrompt=null,registration=null,reloading=false,requestedUpdate=false,dismissedWorker=null;
 const offline=element('div','offline-banner');offline.setAttribute('role','status');offline.dataset.i18n='offline';document.querySelector('header').after(offline);
 const install=element('button','install-link');install.type='button';install.dataset.i18n='installApp';$('.sidebar-bottom').append(install);
 const dialog=element('dialog','install-dialog');dialog.id='install-dialog';dialog.setAttribute('aria-labelledby','install-title');dialog.innerHTML='<div class="dialog-top"><span class="eyebrow">SONORA · WEB APP</span><button type="button" class="close" aria-label="Close">×</button></div><img class="app-icon" src="icons/icon-192.png" width="72" height="72" alt=""><h2 id="install-title" data-i18n="installTitle"></h2><p data-i18n="installIntro"></p><p id="installed-status" data-i18n="installed" hidden></p><p data-i18n="installIOS"></p><p data-i18n="installAndroid"></p><button id="native-install" class="primary wide" data-i18n="installNow" hidden></button><p class="muted" data-i18n="installNote"></p>';document.body.append(dialog);
 dialog.querySelector('.close').onclick=()=>dialog.close();install.onclick=()=>{refresh();dialog.showModal()};
 const update=element('section','update-banner');update.hidden=true;update.setAttribute('role','status');update.innerHTML='<span data-i18n="updateReady"></span><button id="apply-update" class="primary" data-i18n="updateNow"></button><button id="later-update" class="ghost" data-i18n="updateLater"></button>';document.body.append(update);
 function refresh(){offline.hidden=navigator.onLine;$('#native-install').hidden=!deferredPrompt;$('#installed-status').hidden=!(matchMedia('(display-mode: standalone)').matches||navigator.standalone);[offline,install,...dialog.querySelectorAll('[data-i18n]'),...update.querySelectorAll('[data-i18n]')].forEach(n=>n.textContent=tr(n.dataset.i18n))}
 window.addEventListener('online',refresh);window.addEventListener('offline',refresh);
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;refresh()});window.addEventListener('appinstalled',()=>{deferredPrompt=null;refresh()});
 $('#native-install').onclick=async()=>{if(!deferredPrompt)return;const prompt=deferredPrompt;deferredPrompt=null;try{await prompt.prompt();await prompt.userChoice}catch{}refresh()};
 function offer(){if(registration?.waiting&&registration.waiting!==dismissedWorker)update.hidden=false}
 $('#later-update').onclick=()=>{dismissedWorker=registration?.waiting;update.hidden=true};
 $('#apply-update').onclick=()=>{if(window.SonoraSync?.hasPending||window.SonoraDiary?.editing()||isPlaying||pendingPlay){toast(tr('updateBusy'));return}if(!registration?.waiting)return;requestedUpdate=true;registration.waiting.postMessage({type:'ACTIVATE_UPDATE'})};
 if('serviceWorker' in navigator&&location.protocol==='https:'||'serviceWorker' in navigator&&['localhost','127.0.0.1','terminal.local'].includes(location.hostname)){
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(requestedUpdate&&!reloading){reloading=true;location.reload()}});
  navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(r=>{registration=r;offer();r.addEventListener('updatefound',()=>{const worker=r.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)offer()})});window.addEventListener('focus',()=>{r.update().catch(()=>{});offer()})}).catch(()=>{install.title=tr('appUnavailable')});
 }
 refresh();
})();
