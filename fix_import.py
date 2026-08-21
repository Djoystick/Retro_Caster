import re

with open('src/main/index.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the bad require
c = c.replace("require('./gamification').checkAchievements(mainWindow);", "checkAchievements(mainWindow);")

# Add the import at the top if not exists
if "import { checkAchievements } from './gamification'" not in c:
    c = c.replace(
        "import { getGamification, getHistory, getSecureToken, setSecureToken } from './store'",
        "import { getGamification, getHistory, getSecureToken, setSecureToken } from './store'\nimport { checkAchievements } from './gamification'"
    )

with open('src/main/index.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("index.ts fixed.")
