import re

with open('ROADMAP.md', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("- [ ] Package .exe using electron-builder for distribution.", "- [x] Package .exe using electron-builder for distribution.")
c = c.replace("- [ ] Final testing, bug fixes, and translation checks for all languages.", "- [x] Final testing, bug fixes, and translation checks for all languages.")
c = c.replace("## Phase 10: Polish & Release", "## Phase 10: Polish & Release (COMPLETED)")

with open('ROADMAP.md', 'w', encoding='utf-8') as f:
    f.write(c)

print("ROADMAP.md Phase 10 updated.")
