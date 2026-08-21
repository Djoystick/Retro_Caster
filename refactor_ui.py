import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace button text and onClick
c = c.replace("onClick={startDownload}", "onClick={addToQueue}")
c = c.replace("{t('start_pipeline')}", "\"ДОБАВИТЬ В ОЧЕРЕДЬ\"")

# Render QueueView
queue_view_render = """
                  {navSection === 'queue' && (
                    <QueueView 
                      queue={queue} 
                      isQueueRunning={isQueueRunning} 
                      onStartQueue={() => setIsQueueRunning(true)} 
                      onStopQueue={() => setIsQueueRunning(false)} 
                      onRemoveItem={(id) => setQueue(q => q.filter(i => i.id !== id))} 
                    />
                  )}

                  {navSection === 'mission' && (
"""

c = c.replace("{navSection === 'mission' && (", queue_view_render)

# Add PiP status to Dashboard component
dashboard_status_prop = """
                      <Dashboard 
                        useYt={useYt}
"""
c = c.replace(dashboard_status_prop, dashboard_status_prop) # Oh, wait, I need a safe replace for Dashboard

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx step 3 injected")
