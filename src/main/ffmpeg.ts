import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import ffprobeInstaller from '@ffprobe-installer/ffprobe'
import fs from 'fs'
import path from 'path'

// Set the path to the static binaries
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
ffmpeg.setFfprobePath(ffprobeInstaller.path)

const MAX_FILE_SIZE_BYTES = 1950 * 1024 * 1024; // 1950 MB

export async function chunkVideoIfNeeded(
  filePath: string,
  onProgress: (percent: number, currentPart: number, totalParts: number) => void
): Promise<string[]> {
  const stats = fs.statSync(filePath)

  // If the file is smaller than the limit, no chunking needed
  if (stats.size <= MAX_FILE_SIZE_BYTES) {
    return [filePath]
  }

  // Calculate roughly how many parts we need
  const totalParts = Math.ceil(stats.size / MAX_FILE_SIZE_BYTES)

  return new Promise((resolve, reject) => {
    // Get total duration first
    ffmpeg.ffprobe(filePath, async (err, metadata) => {
      if (err) {
        return reject(err)
      }

      const totalDuration = metadata.format.duration || 0;
      if (totalDuration === 0) {
        return reject(new Error("Could not determine video duration"))
      }

      // Calculate duration of each chunk (rough estimate based on byte size ratio)
      const chunkDuration = totalDuration / totalParts
      const outputFiles: string[] = []

      const processPart = (partIndex: number) => {
        return new Promise<string>((res, rej) => {
          const startTime = partIndex * chunkDuration
          // Add a little overlap (e.g. 5 seconds) to avoid cutting words abruptly, except for the last part
          const duration = (partIndex === totalParts - 1) ? totalDuration - startTime : chunkDuration + 5

          const ext = path.extname(filePath)
          const baseName = path.basename(filePath, ext)
          const dir = path.dirname(filePath)
          const outPath = path.join(dir, `${baseName}_part${partIndex + 1}${ext}`)

          ffmpeg(filePath)
            .seekInput(startTime)
            .setDuration(duration)
            .outputOptions(['-c copy', '-avoid_negative_ts make_zero'])
            .on('progress', (progress) => {
              // Calculate accurate percentage based on current chunk duration
              const timeParts = progress.timemark ? progress.timemark.split(':') : ['0','0','0']
              const currentSeconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseFloat(timeParts[2])
              let percent = (currentSeconds / duration) * 100
              
              if (percent < 0) percent = 0
              onProgress(Math.min(percent, 100), partIndex + 1, totalParts)
            })
            .on('end', () => {
              res(outPath)
            })
            .on('error', (error) => {
              rej(error)
            })
            .save(outPath)
        })
      }

      try {
        for (let i = 0; i < totalParts; i++) {
          const partPath = await processPart(i)
          outputFiles.push(partPath)
        }
        
        // We no longer delete the original file here because Phase 5 needs it for YouTube/VK uploads.
        // It will be deleted by the master upload controller when ALL uploads finish.
        
        resolve(outputFiles)
      } catch (error) {
        reject(error)
      }
    })
  })
}
