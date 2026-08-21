import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """                              if (id === 'mission') {
                                if (appState === 'settings' || appState === 'api_guide' || appState === 'history') setAppState('execute')
                              } else if (id === 'settings') {
                                setAppState('settings')
                              } else if (id === 'history') {
                                setAppState('history')
                              }"""

replacement = """                              if (id === 'mission') {
                                if (appState === 'settings' || appState === 'api_guide' || appState === 'history' || appState === 'queue') setAppState('execute')
                              } else if (id === 'settings') {
                                setAppState('settings')
                              } else if (id === 'history') {
                                setAppState('history')
                              } else if (id === 'queue') {
                                setAppState('queue')
                              }"""

if target in c:
    c = c.replace(target, replacement)
    print("Replaced successfully!")
else:
    print("Target not found. Doing regex...")
    # fallback regex
    c = re.sub(r"if \(id === 'mission'\) \{\n\s*if \(appState === 'settings' \|\| appState === 'api_guide' \|\| appState === 'history'\) setAppState\('execute'\)\n\s*\} else if \(id === 'settings'\) \{\n\s*setAppState\('settings'\)\n\s*\} else if \(id === 'history'\) \{\n\s*setAppState\('history'\)\n\s*\}", replacement, c)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

