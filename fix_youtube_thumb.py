import re

with open('src/main/youtube.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# I will find `const res = await youtube.videos.insert` and then insert thumbnail logic right before `break;`
thumb_logic = """
          // Thumbnail upload
          if (thumbnailUrl && res.data.id) {
            try {
              onProgress(100, 'Загрузка обложки стрима...');
              const thumbRes = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
              const tempThumbPath = path.join(os.tmpdir(), `thumb_${Date.now()}.jpg`);
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
          break; // Success, exit loop"""

c = c.replace("break; // Success, exit loop", thumb_logic)

with open('src/main/youtube.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("youtube.ts patched.")
