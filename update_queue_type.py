import re

with open('src/renderer/src/types/queue.ts', 'r', encoding='utf-8') as f:
    c = f.read()

if "thumbnailUrl?: string;" not in c:
    c = c.replace(
        "title: string;\n  config: QueueConfig;",
        "title: string;\n  thumbnailUrl?: string;\n  config: QueueConfig;"
    )

with open('src/renderer/src/types/queue.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("types updated.")
