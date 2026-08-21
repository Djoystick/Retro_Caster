import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import ytDlp from 'yt-dlp-exec'
import { setupDownloadEngine } from './download'
import { executeMasterUpload } from './upload-controller'
import icon from '../../resources/icon.png?asset'

import { authenticateYouTube } from './youtube'
import { authenticateVK, validateVkToken } from './vk'
import { validateTgToken } from './telegram'
import { getGamification, getHistory, getSecureToken, setSecureToken } from './store'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 720,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  ipcMain.on('log-error', (_, errorStr: string) => {
    require('fs').appendFileSync(
      require('path').join(app.getPath('userData'), 'ui-crash.log'),
      errorStr + '\n'
    )
  })

  ipcMain.on('window-minimize', () => mainWindow.minimize())
  ipcMain.on('window-close', () => mainWindow.close())

  ipcMain.handle('parse-url', async (_, url: string) => {
    try {
      const output = await ytDlp(url, {
        dumpJson: true,
        noWarnings: true,
        noCheckCertificate: true,
        forceIpv4: true
      })
      return { success: true, data: output }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to parse URL' }
    }
  })

  ipcMain.handle('get-gamification', () => getGamification())
  ipcMain.handle('set-equipped-ship', (_, ship: string) => {
    const { setEquippedShip } = require('./store')
    return setEquippedShip(ship)
  })
  ipcMain.handle('get-history', () => getHistory())

  ipcMain.handle('secure-store-set', (_, key: string, value: string) => setSecureToken(key, value))
  ipcMain.handle('secure-store-get', (_, key: string) => getSecureToken(key))

  ipcMain.handle('select-directory', async () => {
    const { dialog } = require('electron')
    const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })
    return result.canceled ? null : result.filePaths[0]
  })

  ipcMain.handle('youtube-auth', async (_, clientId: string, clientSecret: string) => {
    try {
      return { success: true, ...(await authenticateYouTube(clientId, clientSecret)) }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  })
  ipcMain.handle('vk-auth', async () => {
    try {
      return { success: true, ...(await authenticateVK(mainWindow)) }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  })
  ipcMain.handle('vk-validate-token', async (_, token: string) => await validateVkToken(token))
  ipcMain.handle(
    'start-master-upload',
    async (_, videoPath: string, title: string, config: any) => {
      try {
        await executeMasterUpload(mainWindow, videoPath, title, config)
        return { success: true }
      } catch (err: any) {
        return { success: false, error: err.message }
      }
    }
  )
  ipcMain.handle('tg-validate-token', async (_, token: string) => await validateTgToken(token))

  setupDownloadEngine(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show() // mainWindow.webContents.openDevTools();
  }) // mainWindow.webContents.openDevTools();
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
