import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update SETTINGS title with blinking cursor
c = c.replace(
    ">SETTINGS</h2>",
    ">SETTINGS<span className=\"animate-pulse\">_</span></h2>"
)
c = c.replace(
    ">\n                          SETTINGS\n                        </h2>",
    ">\n                          SETTINGS<span className=\"animate-pulse\">_</span>\n                        </h2>"
)

# 2. Add Floating animation to the Modal
c = c.replace(
    "className=\"pixel-panel w-full max-w-[550px] flex flex-col gap-1.5 !border-x-4 !border-y-0 !border-[#ffaa00] relative !p-4\"",
    "className=\"pixel-panel w-full max-w-[550px] flex flex-col gap-1.5 !border-x-4 !border-y-0 !border-[#ffaa00] relative !p-4 shadow-[0_0_20px_rgba(255,170,0,0.3)] hover:shadow-[0_0_30px_rgba(255,170,0,0.5)] transition-all duration-500 animate-[float_4s_ease-in-out_infinite]\""
)

# Wait, `animate-[float_4s_ease-in-out_infinite]` requires a `float` keyframe.
# Let's just use `animate-pulse` or just rely on CSS we'll add. Or `translate-y-`? 
# Better yet, Framer Motion! It's already an `animate={{ scale: 1, opacity: 1 }}`.
# I will change the framer motion props to float!
fm_old = """                      <motion.div
                        key="settings"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="pixel-panel w-full max-w-[550px] flex flex-col gap-1.5 !border-x-4 !border-y-0 !border-[#ffaa00] relative !p-4\""""

fm_new = """                      <motion.div
                        key="settings"
                        initial={{ scale: 0.9, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
                        transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.2 }, scale: { duration: 0.2 } }}
                        exit={{ scale: 0.9, opacity: 0, y: 10 }}
                        className="pixel-panel w-full max-w-[550px] flex flex-col gap-1.5 !border-x-4 !border-y-0 !border-[#ffaa00] relative !p-4 shadow-[0_0_30px_rgba(255,170,0,0.15)]\""""
if fm_old in c:
    c = c.replace(fm_old, fm_new)
else:
    # try regex
    c = re.sub(r"<motion\.div\s+key=\"settings\"\s+initial=\{\{\s*scale:\s*0\.9,\s*opacity:\s*0\s*\}\}\s+animate=\{\{\s*scale:\s*1,\s*opacity:\s*1\s*\}\}\s+exit=\{\{\s*scale:\s*0\.9,\s*opacity:\s*0\s*\}\}\s+className=\"pixel-panel w-full max-w-\[550px\] flex flex-col gap-1\.5 !border-x-4 !border-y-0 !border-\[#ffaa00\] relative !p-4\"", fm_new, c)


# 3. Restructure LB and RB
old_tabs_block = """<div className="flex gap-2 border-b border-pixel-darkblue/50 pb-2 mb-2 shrink-0 justify-center text-[9px] font-bold tracking-widest items-center whitespace-nowrap overflow-hidden">
                          <button 
                            className="text-[#ffaa00] flex shrink-0 items-center gap-1 hover:text-white hover:bg-[#ffaa00]/20 px-1 rounded transition-colors"
                            onClick={() => {
                              const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
                              const idx = tabs.indexOf(activeSettingsTab);
                              setActiveSettingsTab(tabs[(idx - 1 + tabs.length) % tabs.length] as any);
                            }}
                          >
                            &larr; LB [Q]
                          </button>
                          
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
                                className={`transition-colors uppercase shrink-0 ${activeSettingsTab === tab.id ? 'text-[#ffaa00] border border-[#ffaa00] px-1 py-0.5 rounded-sm bg-[#ffaa00]/10' : 'text-[#ff3333] hover:text-[#ff3333]/80'}`}
                                onClick={() => setActiveSettingsTab(tab.id as any)}
                              >
                                {tab.label}
                              </button>
                              {idx < arr.length - 1 && <span className="text-pixel-darkblue/50">/</span>}
                            </React.Fragment>
                          ))}
                          
                          <button 
                            className="text-[#ffaa00] flex shrink-0 items-center gap-1 hover:text-white hover:bg-[#ffaa00]/20 px-1 rounded transition-colors"
                            onClick={() => {
                              const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
                              const idx = tabs.indexOf(activeSettingsTab);
                              setActiveSettingsTab(tabs[(idx + 1) % tabs.length] as any);
                            }}
                          >
                            [E] RB &rarr;
                          </button>
                        </div>"""

new_tabs_block = """<div className="flex w-full justify-between items-center border-b border-pixel-darkblue/50 pb-2 mb-2 shrink-0">
                          
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
                                {idx < arr.length - 1 && <span className="text-pixel-darkblue/50">/</span>}
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
                        </div>"""
c = c.replace(old_tabs_block, new_tabs_block)


# 4. Global Scanline overlay
# Add `<div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-20"></div>` inside the top wrapper
if "bg-[length:100%_4px]" not in c:
    wrapper_target = """<div className="relative flex flex-col h-screen w-screen overflow-hidden selection:bg-pixel-cyan/30 text-pixel-light bg-black">"""
    wrapper_new = """<div className="relative flex flex-col h-screen w-screen overflow-hidden selection:bg-pixel-cyan/30 text-pixel-light bg-black">
      {/* Global CRT Scanlines Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40 mix-blend-overlay"></div>
      {/* CRT Vignette */}
      <div className="pointer-events-none fixed inset-0 z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"></div>"""
    c = c.replace(wrapper_target, wrapper_new)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("UI tweaks successfully applied.")
