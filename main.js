const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'discord.png'),
        backgroundColor: '#0f0f0f',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    win.setMenuBarVisibility(false)
    win.loadFile('index.html')

    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) shell.openExternal(url)
        return { action: 'deny' }
    })

    win.webContents.on('will-navigate', (event, url) => {
        if (url.startsWith('http')) {
            event.preventDefault()
            shell.openExternal(url)
        }
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
