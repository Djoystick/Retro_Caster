import re

with open('src/main/upload-controller.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix VK
vk_bad = """uploadToVK(
          config.vkToken!, config.vkGroupId!, targetPath, title,
          (percent, status) => { mainWindow.webContents.send('upload-progress-vk', { percent, status }) }
        )"""
vk_good = """uploadToVK(
          config.vkToken!, targetPath, title, config.vkGroupId || '', config.vkPostToWall ?? true,
          (percent, status) => { mainWindow.webContents.send('upload-progress-vk', { percent, status }) }
        )"""
c = c.replace(vk_bad, vk_good)

# Fix TG
tg_bad = """uploadToTelegram(
          config.tgBotToken!, config.tgChannelId!, targetPath, title,
          (percent, status) => { mainWindow.webContents.send('upload-progress-tg', { percent, status }) },
          config.tgTopicId
        )"""
tg_good = """uploadToTelegram(
          config.tgBotToken!, config.tgChannelId!, config.tgTopicId || '', targetPath, title,
          (percent, status) => { mainWindow.webContents.send('upload-progress-tg', { percent, status }) }
        )"""
c = c.replace(tg_bad, tg_good)

# Fix History
hist_bad = "addHistoryRecord(title, videoPath, 'https://youtube.com', 'https://vk.com/video', 'https://t.me')"
hist_good = """addHistoryRecord({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: title,
      filePath: videoPath,
      platforms: {
        youtube: config.useYt ? 'YouTube (Processed)' : undefined,
        vk: config.useVk ? 'VK (Processed)' : undefined,
        telegram: config.useTg ? 'Telegram (Processed)' : undefined
      }
    })"""
c = c.replace(hist_bad, hist_good)

with open('src/main/upload-controller.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("upload-controller.ts signatures fixed.")
