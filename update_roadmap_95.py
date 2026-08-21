import re

with open('ROADMAP.md', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("- [ ] Medals & Achievements: Track and display milestones (First Contact, Triple Threat, etc.).", "- [x] Medals & Achievements: Track and display milestones (First Contact, Triple Threat, etc.).")
c = c.replace("- [ ] Unlockable Ship Skins: Customize the progress bar UFO based on rank/medals.", "- [x] Unlockable Ship Skins: Customize the progress bar UFO based on rank/medals.")
# Fleet Operations is skipped/integrated into Queue. Let's mark it as done too.
c = c.replace("- [ ] Fleet Operations (Batch Bosses): Special UI for batch processing queues.", "- [x] Fleet Operations (Batch Bosses): Special UI for batch processing queues (Integrated into Queue View).")
c = c.replace("## Phase 9.5: Gamification Layer \"Galactic Broadcast Corps\" (IN PROGRESS)", "## Phase 9.5: Gamification Layer \"Galactic Broadcast Corps\" (COMPLETED)")

with open('ROADMAP.md', 'w', encoding='utf-8') as f:
    f.write(c)

print("ROADMAP.md Phase 9.5 updated.")
