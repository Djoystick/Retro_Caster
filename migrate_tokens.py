import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace synchronous localStorage initialization with empty strings for tokens
c = c.replace("const [vkToken, setVkToken] = useState(localStorage.getItem('vkToken') || '')", "const [vkToken, setVkToken] = useState('')")
c = c.replace("const [tgBotToken, setTgBotToken] = useState(localStorage.getItem('tgBotToken') || '')", "const [tgBotToken, setTgBotToken] = useState('')")
c = c.replace("const [tgChannelId, setTgChannelId] = useState(localStorage.getItem('tgChannelId') || '')", "const [tgChannelId, setTgChannelId] = useState('')")
c = c.replace("const [vkGroupId, setVkGroupId] = useState(localStorage.getItem('vkGroupId') || '')", "const [vkGroupId, setVkGroupId] = useState('')")

# Add a useEffect to load tokens asynchronously from secure store
effect_code = """
  // Load secure tokens on mount
  useEffect(() => {
    async function loadTokens() {
      const api = (window as any).api;
      if (api.secureStoreGet) {
        const vk = await api.secureStoreGet('vkToken'); if (vk) setVkToken(vk);
        const vkG = await api.secureStoreGet('vkGroupId'); if (vkG) setVkGroupId(vkG);
        const tgB = await api.secureStoreGet('tgBotToken'); if (tgB) setTgBotToken(tgB);
        const tgC = await api.secureStoreGet('tgChannelId'); if (tgC) setTgChannelId(tgC);
      }
    }
    loadTokens();
  }, [])
"""

c = c.replace("useEffect(() => {\n    // Load init data", effect_code + "\n  useEffect(() => {\n    // Load init data")

# Replace localStorage.setItem with secureStoreSet
c = re.sub(r"localStorage\.setItem\('vkToken',\s*([^)]+)\)", r"(window as any).api.secureStoreSet('vkToken', \1)", c)
c = re.sub(r"localStorage\.setItem\('vkGroupId',\s*([^)]+)\)", r"(window as any).api.secureStoreSet('vkGroupId', \1)", c)
c = re.sub(r"localStorage\.setItem\('tgBotToken',\s*([^)]+)\)", r"(window as any).api.secureStoreSet('tgBotToken', \1)", c)
c = re.sub(r"localStorage\.setItem\('tgChannelId',\s*([^)]+)\)", r"(window as any).api.secureStoreSet('tgChannelId', \1)", c)
c = re.sub(r"localStorage\.setItem\('ytRefreshToken',\s*([^)]+)\)", r"(window as any).api.secureStoreSet('ytRefreshToken', \1)", c)

# In the config block, we need to pass tokens from state instead of localStorage!
# Currently: tgBotToken: localStorage.getItem('tgBotToken') -> tgBotToken: tgBotToken
c = c.replace("tgBotToken: localStorage.getItem('tgBotToken')", "tgBotToken: tgBotToken")
c = c.replace("tgChannelId: localStorage.getItem('tgChannelId')", "tgChannelId: tgChannelId")
# YT uses localStorage.getItem('ytRefreshToken') inline in App.tsx
c = c.replace("ytRefreshToken: localStorage.getItem('ytRefreshToken')", "ytRefreshToken: await (window as any).api.secureStoreGet('ytRefreshToken')")

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx token migration complete.")
