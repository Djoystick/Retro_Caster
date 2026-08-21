import os

changelog_path = 'CHANGELOG.md'
with open(changelog_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_version_notes = """## [1.2.1] - 2026-08-21
### Added
- **Умные шаблоны названий (Smart Templates):** Добавлена настройка "Шаблон названия" в раздел ОБЩИЕ. Поддержка переменных `{title}` (оригинальное название стрима) и `{date}` (текущая дата).
- **Авто-Обложки (Thumbnails):** Автоматическое скачивание оригинальной обложки Twitch-стрима и установка её в качестве значка видео при загрузке на YouTube.

"""

content = content.replace("# Changelog\n", "# Changelog\n\n" + new_version_notes)

with open(changelog_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("CHANGELOG.md updated.")
