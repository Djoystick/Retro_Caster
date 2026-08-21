import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. We will replace the entire modal wrapper and header.
# We need to match from `<motion.div key="settings"` to `</div>` before `{/* Scrollable Tabs Area */}`

target_start = r'<motion\.div\s+key="settings"[\s\S]+?className="pixel-panel [^"]+".*?>\s*<h2[^>]*>.*?SETTINGS.*?</h2>\s*\{/\*\s*Tabs Header\s*\*/\}\s*<div[^>]*>\s*\{/\*\s*LB Bumper\s*\*/\}\s*<button[^>]*>.*?&larr; LB \[Q\].*?</button>'

replacement_modal_start = """<motion.div
  key="settings"
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  className="w-full max-w-[580px] relative p-1 bg-[#ffaa00] shadow-[0_0_20px_rgba(255,170,0,0.4)]"
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
    
    {/* Tabs Header */}
    <div className="flex w-full justify-center items-center border-b-2 border-pixel-darkblue/50 pb-2 mb-2 shrink-0">"""

c = re.sub(target_start, replacement_modal_start, c)

# 2. We also need to remove the RB bumper from the old Tabs Header row because we moved it up!
# It looks like:
# </div>
#   {/* RB Bumper */}
#   <button ...>[E] RB &rarr;</button>
# </div>
# {/* Content Area - No fixed height, tightly packed */}

rb_remove_pattern = r'</React\.Fragment>\s*\)\)\}\s*</div>\s*\{/\*\s*RB Bumper\s*\*/\}\s*<button[^>]*>.*?\[E\] RB &rarr;.*?</button>\s*</div>\s*\{/\*\s*Content Area'

rb_remove_replacement = """</React.Fragment>
    ))}
  </div>
</div>
{/* Content Area"""

c = re.sub(rb_remove_pattern, rb_remove_replacement, c)


with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Settings layout and frame upgraded.")
