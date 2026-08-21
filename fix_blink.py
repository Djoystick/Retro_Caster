import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add animate-pulse to INSERT COIN
c = c.replace(
    'className="text-[10px] text-pixel-cyan tracking-[0.2em] font-bold drop-shadow-[0_0_5px_rgba(65,166,246,0.8)]">INSERT COIN</span>',
    'className="text-[10px] text-pixel-cyan tracking-[0.2em] font-bold drop-shadow-[0_0_5px_rgba(65,166,246,0.8)] animate-pulse">INSERT COIN</span>'
)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Blinking animation added to INSERT COIN.")
