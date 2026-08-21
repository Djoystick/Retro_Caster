with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    for line in lines:
        if line.strip() == '{':
            pass # skip it! Wait, what if it's a valid one?
            # Actually, I can just replace the specific broken block
        else:
            pass

# Let's use a safer approach: read all, replace the specific string
c = "".join(lines)
broken_block = "                        </span>\n                        {\n                        {id === 'queue'"
fixed_block = "                        </span>\n                        {id === 'queue'"
if broken_block in c:
    c = c.replace(broken_block, fixed_block)
else:
    # Just regex remove the empty bracket line that precedes the queue logic
    import re
    c = re.sub(r"\}\s*>\n\s*\{label\}\n\s*</span>\n\s*\{\n\s*\{id === 'queue'", r"}>\n                          {label}\n                        </span>\n                        {id === 'queue'", c)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Syntax fix applied.")
