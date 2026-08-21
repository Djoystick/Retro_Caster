import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add queue route to sidebar
target = """                              if (id === 'mission') {
                                if (appState === 'settings' || appState === 'api_guide' || appState === 'history') setAppState('execute')
                              } else if (id === 'settings') {
                                setAppState('settings')
                              } else if (id === 'history') {
                                setAppState('history')
                              }
                            }"""

replacement = """                              if (id === 'mission') {
                                if (appState === 'settings' || appState === 'api_guide' || appState === 'history' || appState === 'queue') setAppState('execute')
                              } else if (id === 'settings') {
                                setAppState('settings')
                              } else if (id === 'history') {
                                setAppState('history')
                              } else if (id === 'queue') {
                                setAppState('queue')
                              }
                            }"""

c = c.replace(target, replacement)

# 2. Fix addToQueue transition
c = c.replace("setAppState('execute')\n    setNavSection('queue')", "setAppState('queue')\n    setNavSection('queue')")

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx routing absolutely fixed.")
