import re

with open('ROADMAP.md', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("- [ ] Smart metadata templates: Dynamic titles with {title} and {date} variables.", "- [x] Smart metadata templates: Dynamic titles with {title} and {date} variables.")
c = c.replace("- [ ] Thumbnail Extraction: Download native Twitch thumbnails and attach to YT/VK uploads.", "- [x] Thumbnail Extraction: Download native Twitch thumbnails and attach to YT/VK uploads.")
c = c.replace("## Phase 9: Advanced Features (IN PROGRESS)", "## Phase 9: Advanced Features (COMPLETED)")

with open('ROADMAP.md', 'w', encoding='utf-8') as f:
    f.write(c)

print("ROADMAP.md updated.")
