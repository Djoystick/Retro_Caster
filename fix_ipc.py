with open('src/main/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to remove the duplicate tg-validate-token line.
# Let's count them.
count = content.count("ipcMain.handle('tg-validate-token', async (_, token: string) => await validateTgToken(token))")
if count > 1:
    # Remove the LAST occurrence
    parts = content.rsplit("ipcMain.handle('tg-validate-token', async (_, token: string) => await validateTgToken(token))", 1)
    content = "".join(parts)
    
with open('src/main/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed duplicate IPC handler.")
