import log from 'electron-log/main';
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import fs from 'fs'
import path from 'path'
import { chunkVideoIfNeeded } from './ffmpeg'

const API_ID = 2040 // Telegram Desktop public API ID
const API_HASH = 'b18441a1ff607e10a989891a5462e627'

export async function uploadToTelegram(
  botToken: string,
  chatIdStr: string,
  topicIdStr: string,
  videoPath: string,
  caption: string,
  onProgress: (percent: number, status: string) => void
) {
  let client: TelegramClient | null = null

  try {
    onProgress(0, 'Подготовка (Нарезка видео)...')
    
    // 1. Chunk the video if it exceeds 1950MB
    const videoParts = await chunkVideoIfNeeded(videoPath, (percent, current, total) => {
      onProgress(0, `Нарезка видео: Часть ${current} из ${total} (${Math.round(percent)}%)`)
    })
    
    onProgress(0, 'Авторизация в Telegram (MTProto)...')
    
    // 2. Initialize GramJS client
    const stringSession = new StringSession('')
    client = new TelegramClient(stringSession, API_ID, API_HASH, {
      connectionRetries: 5,
      useWSS: false,
    })
    
    await client.start({
      botAuthToken: botToken
    })

    // Prepare target Peer
    let targetPeer: any = chatIdStr
    // If it's a numeric ID (like -100123456789), convert to big int
    if (/^-?\d+$/.test(chatIdStr)) {
      targetPeer = BigInt(chatIdStr)
    }

    const uploadedFiles: any[] = []
    
    // 3. Upload each part to Telegram servers sequentially
    for (let i = 0; i < videoParts.length; i++) {
      const partPath = videoParts[i]
      const stat = fs.statSync(partPath)
      
      onProgress(Math.round((i / videoParts.length) * 100), `Загрузка части ${i+1}/${videoParts.length} на сервер Telegram...`)
      
      const { CustomFile } = require('telegram/client/uploads')
      const file = new CustomFile(path.basename(partPath), stat.size, partPath)
      
      const uploaded = await client.uploadFile({
        file: file,
        workers: 2,
        onProgress: (progress: number) => {
          const partPercent = progress * 100
          // Calculate global progress across all parts
          const globalPercent = ((i * 100) + partPercent) / videoParts.length
          onProgress(Math.round(globalPercent), `Загрузка части ${i+1}/${videoParts.length} (${Math.round(partPercent)}%)`)
        }
      })
      
      uploadedFiles.push({ uploaded, path: partPath })
    }
    
    onProgress(100, 'Отправка альбома в канал...')

    // 4. Send as an album if multiple parts, or single if 1 part
    await client.sendFile(targetPeer, {
      file: uploadedFiles.map(f => f.uploaded),
      caption: caption,
      replyTo: topicIdStr && topicIdStr.trim() !== '' ? parseInt(topicIdStr.trim()) : undefined
    })

    onProgress(100, 'Успешно!')
    
    // Disconnect
    await client.disconnect()
    
    // Clean up sliced chunks (we do NOT delete the original full video here, the master controller does that)
    if (videoParts.length > 1) {
      for (const part of videoParts) {
        if (fs.existsSync(part)) fs.unlinkSync(part)
      }
    }
    
    return { success: true }
    
  } catch (error: any) {
    if (client) await client.disconnect()
    log.error('Telegram upload error:', error)
    return { success: false, error: error.message }
  }
}
