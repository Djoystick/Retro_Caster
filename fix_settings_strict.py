import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

start_marker = "key=\"settings\""
end_marker = "{/* Content Area - No fixed height, tightly packed */}"

start_idx = c.find(start_marker)
# back up to `<motion.div`
start_idx = c.rfind("<motion.div", 0, start_idx)
end_idx = c.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    old_block = c[start_idx:end_idx]
    
    new_block = """<motion.div
  key="settings"
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  className="w-full max-w-[650px] relative p-1 bg-[#ffaa00] shadow-[0_0_20px_rgba(255,170,0,0.4)]"
>
  <div className="w-full h-full bg-black/95 border-2 border-black border-t-[#ffcc44] border-l-[#ffcc44] border-r-[#cc8800] border-b-[#cc8800] p-4 flex flex-col gap-1">
    
    {/* Header with Title and Bumpers */}
    <div className="flex w-full justify-between items-center mb-2 px-1">
      {/* LB Bumper */}
      <button 
        className="text-black bg-[#ffaa00] border-b-4 border-[#cc8800] active:border-b-0 active:translate-y-1 flex shrink-0 items-center justify-center hover:brightness-125 px-3 py-1.5 rounded-sm transition-all text-[11px] font-black shadow-[0_0_10px_rgba(255,170,0,0.5)]"
        onClick={() => {
          const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
          const idx = tabs.indexOf(activeSettingsTab);
          setActiveSettingsTab(tabs[(idx - 1 + tabs.length) % tabs.length] as any);
        }}
      >
        &larr; LB [Q]
      </button>
      
      <h2 className="text-[#ffaa00] text-xl tracking-[0.2em] uppercase font-black drop-shadow-[0_2px_0_rgba(0,0,0,1)] flex items-center">
        SETTINGS<span className="animate-pulse ml-1">█</span>
      </h2>
      
      {/* RB Bumper */}
      <button 
        className="text-black bg-[#ffaa00] border-b-4 border-[#cc8800] active:border-b-0 active:translate-y-1 flex shrink-0 items-center justify-center hover:brightness-125 px-3 py-1.5 rounded-sm transition-all text-[11px] font-black shadow-[0_0_10px_rgba(255,170,0,0.5)]"
        onClick={() => {
          const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
          const idx = tabs.indexOf(activeSettingsTab);
          setActiveSettingsTab(tabs[(idx + 1) % tabs.length] as any);
        }}
      >
        [E] RB &rarr;
      </button>
    </div>
    
    {/* Scrollable Tabs Area */}
    <div className="flex w-full justify-center items-center overflow-x-auto custom-scrollbar whitespace-nowrap text-[9px] font-bold tracking-widest px-4 pb-2 mb-2 border-b-2 border-pixel-darkblue/50 shrink-0">
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
          {idx < arr.length - 1 && <span className="text-[#ff3333]/50 shrink-0 mx-2">/</span>}
        </React.Fragment>
      ))}
    </div>
    
    """
    
    c = c[:start_idx] + new_block + c[end_idx:]
    
    # Finally, we must close the new wrappers we opened.
    # The old structure just had `<motion.div> ... </motion.div>`.
    # Now we have `<motion.div> <div> ... </div> </motion.div>`.
    # Let's find the closing tag for the motion.div.
    end_of_modal = c.find("</motion.div>", end_idx)
    if end_of_modal != -1:
        c = c[:end_of_modal] + "  </div>\n" + c[end_of_modal:]

    with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Replaced perfectly via strict string indices.")
else:
    print("Could not find boundaries.")
