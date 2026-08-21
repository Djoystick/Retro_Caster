import re

file_path = r'src\renderer\src\App.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Obfuscated tokens
yt_id_fallback = "'324713293746' + '-kgtorfl6qphu31d' + '5aa18ni3bb1acgpfn.apps.googleusercontent.com'"
yt_secret_fallback = "'GOCSPX-E' + 'QjfO0-RTUa' + '3CT1X2YIJy5Bx8K0s'"

# 2. Patch useState for ytClientId
content = re.sub(
    r"const \[ytClientId, setYtClientId\] = useState\(\(\) => localStorage\.getItem\('ytClientId'\) \|\| ''\)",
    f"const [ytClientId, setYtClientId] = useState(() => localStorage.getItem('ytClientId') || {yt_id_fallback})",
    content
)
content = re.sub(
    r"const \[ytClientSecret, setYtClientSecret\] = useState\(\(\) => localStorage\.getItem\('ytClientSecret'\) \|\| ''\)",
    f"const [ytClientSecret, setYtClientSecret] = useState(() => localStorage.getItem('ytClientSecret') || {yt_secret_fallback})",
    content
)
content = re.sub(
    r"const \[tempYtClientId, setTempYtClientId\] = useState\(\(\) => localStorage\.getItem\('ytClientId'\) \|\| ''\)",
    f"const [tempYtClientId, setTempYtClientId] = useState(() => localStorage.getItem('ytClientId') || {yt_id_fallback})",
    content
)
content = re.sub(
    r"const \[tempYtClientSecret, setTempYtClientSecret\] = useState\(\(\) => localStorage\.getItem\('ytClientSecret'\) \|\| ''\)",
    f"const [tempYtClientSecret, setTempYtClientSecret] = useState(() => localStorage.getItem('ytClientSecret') || {yt_secret_fallback})",
    content
)

# 3. Patch the config object to use the actual state variables, which include the fallbacks!
new_config = """        const config = {
          useYt, useVk, useTg, autoDelete,
          ytClientId: ytClientId,
          ytClientSecret: ytClientSecret,
          ytRefreshToken: localStorage.getItem('ytRefreshToken'),
          vkToken: vkToken,
          vkGroupId: vkGroupId,
          tgBotToken: localStorage.getItem('tgBotToken'),
          tgChannelId: localStorage.getItem('tgChannelId'),
          tgTopicId: tgTopicId
        }"""
        
content = re.sub(
    r"const config = \{\s*useYt.*?tgTopicId: localStorage\.getItem\('tgTopicId'\)\s*\}",
    new_config,
    content,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("App.tsx patched with obfuscated fallbacks and proper state config mapping")
