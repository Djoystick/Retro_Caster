import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add a keyboard event listener for Q/E or Ctrl+Left/Right to switch tabs if we are in 'settings' appState
effect_code = """
  // Keyboard LB / RB Simulation
  useEffect(() => {
    if (appState !== 'settings') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q') {
        const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
        setActiveSettingsTab(prev => {
          const idx = tabs.indexOf(prev);
          return tabs[(idx - 1 + tabs.length) % tabs.length] as any;
        });
      } else if (e.key === 'e' || e.key === 'E') {
        const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
        setActiveSettingsTab(prev => {
          const idx = tabs.indexOf(prev);
          return tabs[(idx + 1) % tabs.length] as any;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState]);
"""

# inject right before `const handleParseUrl`
c = c.replace("const handleParseUrl = async () => {", effect_code + "\n  const handleParseUrl = async () => {")

# Also, update the LB/RB labels to mention [Q] and [E]
c = c.replace("&larr; LB", "&larr; LB [Q]")
c = c.replace("RB &rarr;", "[E] RB &rarr;")

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Keyboard shortcuts added for LB and RB.")
