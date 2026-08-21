import log from 'electron-log/main';
import { app, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { exec as ytExec } from 'yt-dlp-exec'


export function setupDownloadEngine(mainWindow) {
  let activeDownloadProcess: any = null;
  let isCancelled = false;

  app.on('before-quit', () => {
    if (activeDownloadProcess) {
      activeDownloadProcess.kill('SIGINT')
    }
  })

  ipcMain.handle('cancel-download', () => {
    isCancelled = true;
    if (activeDownloadProcess) {
      activeDownloadProcess.kill('SIGINT')
      activeDownloadProcess = null
      return true
    }
    return false
  })

  ipcMain.handle('download-vod', async (_event, url: string, title: string, customDir?: string, startTime?: string, endTime?: string) => {
    isCancelled = false;
    try {
      // Extract Twitch Video ID to ensure filename uniqueness, or use a hash of the URL
      const videoIdMatch = url.match(/videos\/(\d+)/)
      // For deterministic fallback, we just use a basic string hash or base64 of the URL
      const videoId = videoIdMatch ? videoIdMatch[1] : Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 10)

      // Clean up title for filename
      const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50)
      
      const targetDir = customDir || path.join(os.tmpdir(), 'RetroCaster_Downloads')
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }
      const outputPath = path.join(targetDir, `${safeTitle}_${videoId}.mp4`)
      
      const args: any = {
        format: 'best[ext=mp4]/best',
        output: outputPath,
        noWarnings: true,
        noCheckCertificate: true,
        forceIpv4: true,
        newline: true, // Force newline to avoid carriage return overlapping
        concurrentFragments: 4 // Speed up download
      }

      if (startTime || endTime) {
        const start = startTime || '00:00:00'
        const end = endTime || 'inf'
        args.downloadSections = `*${start}-${end}`
      }

      const attemptDownload = (attemptNumber: number) => {
        return new Promise((resolve) => {
          activeDownloadProcess = ytExec(url, args)
          let maxProgress = 0
          
          activeDownloadProcess.stdout?.on('data', (data) => {
            if (!mainWindow || mainWindow.isDestroyed()) return;
            const text = data.toString()
            const lines = text.replace(/\r/g, '\n').split('\n')
            for (let i = lines.length - 1; i >= 0; i--) {
              const line = lines[i]
              if (line.includes('[download]') && line.includes('%')) {
                const match = line.match(/([\d.]+)%/)
                const speedMatch = line.match(/at\s+([~]?[\d.]+[a-zA-Z]+\/s)/)
                if (match && match[1]) {
                  const percent = parseFloat(match[1])
                  if (percent >= maxProgress) {
                    maxProgress = percent
                    const speed = speedMatch ? speedMatch[1] : ''
                    mainWindow.webContents.send('download-progress', { percent, status: attemptNumber > 1 ? `Попытка ${attemptNumber}/3...` : 'Downloading...', speed })
                  }
                  break
                }
              }
              else if (line.includes('[Merger]')) {
                mainWindow.webContents.send('download-progress', { percent: 100, status: 'Склейка аудио и видео (FFMPEG)...', speed: '' })
                break
              }
              else if (line.includes('[Fixup')) {
                mainWindow.webContents.send('download-progress', { percent: 100, status: 'Финальная обработка (FFMPEG)...', speed: '' })
                break
              }
              else if (line.includes('[ExtractAudio]')) {
                mainWindow.webContents.send('download-progress', { percent: 100, status: 'Извлечение аудио...', speed: '' })
                break
              }
            }
          })

          activeDownloadProcess.stderr?.on('data', (data) => {
            log.error('yt-dlp error:', data.toString())
          })

          activeDownloadProcess.on('close', (code) => {
            activeDownloadProcess = null
            if (code === 0) {
              resolve({ success: true, filePath: outputPath })
            } else {
              resolve({ success: false, error: 'Download failed' })
            }
          })
        })
      }

      let res: any = { success: false }
      const maxAttempts = 3
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (isCancelled) break
        
        if (attempt > 1 && mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('download-progress', { percent: 0, status: `Ожидание перед попыткой ${attempt}/${maxAttempts}...`, speed: '' })
          await new Promise(r => setTimeout(r, 5000))
        }
        
        if (isCancelled) break
        res = await attemptDownload(attempt)
        
        if (res.success) break
      }

      if (res.success) {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('download-progress', { percent: 100, status: 'Успех!' })
        }
        return res
      } else {
        return { success: false, error: isCancelled ? 'Отменено пользователем' : `Сбой после ${maxAttempts} попыток скачивания` }
      }

    } catch (error: any) {
      activeDownloadProcess = null
      log.error('Download error:', error)
      return { success: false, error: error.message || 'Download failed' }
    }
  })
}
