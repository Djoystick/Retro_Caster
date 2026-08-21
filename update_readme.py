import re

readme_path = 'README.md'
features_path = '.docs/FEATURES_IMPLEMENTED.md'

with open(features_path, 'r', encoding='utf-8') as f:
    features_content = f.read()
    
# Remove the main title from features_content since it will be under a heading
features_content = features_content.replace("# Полный список реализованных функций (На момент версии 1.2.0)\n\n", "")

with open(readme_path, 'r', encoding='utf-8') as f:
    readme = f.read()

# Replace everything from `## ✨ Ключевые возможности (Features)` up to the next `---`
pattern = r"## ✨ Ключевые возможности \(Features\).*?(?=\n---)"
replacement = f"## ✨ Ключевые возможности (Features)\n\n{features_content}"

new_readme = re.sub(pattern, replacement, readme, flags=re.DOTALL)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(new_readme)

print("README.md updated with features list.")
