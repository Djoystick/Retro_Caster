import re

with open('src/main/index.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Find: `mainWindow.webContents.setWindowOpenHandler((details) => {`
# And above it, `mainWindow.on('ready-to-show', () => {`
pattern = r"mainWindow\.on\('ready-to-show', \(\) => \{(.*?)\}\)"

def replacer(match):
    inner = match.group(1)
    if "checkAchievements" not in inner:
        return f"mainWindow.on('ready-to-show', () => {{{inner}\n    require('./gamification').checkAchievements(mainWindow);\n  }})"
    return match.group(0)

c = re.sub(pattern, replacer, c, flags=re.DOTALL)

with open('src/main/index.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("index.ts patched to check achievements on load.")
