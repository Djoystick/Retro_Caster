import re

with open('src/main/upload-controller.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's completely replace `executeMasterUpload`
master_upload_def = """export async function executeMasterUpload(
  mainWindow: any,
  videoPath: string,
  title: string,
  config: UploadConfig
) {
  const promises: Promise<any>[] = []

  if (config.useYt) {
    if (!config.ytClientId || !config.ytClientSecret || !config.ytRefreshToken) {
      mainWindow.webContents.send('upload-progress-yt', { percent: 0, status: 'Ошибка: Необходима авторизация' })
    } else {
      log.info(`[OOM TRACE] Starting YouTube upload for ${videoPath}`);
      const ytTask = async () => {
        let targetPath = videoPath;
        let isTrimmed = false;
        if (config.ytTrim) {
           targetPath = await executeTrim(videoPath, config.ytTrim, 'yt', (percent, status) => { mainWindow.webContents.send('upload-progress-yt', { percent, status }) });
           isTrimmed = true;
        }
        
        const res = await withRetry('YouTube Upload', () => uploadToYouTube(
          config.ytClientId!, config.ytClientSecret!, config.ytRefreshToken!, targetPath, title,
          (percent, status) => { mainWindow.webContents.send('upload-progress-yt', { percent, status }) }
        ), (attempt) => {
          mainWindow.webContents.send('upload-progress-yt', { percent: 0, status: `Повторная попытка ${attempt}/3...` })
        });
        
        if (isTrimmed && fs.existsSync(targetPath)) {
          try { fs.unlinkSync(targetPath); } catch(e) {}
        }
        
        if (!res.success) throw new Error(res.error);
        return res;
      };
      
      promises.push(
        ytTask().catch(err => {
          log.error('YouTube upload error:', err)
          mainWindow.webContents.send('upload-progress-yt', { percent: 100, status: 'Сбой: ' + (err.message || 'Критическая ошибка') })
        })
      )
    }
  }

  if (config.useVk) {
    if (!config.vkToken || !config.vkGroupId) {
      mainWindow.webContents.send('upload-progress-vk', { percent: 0, status: 'Ошибка: Нет токена VK' })
    } else {
      const vkTask = async () => {
        let targetPath = videoPath;
        let isTrimmed = false;
        if (config.vkTrim) {
           targetPath = await executeTrim(videoPath, config.vkTrim, 'vk', (percent, status) => { mainWindow.webContents.send('upload-progress-vk', { percent, status }) });
           isTrimmed = true;
        }
        
        const res = await withRetry('VK Upload', () => uploadToVK(
          config.vkToken!, config.vkGroupId!, targetPath, title,
          (percent, status) => { mainWindow.webContents.send('upload-progress-vk', { percent, status }) }
        ), (attempt) => {
           mainWindow.webContents.send('upload-progress-vk', { percent: 0, status: `Повторная попытка ${attempt}/3...` })
        });
        
        if (isTrimmed && fs.existsSync(targetPath)) {
          try { fs.unlinkSync(targetPath); } catch(e) {}
        }
        if (!res.success) throw new Error(res.error);
        return res;
      };
      
      promises.push(
        vkTask().catch(err => {
          log.error('VK upload error:', err)
          mainWindow.webContents.send('upload-progress-vk', { percent: 100, status: 'Сбой: ' + (err.message || 'Критическая ошибка') })
        })
      )
    }
  }

  if (config.useTg) {
    if (!config.tgBotToken || !config.tgChannelId) {
      mainWindow.webContents.send('upload-progress-tg', { percent: 0, status: 'Ошибка: Нет токена TG' })
    } else {
      const tgTask = async () => {
        let targetPath = videoPath;
        let isTrimmed = false;
        if (config.tgTrim) {
           targetPath = await executeTrim(videoPath, config.tgTrim, 'tg', (percent, status) => { mainWindow.webContents.send('upload-progress-tg', { percent, status }) });
           isTrimmed = true;
        }
        
        const res = await withRetry('Telegram Upload', () => uploadToTelegram(
          config.tgBotToken!, config.tgChannelId!, targetPath, title,
          (percent, status) => { mainWindow.webContents.send('upload-progress-tg', { percent, status }) },
          config.tgTopicId
        ), (attempt) => {
           mainWindow.webContents.send('upload-progress-tg', { percent: 0, status: `Повторная попытка ${attempt}/3...` })
        });
        
        if (isTrimmed && fs.existsSync(targetPath)) {
          try { fs.unlinkSync(targetPath); } catch(e) {}
        }
        if (!res.success) throw new Error(res.error);
        return res;
      };
      
      promises.push(
        tgTask().catch(err => {
          log.error('Telegram upload error:', err)
          mainWindow.webContents.send('upload-progress-tg', { percent: 100, status: 'Сбой: ' + (err.message || 'Критическая ошибка') })
        })
      )
    }
  }

  Promise.all(promises).then(async () => {
    log.info(`[OOM TRACE] Master Upload completed for ${videoPath}`);
    if (config.autoDelete) {
      mainWindow.webContents.send('upload-progress-yt', { percent: 100, status: 'Очистка исходников...' })
      if (fs.existsSync(videoPath)) {
        try {
          fs.unlinkSync(videoPath)
        } catch (e: any) {
          log.error('Failed to auto-delete original file:', e.message)
        }
      }
      
      const partsDir = videoPath + '_parts'
      if (fs.existsSync(partsDir)) {
        try {
          fs.rmSync(partsDir, { recursive: true, force: true })
        } catch (e: any) {
          log.error('Failed to auto-delete chunks folder:', e.message)
        }
      }
    }
    
    await processMissionXP()
    addHistoryRecord(title, videoPath, 'https://youtube.com', 'https://vk.com/video', 'https://t.me')

    mainWindow.webContents.send('upload-progress-yt', { percent: 100, status: 'Операция завершена!' })
    mainWindow.webContents.send('upload-progress-vk', { percent: 100, status: 'Готово' })
    mainWindow.webContents.send('upload-progress-tg', { percent: 100, status: 'Успешно' })
  })
}
"""

parts = c.split("export async function executeMasterUpload(")
if len(parts) > 1:
    c = parts[0] + master_upload_def
    
with open('src/main/upload-controller.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("upload-controller.ts full override successful.")
