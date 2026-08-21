import re

with open('src/preload/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """    getHistory: () => ipcRenderer.invoke('get-history'),
    secureStoreGet: (key: string) => ipcRenderer.invoke('secure-store-get', key),
    secureStoreSet: (key: string, value: string) => ipcRenderer.invoke('secure-store-set', key, value),"""

content = content.replace("    getHistory: () => ipcRenderer.invoke('get-history'),", replacement)

with open('src/preload/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("preload updated")
