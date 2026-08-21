import { processMissionXP } from './gamification';
import log from 'electron-log/main';
import { uploadToYouTube } from './youtube'
import { uploadToVK } from './vk'
import { uploadToTelegram } from './telegram-upload'
import fs from 'fs'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'

export interface TrimConfig {
  start: string;
  end: string;
}
import { addHistoryRecord } from './store'

export interface UploadConfig {
  useYt: boolean
  ytTrim?: TrimConfig
  useVk: boolean
  vkTrim?: TrimConfig
  useTg: boolean
  tgTrim?: TrimConfig
  autoDelete: boolean
  thumbnailUrl?: string

  ytClientId?: string
  ytClientSecret?: string
  ytRefreshToken?: string

  vkToken?: string
  vkGroupId?: string
  vkPostToWall?: boolean

  tgBotToken?: string
  tgChannelId?: string
  tgTopicId?: string
}

async function withRetry(
  taskName: string,
  taskFn: () => Promise<{success: boolean, error?: string}>,
  onRetry: (attempt: number) => void,
  maxAttempts: number = 3
): Promise<{success: boolean, error?: string}> {
  let lastErr = '';
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const res = await taskFn();
      if (res.success) return res;
      lastErr = res.error || 'Unknown error';
    } catch (e: any) {
      lastErr = e.message || String(e);
    }
    
    if (i < maxAttempts) {
      log.warn(`[RETRY] ${taskName} failed (attempt ${i}/${maxAttempts}). Error: ${lastErr}`);
      onRetry(i + 1);
      await new Promise(r => setTimeout(r, 8000));
    }
  }
  return { success: false, error: lastErr };
}


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

export async function executeMasterUpload(
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
          config.ytClientId!, config.ytClientSecret!, config.ytRefreshToken!, targetPath, title, config.thumbnailUrl,
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
          config.vkToken!, targetPath, title, config.vkGroupId || '', config.vkPostToWall ?? true,
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
          config.tgBotToken!, config.tgChannelId!, config.tgTopicId || '', targetPath, title,
          (percent, status) => { mainWindow.webContents.send('upload-progress-tg', { percent, status }) }
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
  })
}
