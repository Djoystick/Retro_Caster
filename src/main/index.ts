import { app, shell, BrowserWindow, ipcMain, Tray, Menu, Notification, nativeImage, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import ytDlp from 'yt-dlp-exec'
import { setupDownloadEngine } from './download'
import { executeMasterUpload } from './upload-controller'
import icon from '../../resources/icon.png?asset'

import { authenticateYouTube } from './youtube'
import { authenticateVK, validateVkToken } from './vk'
import { validateTgToken } from './telegram'
import { getGamification, getHistory, getSecureToken, setSecureToken, setEquippedShip } from './store'
import { checkAchievements } from './gamification'

let tray: Tray | null = null
let isQuitting = false

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
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('close', async (event) => {
    if (!isQuitting) {
      event.preventDefault()
      
      const { response } = await dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['Свернуть в трей', 'Закрыть программу', 'Отмена'],
        defaultId: 0,
        cancelId: 2,
        title: 'RetroCaster',
        message: 'Что вы хотите сделать?',
        detail: 'Программа может продолжить работу в фоновом режиме (в трее).'
      })

      if (response === 0) {
        // Свернуть в трей
        mainWindow.hide()
        if (Notification.isSupported()) {
          new Notification({
            title: 'RetroCaster',
            body: 'Работает в фоновом режиме',
            icon: nativeImage.createFromPath(icon)
          }).show()
        }
      } else if (response === 1) {
        // Закрыть полностью
        isQuitting = true
        app.quit()
      }
      // response === 2 (Отмена) -> ничего не делаем
    }
  })

  ipcMain.on('log-error', (_, errorStr: string) => {
    require('fs').appendFileSync(
      require('path').join(app.getPath('userData'), 'ui-crash.log'),
      errorStr + '\n'
    )
  })

  ipcMain.on('window-minimize', () => mainWindow.minimize())
  ipcMain.on('window-close', () => mainWindow.close()) // This will trigger the hide logic above

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
  ipcMain.handle('tg-validate-token', async (_, token: string) => await validateTgToken(token))

  ipcMain.handle('get-secure-token', (_, key: string) => getSecureToken(key))
  ipcMain.handle('set-secure-token', (_, key: string, value: string) => setSecureToken(key, value))

  ipcMain.handle(
    'start-master-upload',
    async (_, videoPath: string, title: string, config: any) => {
      try {
        await executeMasterUpload(mainWindow, videoPath, title, config)
        if (Notification.isSupported()) {
          new Notification({
            title: 'RetroCaster',
            body: `Миссия завершена: ${title}`,
            icon: nativeImage.createFromPath(icon)
          }).show()
        }
        return { success: true }
      } catch (err: any) {
        if (Notification.isSupported()) {
          new Notification({
            title: 'RetroCaster Ошибка',
            body: `Пайплайн прерван: ${err.message}`,
            icon: nativeImage.createFromPath(icon)
          }).show()
        }
        return { success: false, error: err.message }
      }
    }
  )
  

  setupDownloadEngine(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  
    checkAchievements(mainWindow);
  })
  
  mainWindow.webContents.setWindowOpenHandler((details) => {
    try {
      const parsedUrl = new URL(details.url);
      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        shell.openExternal(details.url);
      }
    } catch(e) {}
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'].replace('localhost', '127.0.0.1'))
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

  // Setup Tray
  tray = new Tray(nativeImage.createFromPath(icon))
  tray.setToolTip('RetroCaster - Pipeline Active')
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Развернуть (Show)', 
      click: () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
        else BrowserWindow.getAllWindows()[0].show()
      }
    },
    { type: 'separator' },
    { 
      label: 'Выход (Quit)', 
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  
  tray.on('click', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else BrowserWindow.getAllWindows()[0].show()
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
