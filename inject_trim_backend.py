import re

with open('src/main/upload-controller.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add imports and TrimConfig
imports = """import fs from 'fs'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'

export interface TrimConfig {
  start: string;
  end: string;
}"""

c = c.replace("import fs from 'fs'", imports)

# 2. Add trim to UploadConfig
old_upload_config = """export interface UploadConfig {
  useYt: boolean
  useVk: boolean
  useTg: boolean"""

new_upload_config = """export interface UploadConfig {
  useYt: boolean
  ytTrim?: TrimConfig
  useVk: boolean
  vkTrim?: TrimConfig
  useTg: boolean
  tgTrim?: TrimConfig"""

c = c.replace(old_upload_config, new_upload_config)

# 3. Add trim helper function
trim_helper = """
async function executeTrim(inputPath: string, trimConfig: TrimConfig, platform: string, reporter: (percent: number, status: string) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const ext = path.extname(inputPath);
    const outputPath = path.join(path.dirname(inputPath), `temp_trim_${platform}_${Date.now()}${ext}`);
    
    let ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    if (ffmpegPath.includes('app.asar')) {
      ffmpegPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked');
    }
    ffmpeg.setFfmpegPath(ffmpegPath);

    reporter(0, '✂️ Нарезка видео (Fast Copy)...');
    
    ffmpeg(inputPath)
      .inputOptions([`-ss ${trimConfig.start}`])
      .outputOptions([`-to ${trimConfig.end}`, '-c copy'])
      .save(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err));
  });
}
"""

c = c.replace("export async function executeMasterUpload(", trim_helper + "\nexport async function executeMasterUpload(")

# 4. Modify executeMasterUpload blocks
# YT
yt_target = """if (config.useYt) {
      if (!config.ytClientId || !config.ytClientSecret || !config.ytRefreshToken) {
        mainWindow.webContents.send('upload-progress-yt', { percent: 0, status: 'Ошибка: Необходима авторизация' })
      } else {
        log.info(`[OOM TRACE] Starting YouTube upload for ${videoPath}`);
        promises.push(
          withRetry('YouTube Upload', () => uploadToYouTube("""

yt_repl = """if (config.useYt) {
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
        )"""

c = c.replace(yt_target, yt_repl)
c = c.replace(").then(res => {\n            if (!res.success) mainWindow.webContents.send('upload-progress-yt', { percent: 100, status: 'Ошибка: ' + res.error })\n          })", "")

# VK
vk_target = """if (config.useVk) {
      if (!config.vkToken || !config.vkGroupId) {
        mainWindow.webContents.send('upload-progress-vk', { percent: 0, status: 'Ошибка: Нет токена VK' })
      } else {
        promises.push(
          withRetry('VK Upload', () => uploadToVK("""

vk_repl = """if (config.useVk) {
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
        )"""

c = c.replace(vk_target, vk_repl)
c = c.replace(").then(res => {\n            if (!res.success) mainWindow.webContents.send('upload-progress-vk', { percent: 100, status: 'Ошибка: ' + res.error })\n          })", "")


# TG
tg_target = """if (config.useTg) {
      if (!config.tgBotToken || !config.tgChannelId) {
        mainWindow.webContents.send('upload-progress-tg', { percent: 0, status: 'Ошибка: Нет токена TG' })
      } else {
        promises.push(
          withRetry('Telegram Upload', () => uploadToTelegram("""

tg_repl = """if (config.useTg) {
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
        )"""

c = c.replace(tg_target, tg_repl)
c = c.replace(").then(res => {\n            if (!res.success) mainWindow.webContents.send('upload-progress-tg', { percent: 100, status: 'Ошибка: ' + res.error })\n          })", "")

with open('src/main/upload-controller.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("upload-controller.ts refactored for inline trimming.")
