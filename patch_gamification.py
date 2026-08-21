import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add AchievementPopup inside the main container
# Find `<div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative p-4">`
# Or better, just inside `<div className="w-full h-screen overflow-hidden flex flex-col bg-pixel-dark font-pixel">`

if "<AchievementPopup />" not in c:
    c = c.replace(
        '<div className="w-full h-screen overflow-hidden flex flex-col bg-pixel-dark font-pixel">',
        '<div className="w-full h-screen overflow-hidden flex flex-col bg-pixel-dark font-pixel">\n      <AchievementPopup />'
    )

# 2. Add MEDAL_ICONS mapping at the top
if "const MEDAL_ICONS:" not in c:
    c = c.replace(
        "const LANGUAGES = [",
        "const MEDAL_ICONS: Record<string, string> = { first_contact: '🛸', triple_threat: '🌍', '100_broadcasts': '📡', hot_streak: '🔥', the_survivor: '💀' }\n\nconst LANGUAGES = ["
    )

# 3. Replace the Gamification Rank Card
old_rank_card = r"""<div className="p-2 border-t border-pixel-border flex flex-col items-center gap-1 bg-pixel-dark/50" title={`SCORE: \$\{gamification\.xp\}`}>
                        <div className="text-\[7px\] text-pixel-light-dim">PLAYER 1</div>
                        <div className="w-8 h-8 rounded bg-pixel-dark flex items-center justify-center border border-pixel-cyan shadow-\[0_0_8px_rgba\(65,166,246,0\.3\)\] relative overflow-hidden">
                          <div className="absolute bottom-0 w-full bg-pixel-cyan/30" style=\{\{ height: `\$\{Math\.min\(100, \(gamification\.xp % 500\) / 5\)\}%` \}\} />
                          <span className="text-\[14px\] relative z-10 drop-shadow-md">🏆</span>
                        </div>
                        <span className="text-\[7px\] text-pixel-amber tracking-widest text-center leading-tight mt-1 break-words w-full">
                          \{gamification\.rank\}
                        </span>
                        <div className="w-full bg-pixel-border h-1\.5 mt-1 rounded-full overflow-hidden border border-pixel-dark">
                          <div 
                            className="h-full bg-pixel-cyan shadow-\[0_0_5px_rgba\(65,166,246,1\)\]"
                            style=\{\{ width: `\$\{Math\.min\(100, \(gamification\.xp % 500\) / 5\)\}%` \}\}
                          />
                        </div>
                      </div>"""

new_rank_card = """<div className="p-2 border-t border-pixel-border flex flex-col items-center gap-1 bg-pixel-dark/50" title={`SCORE: ${gamification.xp}`}>
                        <div className="text-[7px] text-pixel-light-dim font-bold">PLAYER 1</div>
                        <div className="w-8 h-8 rounded bg-pixel-dark flex items-center justify-center border border-pixel-cyan shadow-[0_0_8px_rgba(65,166,246,0.3)] relative overflow-hidden">
                          <div className="absolute bottom-0 w-full bg-pixel-cyan/30" style={{ height: `${Math.min(100, (gamification.xp % 500) / 5)}%` }} />
                          <span className="text-[14px] relative z-10 drop-shadow-md">🏆</span>
                        </div>
                        <span className="text-[7px] text-pixel-amber font-bold tracking-widest text-center leading-tight mt-1 break-words w-full">
                          {gamification.rank}
                        </span>
                        
                        {/* Ship Skin Progress Bar */}
                        <div className="w-full relative h-3 mt-1">
                          <div className="absolute top-0 text-[10px] transition-all duration-1000" style={{ left: `calc(${Math.min(100, (gamification.xp % 500) / 5)}% - 5px)` }}>
                            {gamification.rank.includes('ELITE') ? '🛰️' : gamification.rank.includes('LEGEND') ? '🌌' : '🚀'}
                          </div>
                          <div className="w-full bg-pixel-border h-1 absolute bottom-0 rounded-full overflow-hidden border border-pixel-dark">
                            <div 
                              className="h-full bg-pixel-cyan shadow-[0_0_5px_rgba(65,166,246,1)]"
                              style={{ width: `${Math.min(100, (gamification.xp % 500) / 5)}%` }}
                            />
                          </div>
                        </div>

                        {/* Medals */}
                        {gamification.medals && gamification.medals.length > 0 && (
                          <div className="flex gap-1 mt-1 justify-center flex-wrap">
                            {gamification.medals.map((id: string) => <span key={id} className="text-[10px]" title={id}>{MEDAL_ICONS[id] || '🏅'}</span>)}
                          </div>
                        )}
                      </div>"""

c = re.sub(old_rank_card, new_rank_card, c, flags=re.DOTALL)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx patched for gamification.")
