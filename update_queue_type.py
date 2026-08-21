import re

with open('src/renderer/src/types/queue.ts', 'r', encoding='utf-8') as f:
    c = f.read()

trim_config = """export interface TrimConfig {
  start: string;
  end: string;
}

export interface QueueConfig {"""

c = c.replace("export interface QueueConfig {", trim_config)

config_fields = """  useYt: boolean;
  ytTrim?: TrimConfig;
  useVk: boolean;
  vkTrim?: TrimConfig;
  useTg: boolean;
  tgTrim?: TrimConfig;"""

c = re.sub(r"  useYt: boolean;\n  useVk: boolean;\n  useTg: boolean;", config_fields, c)

with open('src/renderer/src/types/queue.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("queue.ts updated.")
