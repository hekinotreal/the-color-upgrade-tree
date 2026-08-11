const { app, BrowserWindow } = require('electron')
const path = require('path')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1280, height: 800, show: false, webPreferences: { nodeIntegration: false, contextIsolation: true, preload: path.join(__dirname, 'preload-capture.js') } })

  win.webContents.on('console-message', (e, level, message, line) => {
    console.log(`[CONSOLE ${level}] line ${line}: ${message}`)
  })

  win.webContents.on('did-finish-load', async () => {
    await sleep(4000)
    app.exit(0)
  })

  win.loadFile(path.join(__dirname, 'index.html'))
})
