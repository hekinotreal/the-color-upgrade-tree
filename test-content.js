const { app, BrowserWindow } = require('electron')
const path = require('path')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
let loadCount = 0

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1280, height: 800, show: false, webPreferences: { nodeIntegration: false, contextIsolation: true } })

  win.webContents.on('console-message', (e, level, message, line) => {
    if (level >= 2 && !/Content-Security|electronjs|font-weight|Security Warning/i.test(message)) console.log(`[CONSOLE ${level}] line ${line}: ${message}`)
  })

  win.webContents.on('did-finish-load', async () => {
    loadCount++
    if (loadCount === 1) {
      await win.webContents.executeJavaScript(`localStorage.clear()`)
      win.webContents.reload()
    } else if (loadCount === 2) {
      await sleep(4000)
      await win.webContents.executeJavaScript(`window.__errs = []; window.onerror = function(msg, src, line, col, err){ window.__errs.push((err && err.stack) ? err.stack : msg + ' @' + src + ':' + line); }; if (window.Vue) Vue.config.errorHandler = function(err, vm, info){ var name = '?'; try { name = (vm && vm.$options && vm.$options.name) || (vm && vm.$vnode && vm.$vnode.componentOptions && vm.$vnode.componentOptions.tag) || '?'; } catch(e) {} var lyr = (vm && vm.$props && vm.$props.layer) || '?'; var tmpState = (typeof tmp !== 'undefined' && lyr !== '?' && tmp[lyr]) ? 'tmp-ok' : (typeof tmp !== 'undefined' ? 'tmp-missing:' + Object.keys(tmp).join(',') : 'no-tmp'); window.__errs.push('VUE[' + info + '] comp=' + name + ' layer=' + lyr + ' ' + tmpState + ': ' + (err && err.stack ? err.stack : err)); }; true`)
      const res = await win.webContents.executeJavaScript(`(function(){
        const out = [];
        const log = (s) => out.push(s);
        try {
          log('== Fresh save test ==');
          log('player.tab=' + player.tab + ' navTab=' + player.navTab);
          log('layer red exists: ' + (!!layers.red) + ', symbol: ' + layers.red.symbol + ', resource: ' + layers.red.resource);
          log('red upgrades: ' + Object.keys(layers.red.upgrades).filter(x=>!isNaN(x)).join(','));
          log('pointGen fresh: ' + tmp.pointGen);
          player.points = new Decimal(100);
          return 'go';
        } catch(e) { return 'ERR1: ' + e.message; }
      })()`)
      console.log(res)
      await sleep(300)
      const res2 = await win.webContents.executeJavaScript(`(function(){
        const out = [];
        const log = (s) => out.push(s);
        try {
          log('resetGain at 100 points: ' + tmp.red.resetGain + ' (expect 3)');
          doReset('red');
          return out.join('\\n');
        } catch(e) { return 'ERR2: ' + e.message; }
      })()`)
      console.log(res2)
      await sleep(300)
      const res3 = await win.webContents.executeJavaScript(`(function(){
        const out = [];
        const log = (s) => out.push(s);
        try {
          log('after reset: red=' + player.red.points + ' points=' + player.points + ' (expect red=3, points=0)');
          buyUpgrade('red', 11);
          return out.join('\\n');
        } catch(e) { return 'ERR3: ' + e.message; }
      })()`)
      console.log(res3)
      await sleep(300)
      const res4 = await win.webContents.executeJavaScript(`(function(){
        const out = [];
        const log = (s) => out.push(s);
        try {
          log('after upg11: red=' + player.red.points + ' (expect 2), pointGen=' + tmp.pointGen + ' (expect 5)');
          player.red.points = new Decimal(10);
          buyUpgrade('red', 12);
          return out.join('\\n');
        } catch(e) { return 'ERR4: ' + e.message; }
      })()`)
      console.log(res4)
      await sleep(300)
      const res5 = await win.webContents.executeJavaScript(`(function(){
        const out = [];
        const log = (s) => out.push(s);
        try {
          log('after upg12: red=' + player.red.points + ' (expect 5), gainMult=' + tmp.red.gainMult + ' (expect 10)');
          player.red.points = new Decimal(100);
          buyUpgrade('red', 13);
          return out.join('\\n');
        } catch(e) { return 'ERR5: ' + e.message; }
      })()`)
      console.log(res5)
      await sleep(300)
      const res6 = await win.webContents.executeJavaScript(`(function(){
        const out = [];
        const log = (s) => out.push(s);
        try {
          log('after upg13: red=' + player.red.points + ' (expect 50), gainMult=' + tmp.red.gainMult + ' (expect 100), pointGen=' + tmp.pointGen + ' (expect 50)');
          player.red.points = new Decimal(2000);
          buyUpgrade('red', 14);
          return out.join('\\n');
        } catch(e) { return 'ERR6: ' + e.message; }
      })()`)
      console.log(res6)
      await sleep(300)
      const res7 = await win.webContents.executeJavaScript(`(function(){
        const out = [];
        const log = (s) => out.push(s);
        try {
          log('after upg14: red=' + player.red.points + ' (expect 1000), effect14=' + upgradeEffect('red', 14) + ' (expect ~9.97), pointGen=' + tmp.pointGen + ' (expect 50*9.97=498)');
          player.red.points = new Decimal("2^300");
          return out.join('\\n');
        } catch(e) { return 'ERR7: ' + e.message; }
      })()`)
      console.log(res7)
      await sleep(300)
      const res8 = await win.webContents.executeJavaScript(`(function(){
        const out = [];
        const log = (s) => out.push(s);
        try {
          log('effect14 at 2^300 red: ' + upgradeEffect('red', 14) + ' (expect 100 cap)');
          player.red.points = new Decimal(20000);
          buyUpgrade('red', 15);
          return out.join('\\n');
        } catch(e) { return 'ERR8: ' + e.message; }
      })()`)
      console.log(res8)
      await sleep(300)
      const res9 = await win.webContents.executeJavaScript(`(function(){
        const out = [];
        const log = (s) => out.push(s);
        try {
          log('after upg15: red=' + player.red.points + ' (expect 10000), gainMult=' + tmp.red.gainMult + ' (expect 10000)');
          log('== Write stale save ==');
          var s = JSON.parse(JSON.stringify(player));
          s.tab = 'p';
          s.navTab = 'p';
          localStorage.setItem('The-???-Tree-nobody', btoa(unescape(encodeURIComponent(JSON.stringify(s)))));
          log('save written with tab=p');
          return out.join('\\n');
        } catch(e) { return 'ERR9: ' + e.message; }
      })()`)
      console.log(res9)
      const errs = await win.webContents.executeJavaScript(`window.__errs.join('\\n---\\n')`)
      console.log('ERRORS:\n' + errs)
      await sleep(500)
      win.webContents.reload()
    } else if (loadCount === 3) {
      await sleep(4000)
      const res10 = await win.webContents.executeJavaScript(`(function(){
        try {
          return 'AFTER RELOAD WITH STALE SAVE: tab=' + player.tab + ' navTab=' + player.navTab + ' gameLoaded=' + (typeof loadVue !== 'undefined');
        } catch(e) { return 'AFTER RELOAD ERROR: ' + e.message; }
      })()`)
      console.log(res10)
      await sleep(500)
      app.exit(0)
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'))
})

setTimeout(() => { console.log('GLOBAL TIMEOUT'); app.exit(1) }, 100000)
