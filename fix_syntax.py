import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("                          </span>\n                          {\n                        {id === 'queue'", "                          </span>\n                        {id === 'queue'")

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Syntax fixed.")
