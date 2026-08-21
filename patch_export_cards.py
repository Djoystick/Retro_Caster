import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace YT
yt_pattern = r"<PixelCheckbox\s+label=\{t\('upload_yt'\)\}\s+checked=\{useYt\}\s+onChange=\{[^\}]+\}\s+icon=\{UploadCloud\}\s+/>"
yt_repl = """<PlatformExportCard 
                            label={t('upload_yt')} checked={useYt} onChange={setUseYt} icon={UploadCloud}
                            trimEnabled={ytTrimEnabled} onTrimToggle={setYtTrimEnabled}
                            trimStart={ytTrimStart} onTrimStartChange={setYtTrimStart}
                            trimEnd={ytTrimEnd} onTrimEndChange={setYtTrimEnd}
                          />"""
c = re.sub(yt_pattern, yt_repl, c)

# Replace VK
vk_pattern = r"<PixelCheckbox\s+label=\{t\('upload_vk'\)\}\s+checked=\{useVk\}\s+onChange=\{[^\}]+\}\s+icon=\{UploadCloud\}\s+/>"
vk_repl = """<PlatformExportCard 
                            label={t('upload_vk')} checked={useVk} onChange={setUseVk} icon={UploadCloud}
                            trimEnabled={vkTrimEnabled} onTrimToggle={setVkTrimEnabled}
                            trimStart={vkTrimStart} onTrimStartChange={setVkTrimStart}
                            trimEnd={vkTrimEnd} onTrimEndChange={setVkTrimEnd}
                          />"""
c = re.sub(vk_pattern, vk_repl, c)

# Replace TG
tg_pattern = r"<PixelCheckbox\s+label=\{t\('upload_tg'\)\}\s+checked=\{useTg\}\s+onChange=\{[^\}]+\}\s+icon=\{UploadCloud\}\s+/>"
tg_repl = """<PlatformExportCard 
                            label={t('upload_tg')} checked={useTg} onChange={setUseTg} icon={UploadCloud}
                            trimEnabled={tgTrimEnabled} onTrimToggle={setTgTrimEnabled}
                            trimStart={tgTrimStart} onTrimStartChange={setTgTrimStart}
                            trimEnd={tgTrimEnd} onTrimEndChange={setTgTrimEnd}
                          />"""
c = re.sub(tg_pattern, tg_repl, c)

# Also remove the "ОБРЕЗКА" WIP item from navItems
nav_pattern = r"\{ id: 'trim',\s+Icon: Scissors,\s+label: 'ОБРЕЗКА',\s+active: false \},\s*"
c = re.sub(nav_pattern, "", c)
# And its click handler part
c = re.sub(r"id === 'trim' && <span className=\"absolute top-1 right-1 text-\[5px\] text-pixel-amber\">WIP</span>\}", "", c)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx properly patched.")
