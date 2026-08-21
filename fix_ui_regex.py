import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the tabs header block
pattern = r"\{/\*\s*Tabs Header\s*\*/\}(.+?)\{/\*\s*Content Area"
replacement = """{/* Tabs Header */}
<div className="flex w-full justify-between items-center border-b border-pixel-darkblue/50 pb-2 mb-2 shrink-0">
  
  {/* LB Bumper */}
  <button 
    className="text-black bg-[#ffaa00] border-b-4 border-[#cc8800] active:border-b-0 active:translate-y-1 flex shrink-0 items-center gap-1 hover:brightness-125 px-2 py-1 rounded-sm transition-all text-[10px] font-bold shadow-[0_0_10px_rgba(255,170,0,0.3)]"
    onClick={() => {
      const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
      const idx = tabs.indexOf(activeSettingsTab);
      setActiveSettingsTab(tabs[(idx - 1 + tabs.length) % tabs.length] as any);
    }}
  >
    &larr; LB [Q]
  </button>
  
  {/* Scrollable Tabs Area */}
  <div className="flex-1 flex gap-2 justify-center items-center overflow-x-hidden whitespace-nowrap text-[9px] font-bold tracking-widest px-4">
    {[
      { id: 'general', label: 'ОБЩИЕ' },
      { id: 'youtube', label: 'YOUTUBE' },
      { id: 'vk', label: 'VK' },
      { id: 'telegram', label: 'TELEGRAM' },
      { id: 'rutube', label: 'RUTUBE' },
      { id: 'dzen', label: 'ДЗЕН' }
    ].map((tab, idx, arr) => (
      <React.Fragment key={tab.id}>
        <button 
          className={`transition-colors uppercase shrink-0 ${activeSettingsTab === tab.id ? 'text-[#ffaa00] border border-[#ffaa00] px-1 py-0.5 rounded-sm bg-[#ffaa00]/10 shadow-[0_0_5px_rgba(255,170,0,0.5)]' : 'text-[#ff3333] hover:text-[#ffaa00]'}`}
          onClick={() => setActiveSettingsTab(tab.id as any)}
        >
          {tab.label}
        </button>
        {idx < arr.length - 1 && <span className="text-[#ff3333]/50 shrink-0">/</span>}
      </React.Fragment>
    ))}
  </div>
  
  {/* RB Bumper */}
  <button 
    className="text-black bg-[#ffaa00] border-b-4 border-[#cc8800] active:border-b-0 active:translate-y-1 flex shrink-0 items-center gap-1 hover:brightness-125 px-2 py-1 rounded-sm transition-all text-[10px] font-bold shadow-[0_0_10px_rgba(255,170,0,0.3)]"
    onClick={() => {
      const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
      const idx = tabs.indexOf(activeSettingsTab);
      setActiveSettingsTab(tabs[(idx + 1) % tabs.length] as any);
    }}
  >
    [E] RB &rarr;
  </button>
</div>

{/* Content Area"""

c = re.sub(pattern, replacement, c, flags=re.DOTALL)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("LB/RB and Tabs Header successfully replaced.")
