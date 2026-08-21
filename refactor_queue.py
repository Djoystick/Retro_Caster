import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Imports
c = c.replace(
    "import { Dashboard } from './components/Dashboard'",
    "import { Dashboard } from './components/Dashboard'\nimport { QueueView } from './components/QueueView'\nimport { QueueItem } from './types/queue'"
)

# 2. State variables
state_vars = """
  const [activeInstruction, setActiveInstruction] = useState<string | null>(null)
  
  // Queue state
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [isQueueRunning, setIsQueueRunning] = useState(false)
"""
c = c.replace("const [activeInstruction, setActiveInstruction] = useState<string | null>(null)", state_vars)

# 3. Sidebar Queue button & WIP badge
c = c.replace("{ id: 'queue',    Icon: Package,   label: 'ОЧЕРЕДЬ',  active: false }", "{ id: 'queue',    Icon: Package,   label: 'ОЧЕРЕДЬ',  active: true }")
c = c.replace("!active && <span className=\"absolute top-1 right-1 text-[5px] text-pixel-amber\">WIP</span>", "id === 'trim' && <span className=\"absolute top-1 right-1 text-[5px] text-pixel-amber\">WIP</span>")

# Add badge for queue length
badge_code = """id === 'trim' && <span className="absolute top-1 right-1 text-[5px] text-pixel-amber">WIP</span>}
                        {id === 'queue' && queue.length > 0 && <span className="absolute top-1 right-1 text-[7px] text-pixel-cyan bg-pixel-blue/30 px-1 rounded-full">{queue.length}</span>}"""
c = c.replace("id === 'trim' && <span className=\"absolute top-1 right-1 text-[5px] text-pixel-amber\">WIP</span>}", badge_code)


with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx step 1 injected")
