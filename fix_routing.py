import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update appState type
c = c.replace(
    "useState<'lang_select' | 'boot_sequence' | 'execute' | 'parsing' | 'ready' | 'downloading' | 'settings' | 'api_guide' | 'success' | 'uploading' | 'dashboard' | 'history'>",
    "useState<'lang_select' | 'boot_sequence' | 'execute' | 'parsing' | 'ready' | 'downloading' | 'settings' | 'api_guide' | 'success' | 'uploading' | 'dashboard' | 'history' | 'queue'>"
)

# 2. Sidebar onClick logic
sidebar_click = """                            if (active) {
                              setNavSection(id as any)
                              if (id === 'mission') {
                                if (appState === 'settings' || appState === 'api_guide' || appState === 'history' || appState === 'queue') setAppState('execute')
                              } else if (id === 'settings') {
                                setAppState('settings')
                              } else if (id === 'history') {
                                setAppState('history')
                              } else if (id === 'queue') {
                                setAppState('queue')
                              }
                            }"""
c = re.sub(r"                            if \(active\) \{[\s\S]*?setAppState\('history'\)\n                              \}\n                            \}", sidebar_click, c)

# 3. Add QueueView rendering block
queue_render = """
                  {appState === 'queue' && (
                    <motion.div
                      key="queue"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full"
                    >
                      <QueueView 
                        queue={queue} 
                        isQueueRunning={isQueueRunning} 
                        onStartQueue={() => setIsQueueRunning(true)} 
                        onStopQueue={() => setIsQueueRunning(false)} 
                        onRemoveItem={(id) => setQueue(q => q.filter(i => i.id !== id))} 
                      />
                    </motion.div>
                  )}
                  """

# Let's insert it before {appState === 'settings'
c = c.replace("{appState === 'settings' && (", queue_render + "\n                  {appState === 'settings' && (")

# 4. Fix the "ПОГНАЛИ" button text
c = c.replace("{t('start_upload', 'START RUN')}", "\"ДОБАВИТЬ В ОЧЕРЕДЬ\"")

# 5. The earlier python script did:
# c = c.replace("{navSection === 'mission' && (", queue_view_render)
# Let's remove the broken queue_view_render that we previously injected (if any)
# I will just write it and check if it builds.
with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx routing and button fixed.")
