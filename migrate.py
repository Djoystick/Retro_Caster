with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "ytRefreshToken: localStorage.getItem('ytRefreshToken'),", 
    "ytRefreshToken: await (window as any).api.secureStoreGet('ytRefreshToken') || localStorage.getItem('ytRefreshToken'),"
)
c = c.replace(
    "vkToken: vkToken,", 
    "vkToken: await (window as any).api.secureStoreGet('vkToken') || vkToken,"
)
c = c.replace(
    "tgBotToken: localStorage.getItem('tgBotToken'),", 
    "tgBotToken: await (window as any).api.secureStoreGet('tgBotToken') || localStorage.getItem('tgBotToken'),"
)
c = c.replace(
    "tgChannelId: localStorage.getItem('tgChannelId'),", 
    "tgChannelId: await (window as any).api.secureStoreGet('tgChannelId') || localStorage.getItem('tgChannelId'),"
)
# Save
c = c.replace("localStorage.setItem('tgBotToken', tempTgBotToken)", "localStorage.setItem('tgBotToken', tempTgBotToken); (window as any).api.secureStoreSet('tgBotToken', tempTgBotToken)")
c = c.replace("localStorage.setItem('vkToken', tempVkToken)", "localStorage.setItem('vkToken', tempVkToken); (window as any).api.secureStoreSet('vkToken', tempVkToken)")
c = c.replace("localStorage.setItem('ytRefreshToken', res.refreshToken);", "localStorage.setItem('ytRefreshToken', res.refreshToken); (window as any).api.secureStoreSet('ytRefreshToken', res.refreshToken);")


with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Tokens patched securely!")
