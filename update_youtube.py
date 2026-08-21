import re

with open('src/main/youtube.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add axios if not present to download the thumbnail
if "import axios" not in c:
    c = "import axios from 'axios'\nimport os from 'os'\nimport path from 'path'\n" + c

# 2. Update signature
old_sig = """export async function uploadToYouTube(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  videoPath: string,
  title: string,
  onProgress: (percent: number, status: string) => void
)"""

new_sig = """export async function uploadToYouTube(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  videoPath: string,
  title: string,
  thumbnailUrl: string | undefined,
  onProgress: (percent: number, status: string) => void
)"""

c = c.replace(old_sig, new_sig)

# 3. Add thumbnail upload logic after `youtube.videos.insert`
old_insert = """          await youtube.videos.insert(
            {
              part: ['snippet', 'status'],
              requestBody: {
                snippet: {
                  title: title || 'Twitch VOD Upload',
                  description: 'Uploaded by RetroCaster',
                  tags: ['twitch', 'vod', 'retrocaster'],
                  categoryId: '20'
                },
                status: {
                  privacyStatus: 'private'
                }
              },
              media: {
                body: fs.createReadStream(videoPath)
              }
            },
            {
              onUploadProgress: (evt) => {
                const progress = Math.round((evt.bytesRead / fileSize) * 100);
                onProgress(progress, 'Загрузка видео на YouTube...');
              }
            }
          );
          
          onProgress(100, 'Завершено!');
          return { success: true };"""

new_insert = """          const res = await youtube.videos.insert(
            {
              part: ['snippet', 'status'],
              requestBody: {
                snippet: {
                  title: title || 'Twitch VOD Upload',
                  description: 'Uploaded by RetroCaster',
                  tags: ['twitch', 'vod', 'retrocaster'],
                  categoryId: '20'
                },
                status: {
                  privacyStatus: 'private'
                }
              },
              media: {
                body: fs.createReadStream(videoPath)
              }
            },
            {
              onUploadProgress: (evt) => {
                const progress = Math.round((evt.bytesRead / fileSize) * 100);
                onProgress(progress, 'Загрузка видео на YouTube...');
              }
            }
          );
          
          // Thumbnail upload
          if (thumbnailUrl && res.data.id) {
            try {
              onProgress(100, 'Загрузка обложки стрима...');
              const thumbRes = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
              const tempThumbPath = path.join(os.tmpdir(), `thumb_${Date.now()}.jpg`);
              fs.writeFileSync(tempThumbPath, thumbRes.data);
              
              await youtube.thumbnails.set({
                videoId: res.data.id,
                media: {
                  body: fs.createReadStream(tempThumbPath)
                }
              });
              
              fs.unlinkSync(tempThumbPath);
            } catch (err) {
              console.error('Thumbnail upload failed:', err);
              // non-fatal error
            }
          }
          
          onProgress(100, 'Завершено!');
          return { success: true, videoId: res.data.id };"""

c = c.replace(old_insert, new_insert)

with open('src/main/youtube.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("youtube.ts updated with thumbnail support.")
