import re

# Fix upload-controller.ts
with open('src/main/upload-controller.ts', 'r', encoding='utf-8') as f:
    c = f.read()

pattern_controller = r"uploadToYouTube\(\s*config\.ytClientId!,\s*config\.ytClientSecret!,\s*config\.ytRefreshToken!,\s*targetPath,\s*title,\s*\(percent,\s*status\)\s*=>\s*\{.*?\}"
replacement_controller = """uploadToYouTube(
          config.ytClientId!, config.ytClientSecret!, config.ytRefreshToken!, targetPath, title, config.thumbnailUrl,
          (percent, status) => { mainWindow.webContents.send('upload-progress-yt', { percent, status }) }
        """

c = re.sub(pattern_controller, replacement_controller, c, flags=re.DOTALL)
# wait, the regex replaced `(percent, status) => { ... }`, so I should add `)` at the end
replacement_controller = """uploadToYouTube(
          config.ytClientId!, config.ytClientSecret!, config.ytRefreshToken!, targetPath, title, config.thumbnailUrl,
          (percent, status) => { mainWindow.webContents.send('upload-progress-yt', { percent, status }) }
        )"""
c = re.sub(pattern_controller, replacement_controller, c, flags=re.DOTALL)

with open('src/main/upload-controller.ts', 'w', encoding='utf-8') as f:
    f.write(c)

# Fix youtube.ts
with open('src/main/youtube.ts', 'r', encoding='utf-8') as f:
    cy = f.read()

# I need to find `await youtube.videos.insert(...)` and replace it
# To be absolutely sure, I'll find `youtube.videos.insert` to the end of the `try` block.

pattern_yt = r"await youtube\.videos\.insert\([\s\S]+?return \{ success: true \};"

replacement_yt = """const res = await youtube.videos.insert(
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
              body: require('fs').createReadStream(videoPath)
            }
          },
          {
            onUploadProgress: (evt) => {
              const progress = Math.round((evt.bytesRead / fileSize) * 100);
              onProgress(progress, 'Загрузка видео на YouTube...');
            }
          }
        );
        
        if (thumbnailUrl && res.data.id) {
          try {
            onProgress(100, 'Загрузка обложки стрима...');
            const thumbRes = await require('axios').get(thumbnailUrl, { responseType: 'arraybuffer' });
            const tempThumbPath = require('path').join(require('os').tmpdir(), `thumb_${Date.now()}.jpg`);
            require('fs').writeFileSync(tempThumbPath, thumbRes.data);
            
            await youtube.thumbnails.set({
              videoId: res.data.id,
              media: {
                body: require('fs').createReadStream(tempThumbPath)
              }
            });
            
            require('fs').unlinkSync(tempThumbPath);
          } catch (err) {
            console.error('Thumbnail upload failed:', err);
          }
        }
        
        onProgress(100, 'Завершено!');
        return { success: true };"""

cy = re.sub(pattern_yt, replacement_yt, cy)

with open('src/main/youtube.ts', 'w', encoding='utf-8') as f:
    f.write(cy)

print("Files patched.")
