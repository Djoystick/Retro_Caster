import re

with open('src/main/index.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Add dialog to electron imports if not there
if "dialog" not in c:
    c = c.replace("import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } from 'electron'", "import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification, dialog } from 'electron'")

# Replace the close handler
old_close = """  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow.hide()
      if (Notification.isSupported()) {
        new Notification({
          title: 'RetroCaster',
          body: 'Работает в фоновом режиме',
          icon: nativeImage.createFromPath(icon)
        }).show()
      }
    }
  })"""

new_close = """  mainWindow.on('close', async (event) => {
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
  })"""

c = c.replace(old_close, new_close)

with open('src/main/index.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("Close handler replaced with dialog.")
