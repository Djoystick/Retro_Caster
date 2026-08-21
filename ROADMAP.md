# RetroCaster Roadmap

## Phase 1: UI/UX & i18n setup (COMPLETED)
- [x] Basic Electron + Vite + React structure.
- [x] Pixel-art aesthetic (Framer Motion, Tailwind CSS).
- [x] Language selection screen with localStorage persistence.
- [x] Main Quest and Execute interfaces.

## Phase 2: Gamified Onboarding (COMPLETED)
- [x] Implemented the Typewriter effect for all prompts.
- [x] Customized "Retro Gamer / Synthwave" CSS background and stylized custom controls.
- [x] Replaced standard OS window with a frameless custom title bar.

## Phase 3: Integration with yt-dlp (COMPLETED)
- [x] yt-dlp execution via Electron IPC main process to fetch video metadata from Twitch.
- [x] UI mapping to show "TARGET ACQUIRED" and video details (thumbnail, duration, title).
- [x] Backend dependencies installed (yt-dlp-exec, fluent-ffmpeg).

## Phase 4: Download & Chunking Engine (COMPLETED)
- [x] Full VOD download via yt-dlp.
- [x] Processing and splitting the file via ffmpeg if it exceeds Telegram limits.
- [x] Store chunks in a temporary directory.

## Phase 5: Multi-Platform Uploads (COMPLETED)
- [x] Telegram integration (using gramjs).
- [x] YouTube API integration (via googleapis).
- [x] VK API integration (Video Upload via axios).
- [x] Dashboard Mission Control: Progress bars and parallel status indicators for each platform.

## Phase 6: Security & Core Architecture (COMPLETED)
- [x] Migrate sensitive API tokens (YT, VK, TG) from localStorage to encrypted backend store.
- [x] Embed external binaries (ffmpeg, yt-dlp) into extraResources for absolute portability.

## Phase 7: Post-Processing & Database (COMPLETED)
- [x] Automatic "Auto-Delete" feature to clean up raw VODs and chunks after upload.
- [x] Write final uploaded URLs/IDs to a local database/JSON (History Tab).
- [x] Mission History UI: A screen showing past uploads, transferred gigabytes, and clickable links.

## Phase 8: Reliability & Resilience (IN PROGRESS)
- [x] Smart Retries (Exponential Backoff) for network drops (e.g. YouTube ECONNRESET).
- [ ] Download Resume: Enable yt-dlp continuation if download gets interrupted.

## Phase 9: Advanced Features (COMPLETED)
- [x] **PiP Dashboard (Picture-in-Picture)**: Реализовать свободное перемещение по окнам программы во время выгрузки. При переходе в Настройки или Историю, окно дашборда должно плавно и красиво сворачиваться в угол (PiP), а при клике — разворачиваться обратно.
- [x] **Advanced Trimming & Multi-Routing**: Нарезка видео на тайминги и заливка разных частей на разные платформы (например, вырезать кусок с фильмом, чтобы избежать бана за АП на YouTube, и залить туда только игру, а полную версию отправить в VK).
- [x] **Batch Processing (Очередь)**: Последовательная заливка нескольких видео. Возможность поставить задачи для списка VOD'ов и уйти спать, пока программа автономно качает, режет и выгружает всю очередь.
- [x] Smart metadata templates: Dynamic titles with {title} and {date} variables.
- [x] Thumbnail Extraction: Download native Twitch thumbnails and attach to YT/VK uploads.

## Phase 9.5: Gamification Layer "Galactic Broadcast Corps" (COMPLETED)
- [x] XP & Ranking System: Earn XP for uploads, display Rank in title bar.
- [x] Broadcast Streak: Daily multipliers for consistent uploads.
- [x] Medals & Achievements: Track and display milestones (First Contact, Triple Threat, etc.).
- [x] Star Map (History overhaul): Re-imagine the History tab as an interactive planetary map.
- [x] Fleet Operations (Batch Bosses): Special UI for batch processing queues (Integrated into Queue View).
- [x] Unlockable Ship Skins: Customize the progress bar UFO based on rank/medals.

## Phase 10: Polish & Release
- [x] **Pre-flight Validation UI**: Green checkmarks for VK/TG access rights to verify token/admin rights *before* starting the heavy pipeline.
- [x] System Tray integration: Run in background and send OS notifications upon completion.
- [ ] Package .exe using electron-builder for distribution.
- [ ] Final testing, bug fixes, and translation checks for all languages.

## Phase 11: Безопасная компиляция и Стилизованный Установщик (NEW)
- [ ] **Надежная сборка (electron-builder):** Использовать проверенный движок NSIS, чтобы исключить баги.
- [ ] **Пиксельный дизайн установщика:** Стилизовать стандартный установщик NSIS под наш UI (добавить ретро-иконки, пиксельный фоновый рисунок `.bmp` и кастомные цвета), чтобы сохранить атмосферу без риска создания нестабильного кастомного распаковщика.
- [ ] **Portable-версия (Запасной вариант):** Сгенерировать `portable` .exe, который вообще не требует установки и запускается сразу в нашем интерфейсе (нулевой риск сбоев инсталлятора).
- [ ] **Изоляция бинарников (extraResources):** Безопасно вшить `ffmpeg` и `yt-dlp` внутрь установщика, чтобы они гарантированно работали на любом ПК без танцев с бубном.
