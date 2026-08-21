import re

with open('.backups/scripts/reconstructed_final.tsx', 'r', encoding='utf-8') as f:
    backup_content = f.read()

# Extract parsing, ready, downloading blocks
# We know they start with {appState === 'parsing' && (
# and end right before {appState === 'settings' && (

parsing_start = backup_content.find("{appState === 'parsing'")
settings_start = backup_content.find("{appState === 'settings'")

if parsing_start == -1 or settings_start == -1:
    print("Could not find boundaries in backup")
    exit(1)

missing_blocks = backup_content[parsing_start:settings_start]

# Now read current App.tsx
with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Find where to insert it. We should insert it right before the settings block.
insert_pos = app_content.find("{/* 7. Settings Screen */}")

if insert_pos == -1:
    print("Could not find insert position in App.tsx")
    exit(1)

new_app_content = app_content[:insert_pos] + missing_blocks + "\n            " + app_content[insert_pos:]

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(new_app_content)

print("Restored missing 'parsing', 'ready', and 'downloading' blocks!")
