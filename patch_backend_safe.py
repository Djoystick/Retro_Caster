import os

def modify_upload_controller():
    with open('src/main/upload-controller.ts', 'r', encoding='utf-8') as f:
        c = f.read()

    # Add thumbnailUrl
    if "thumbnailUrl?: string" not in c:
        c = c.replace(
            "autoDelete: boolean",
            "autoDelete: boolean\n  thumbnailUrl?: string"
        )
    
    # Update uploadToYouTube call
    # Find: `config.ytClientId!, config.ytClientSecret!, config.ytRefreshToken!, targetPath, title,`
    c = c.replace(
        "config.ytRefreshToken!, targetPath, title,",
        "config.ytRefreshToken!, targetPath, title, config.thumbnailUrl,"
    )
    with open('src/main/upload-controller.ts', 'w', encoding='utf-8') as f:
        f.write(c)

def modify_youtube():
    with open('src/main/youtube.ts', 'r', encoding='utf-8') as f:
        c = f.read()

    # Add imports
    if "import axios" not in c:
        c = "import axios from 'axios'\nimport os from 'os'\nimport path from 'path'\n" + c

    # Update signature
    c = c.replace(
        "videoPath: string,\n  title: string,\n  onProgress: (percent: number, status: string) => void\n)",
        "videoPath: string,\n  title: string,\n  thumbnailUrl: string | undefined,\n  onProgress: (percent: number, status: string) => void\n)"
    )

    # We need to change `await youtube.videos.insert` to `const res = await youtube.videos.insert`
    c = c.replace("await youtube.videos.insert(", "const res = await youtube.videos.insert(")
    
    # Then after `);` that corresponds to `youtube.videos.insert`
    # We can inject our logic right before `onProgress(100, 'Завершено!');`
    
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
"""
    c = c.replace("onProgress(100, 'Завершено!');", thumb_logic + "\n          onProgress(100, 'Завершено!');")

    with open('src/main/youtube.ts', 'w', encoding='utf-8') as f:
        f.write(c)

modify_upload_controller()
modify_youtube()
print("Safely patched.")
