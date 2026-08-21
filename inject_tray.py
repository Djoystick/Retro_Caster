import re

file_path = r'src\main\index.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
if 'Tray, Menu, Notification' not in content:
    content = content.replace(
        "import { app, shell, BrowserWindow, ipcMain } from 'electron'",
        "import { app, shell, BrowserWindow, ipcMain, Tray, Menu, Notification, nativeImage } from 'electron'"
    )

# 2. Add global tray and isQuitting
if 'let tray: Tray | null' not in content:
    content = re.sub(
        r'import \{ getGamification, getHistory, getSecureToken, setSecureToken \} from \'./store\'\s*',
        "import { getGamification, getHistory, getSecureToken, setSecureToken } from './store'\n\nlet tray: Tray | null = null\nlet isQuitting = false\n",
        content
    )

# 3. Add window close interception inside createWindow
if 'mainWindow.on(\'close\'' not in content:
    content = content.replace(
        "mainWindow.on('ready-to-show', () => {",
        """mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow.hide()
      if (Notification.isSupported()) {
        new Notification({
          title: 'RetroCaster',
          body: 'Система переведена в фоновый режим',
          icon: nativeImage.createFromPath(icon)
        }).show()
      }
    }
  })

  mainWindow.on('ready-to-show', () => {"""
    )

# 4. Modify app.whenReady to setup Tray
if 'tray = new Tray(' not in content:
    setup_tray_code = """
  tray = new Tray(nativeImage.createFromPath(icon))
  tray.setToolTip('RetroCaster - Background Pipeline Active')
  
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
"""
    content = content.replace(
        "createWindow()",
        f"createWindow()\n{setup_tray_code}"
    )

# 5. Modify start-master-upload to send notifications on finish
if 'Миссия завершена' not in content:
    new_master_upload = """ipcMain.handle(
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
  )"""
    # Replace the old one using regex
    old_upload_pattern = re.compile(
        r"ipcMain\.handle\(\s*'start-master-upload',\s*async \(_, videoPath: string, title: string, config: any\) => \{.*?\s*\}\s*\)",
        re.DOTALL
    )
    content = old_upload_pattern.sub(new_master_upload, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("System Tray and Notifications injected into main/index.ts")
