import re

with open('src/main/upload-controller.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add thumbnailUrl to UploadConfig
if "thumbnailUrl?: string" not in c:
    c = c.replace(
        "autoDelete: boolean\n",
        "autoDelete: boolean\n  thumbnailUrl?: string\n"
    )

# 2. Update uploadToYouTube call
c = c.replace(
    "config.ytClientSecret!,\n            config.ytRefreshToken!,\n            targetPath,\n            title,\n            (percent, status) => { mainWindow.webContents.send('upload-progress-yt', { percent, status }) }\n          )",
    "config.ytClientSecret!,\n            config.ytRefreshToken!,\n            targetPath,\n            title,\n            config.thumbnailUrl,\n            (percent, status) => { mainWindow.webContents.send('upload-progress-yt', { percent, status }) }\n          )"
)

with open('src/main/upload-controller.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("upload-controller.ts updated.")
