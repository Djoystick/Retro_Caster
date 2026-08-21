import re

with open('src/main/gamification.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix gamification.ts
if "import { awardXP } from './store'" not in c:
    c = c.replace("import store from './store'", "import store, { awardXP } from './store'")
c = c.replace("const { awardXP } = require('./store')", "")

with open('src/main/gamification.ts', 'w', encoding='utf-8') as f:
    f.write(c)


with open('src/main/index.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix index.ts
if "setEquippedShip" not in c.split("import {")[1].split("}")[0]:
    c = c.replace(
        "import { getGamification, getHistory, getSecureToken, setSecureToken } from './store'",
        "import { getGamification, getHistory, getSecureToken, setSecureToken, setEquippedShip } from './store'"
    )
c = c.replace("const { setEquippedShip } = require('./store')", "")

with open('src/main/index.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("Dynamic requires fixed.")
