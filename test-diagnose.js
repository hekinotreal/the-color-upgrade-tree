const { app, BrowserWindow } = require('electron')
const path = require('path')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1280, height: 800, show: false, webPreferences: { nodeIntegration: false, contextIsolation: true } })

  win.webContents.on('console-message', (e, level, message, line) => {
    if (level >= 2) console.log(`[CONSOLE ${level}] line ${line}: ${message}`)
  })

  win.webContents.on('did-finish-load', async () => {
    await sleep(4000)
    const res = await win.webContents.executeJavaScript(`(function(){
      const out = [];
      try {
        out.push('window.layer at this moment = ' + window.layer);
        // Snapshot what the effect function computes right now (already evaluated by ticks)
        out.push('tmp.red.upgrades[14].effect (red=0) = ' + tmp.red.upgrades[14].effect);
        out.push('tmp.red.upgrades[11].effect = ' + tmp.red.upgrades[11].effect);
        out.push('tmp.red.gainMult = ' + tmp.red.gainMult);
        // Evaluate the raw function to see what this.layer is inside it
        let ef = layers.red.upgrades[14].effect;
        let val;
        try { val = 'returns ' + ef(); } catch(e) { val = 'THROWS: ' + e.message; }
        out.push('calling layers.red.upgrades[14].effect() directly -> ' + val);
        out.push('inside that call, this.layer would be: ' + (window.layer));
        out.push('player.red.points = ' + player.red.points);
        out.push('log(0) test: ' + new Decimal(0).log(2));
        out.push('log(0).max(1) test: ' + new Decimal(0).log(2).max(1));
      } catch(e) {
        out.push('ERROR: ' + e.message + ' | ' + e.stack);
      }
      return out.join('\\n');
    })()`)
    console.log(res)
    await sleep(500)
    app.exit(0)
  })

  win.loadFile(path.join(__dirname, 'index.html'))
})
