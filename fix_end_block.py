import re

with open('src/main/upload-controller.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the Promise.all end block
bad_block = """  Promise.all(promises).then(async () => {
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
    addHistoryRecord({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: title,
      filePath: videoPath,
      platforms: {
        youtube: config.useYt ? 'YouTube (Processed)' : undefined,
        vk: config.useVk ? 'VK (Processed)' : undefined,
        telegram: config.useTg ? 'Telegram (Processed)' : undefined
      }
    })

    mainWindow.webContents.send('upload-progress-yt', { percent: 100, status: 'Операция завершена!' })
    mainWindow.webContents.send('upload-progress-vk', { percent: 100, status: 'Готово' })
    mainWindow.webContents.send('upload-progress-tg', { percent: 100, status: 'Успешно' })
  })"""

good_block = """  Promise.all(promises).then(async () => {
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
    
    let successPlatforms: ('youtube' | 'vk' | 'telegram')[] = []
    if (config.useYt) successPlatforms.push('youtube')
    if (config.useVk) successPlatforms.push('vk')
    if (config.useTg) successPlatforms.push('telegram')
    
    let xpGained = processMissionXP(mainWindow, successPlatforms, 0, false);
    
    addHistoryRecord({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: title,
      duration: 'N/A',
      platforms: successPlatforms,
      xpGained: xpGained
    })

    mainWindow.webContents.send('upload-progress-yt', { percent: 100, status: 'Операция завершена!' })
    mainWindow.webContents.send('upload-progress-vk', { percent: 100, status: 'Готово' })
    mainWindow.webContents.send('upload-progress-tg', { percent: 100, status: 'Успешно' })
  })"""

c = c.replace(bad_block, good_block)

with open('src/main/upload-controller.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("End block replaced!")
