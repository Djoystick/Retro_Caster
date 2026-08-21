import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. State for trimming
trim_states = """  // Trimming State
  const [ytTrimEnabled, setYtTrimEnabled] = useState(false)
  const [ytTrimStart, setYtTrimStart] = useState('00:00:00')
  const [ytTrimEnd, setYtTrimEnd] = useState('00:00:00')

  const [vkTrimEnabled, setVkTrimEnabled] = useState(false)
  const [vkTrimStart, setVkTrimStart] = useState('00:00:00')
  const [vkTrimEnd, setVkTrimEnd] = useState('00:00:00')

  const [tgTrimEnabled, setTgTrimEnabled] = useState(false)
  const [tgTrimStart, setTgTrimStart] = useState('00:00:00')
  const [tgTrimEnd, setTgTrimEnd] = useState('00:00:00')
"""
c = c.replace("const [useTg, setUseTg] = useState(true)", "const [useTg, setUseTg] = useState(true)\n" + trim_states)

# 2. Update addToQueue config
old_config = """config: {
        useYt, useVk, useTg, autoDelete
      },"""
new_config = """config: {
        useYt, ytTrim: ytTrimEnabled ? { start: ytTrimStart, end: ytTrimEnd } : undefined,
        useVk, vkTrim: vkTrimEnabled ? { start: vkTrimStart, end: vkTrimEnd } : undefined,
        useTg, tgTrim: tgTrimEnabled ? { start: tgTrimStart, end: tgTrimEnd } : undefined,
        autoDelete
      },"""
c = c.replace(old_config, new_config)

# 3. Add PlatformExportCard component above PixelCheckbox
platform_card_code = """// Platform Export Card with Inline Trimming
const PlatformExportCard = ({ label, checked, onChange, icon: Icon, trimEnabled, onTrimToggle, trimStart, onTrimStartChange, trimEnd, onTrimEndChange }: any) => {
  return (
    <div className={`flex flex-col border-2 transition-colors ${checked ? 'bg-pixel-darkblue/20 border-pixel-blue' : 'bg-black/30 border-transparent hover:bg-black/50'}`}>
      <div 
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => onChange(!checked)}
      >
        <div className={`w-6 h-6 border-2 flex items-center justify-center shrink-0 ${checked ? 'border-pixel-green bg-pixel-darkgreen text-pixel-dark' : 'border-gray-500 bg-black'}`}>
          {checked && <Check size={16} strokeWidth={4} />}
        </div>
        <Icon size={18} className={checked ? "text-pixel-light" : "text-gray-500"} />
        <span className={`text-sm flex-1 ${checked ? 'text-pixel-light' : 'text-gray-400'}`}>{label}</span>
        
        {checked && (
          <button 
            onClick={(e) => { e.stopPropagation(); onTrimToggle(!trimEnabled); }}
            className={`flex items-center gap-2 px-2 py-1 border rounded text-[10px] transition-colors ${trimEnabled ? 'border-pixel-amber text-pixel-amber bg-pixel-amber/10' : 'border-gray-600 text-gray-400 hover:text-pixel-light'}`}
          >
            <Scissors size={12} />
            {trimEnabled ? 'ОБРЕЗКА ВКЛ' : 'ОБРЕЗАТЬ'}
          </button>
        )}
      </div>
      
      {checked && trimEnabled && (
        <div className="flex items-center gap-4 p-3 pt-0 border-t border-pixel-blue/30 mt-1">
          <div className="flex items-center gap-2 text-pixel-amber text-[10px]">
            <span>СТАРТ:</span>
            <input 
              type="text" 
              value={trimStart} 
              onChange={(e) => onTrimStartChange(e.target.value)}
              className="bg-black/50 border border-pixel-amber/50 px-2 py-1 outline-none text-pixel-light font-mono w-24"
              placeholder="00:00:00"
            />
          </div>
          <div className="flex items-center gap-2 text-pixel-amber text-[10px]">
            <span>КОНЕЦ:</span>
            <input 
              type="text" 
              value={trimEnd} 
              onChange={(e) => onTrimEndChange(e.target.value)}
              className="bg-black/50 border border-pixel-amber/50 px-2 py-1 outline-none text-pixel-light font-mono w-24"
              placeholder="00:00:00"
            />
          </div>
        </div>
      )}
    </div>
  )
}
"""

c = c.replace("// Custom animated checkbox\nconst PixelCheckbox", platform_card_code + "\n// Custom animated checkbox\nconst PixelCheckbox")

# 4. Replace PixelCheckbox usage in App.tsx for platforms
old_yt = "                          <PixelCheckbox label={t('upload_yt')} checked={useYt} onChange={() => setUseYt(!useYt)} icon={UploadCloud} />"
new_yt = """                          <PlatformExportCard 
                            label={t('upload_yt')} checked={useYt} onChange={setUseYt} icon={UploadCloud}
                            trimEnabled={ytTrimEnabled} onTrimToggle={setYtTrimEnabled}
                            trimStart={ytTrimStart} onTrimStartChange={setYtTrimStart}
                            trimEnd={ytTrimEnd} onTrimEndChange={setYtTrimEnd}
                          />"""
c = c.replace(old_yt, new_yt)

old_vk = "                          <PixelCheckbox label={t('upload_vk')} checked={useVk} onChange={() => setUseVk(!useVk)} icon={UploadCloud} />"
new_vk = """                          <PlatformExportCard 
                            label={t('upload_vk')} checked={useVk} onChange={setUseVk} icon={UploadCloud}
                            trimEnabled={vkTrimEnabled} onTrimToggle={setVkTrimEnabled}
                            trimStart={vkTrimStart} onTrimStartChange={setVkTrimStart}
                            trimEnd={vkTrimEnd} onTrimEndChange={setVkTrimEnd}
                          />"""
c = c.replace(old_vk, new_vk)

old_tg = "                          <PixelCheckbox label={t('upload_tg')} checked={useTg} onChange={() => setUseTg(!useTg)} icon={UploadCloud} />"
new_tg = """                          <PlatformExportCard 
                            label={t('upload_tg')} checked={useTg} onChange={setUseTg} icon={UploadCloud}
                            trimEnabled={tgTrimEnabled} onTrimToggle={setTgTrimEnabled}
                            trimStart={tgTrimStart} onTrimStartChange={setTgTrimStart}
                            trimEnd={tgTrimEnd} onTrimEndChange={setTgTrimEnd}
                          />"""
c = c.replace(old_tg, new_tg)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx refactored for inline trimming.")
