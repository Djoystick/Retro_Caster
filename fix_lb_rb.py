import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

lb_target = """<span className="text-[#ffaa00] flex shrink-0 items-center gap-1">&larr; LB</span>"""
rb_target = """<span className="text-[#ffaa00] flex shrink-0 items-center gap-1">RB &rarr;</span>"""

lb_replacement = """<button 
                          className="text-[#ffaa00] flex shrink-0 items-center gap-1 hover:text-white hover:bg-[#ffaa00]/20 px-1 rounded transition-colors"
                          onClick={() => {
                            const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
                            const idx = tabs.indexOf(activeSettingsTab);
                            setActiveSettingsTab(tabs[(idx - 1 + tabs.length) % tabs.length] as any);
                          }}
                        >
                          &larr; LB
                        </button>"""

rb_replacement = """<button 
                          className="text-[#ffaa00] flex shrink-0 items-center gap-1 hover:text-white hover:bg-[#ffaa00]/20 px-1 rounded transition-colors"
                          onClick={() => {
                            const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
                            const idx = tabs.indexOf(activeSettingsTab);
                            setActiveSettingsTab(tabs[(idx + 1) % tabs.length] as any);
                          }}
                        >
                          RB &rarr;
                        </button>"""

if lb_target in c:
    c = c.replace(lb_target, lb_replacement)
if rb_target in c:
    c = c.replace(rb_target, rb_replacement)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("LB and RB updated to functional buttons!")
