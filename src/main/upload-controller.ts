import { processMissionXP } from './gamification';
import log from 'electron-log/main';
import { uploadToYouTube } from './youtube'
import { uploadToVK } from './vk'
import { uploadToTelegram } from './telegram-upload'
import fs from 'fs'
import { addHistoryRecord } from './store'

export interface UploadConfig {
  useYt: boolean
  useVk: boolean
  useTg: boolean
  autoDelete: boolean

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
      promises.push(
        withRetry('YouTube Upload', () => uploadToYouTube(
          config.ytClientId!, config.ytClientSecret!, config.ytRefreshToken!, videoPath, title,
          (percent, status) => { mainWindow.webContents.send('upload-progress-yt', { percent, status }) }
        ), (attempt) => {
          mainWindow.webContents.send('upload-progress-yt', { percent: 0, status: `Повторная попытка ${attempt}/3...` })
        }).then(res => {
          if (!res.success) mainWindow.webContents.send('upload-progress-yt', { percent: 100, status: 'Ошибка: ' + res.error })
        }).catch(err => {
          log.error('YouTube upload error:', err)
          mainWindow.webContents.send('upload-progress-yt', { percent: 100, status: 'Сбой: ' + (err.message || 'Критическая ошибка') })
        })
      )
    }
  }

  if (config.useVk) {
    if (!config.vkToken) {
      mainWindow.webContents.send('upload-progress-vk', { percent: 0, status: 'Ошибка: Необходима авторизация' })
    } else {
      log.info(`[OOM TRACE] Starting VK upload for ${videoPath}`);
      promises.push(
        withRetry('VK Upload', () => uploadToVK(
          config.vkToken!, videoPath, title, config.vkGroupId || '', config.vkPostToWall ?? true,
          (percent, status) => { mainWindow.webContents.send('upload-progress-vk', { percent, status }) }
        ), (attempt) => {
          mainWindow.webContents.send('upload-progress-vk', { percent: 0, status: `Повторная попытка ${attempt}/3...` })
        }).then(res => {
          if (!res.success) mainWindow.webContents.send('upload-progress-vk', { percent: 100, status: 'Ошибка: ' + res.error })
        }).catch(err => {
          log.error('VK upload error:', err)
          mainWindow.webContents.send('upload-progress-vk', { percent: 100, status: 'Сбой: ' + (err.message || 'Критическая ошибка') })
        })
      )
    }
  }

  if (config.useTg) {
    if (!config.tgBotToken || !config.tgChannelId) {
      mainWindow.webContents.send('upload-progress-tg', { percent: 0, status: 'Ошибка: Заполните данные бота и канала' })
    } else {
      log.info(`[OOM TRACE] Starting Telegram upload for ${videoPath}`);
      promises.push(
        withRetry('Telegram Upload', () => uploadToTelegram(
          config.tgBotToken!, config.tgChannelId!, config.tgTopicId || '', videoPath, title,
          (percent, status) => { mainWindow.webContents.send('upload-progress-tg', { percent, status }) }
        ), (attempt) => {
          mainWindow.webContents.send('upload-progress-tg', { percent: 0, status: `Повторная попытка ${attempt}/3...` })
        }).then(res => {
          if (!res.success) mainWindow.webContents.send('upload-progress-tg', { percent: 100, status: 'Ошибка: ' + res.error })
        }).catch(err => {
          log.error('Telegram upload error:', err)
          mainWindow.webContents.send('upload-progress-tg', { percent: 100, status: 'Сбой: ' + (err.message || 'Критическая ошибка') })
        })
      )
    }
  }

  let successPlatforms: ('youtube' | 'vk' | 'telegram')[] = []
  if (config.useYt) successPlatforms.push('youtube')
  if (config.useVk) successPlatforms.push('vk')
  if (config.useTg) successPlatforms.push('telegram')

  if (promises.length > 0) {
    await Promise.all(promises)
  }

  
  
  // assuming duration is unknown here, we pass 0, and we don't have retry logic yet so isSurvivor = false
  let xpGained = processMissionXP(mainWindow, successPlatforms, 0, false);


  addHistoryRecord({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    title: title,
    duration: 'N/A', 
    platforms: successPlatforms,
    xpGained: xpGained
  })

  if (config.autoDelete) {
    try {
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath)
        log.info('Original video deleted successfully:', videoPath)
      }
    } catch (err) {
      log.error('Failed to auto-delete video:', err)
    }
  }

  return { success: true, xpGained }
}
