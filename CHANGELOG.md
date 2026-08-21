# Changelog

## [1.2.2] - 2026-08-21
### Added
- **Ачивки и Медали (Achievements):** Полноценная система достижений! Медали за первую загрузку, стрик, выгрузку на 3 платформы одновременно. Всплывающие пиксельные уведомления при получении.
- **Скины корабля (Progress UFO):** Статичная полоска опыта заменена на космический корабль, летящий по шкале XP. Скин корабля эволюционирует в зависимости от звания (Ракетка 🚀 -> Спутник 🛰️ -> Звездный крейсер 🌌).
- **Витрина медалей:** Теперь полученные медали отображаются в левом нижнем углу под вашим званием.
- **Ретроактивная выдача наград:** Если вы уже выполнили условия для достижения до этого обновления, программа автоматически выдаст все медали при запуске.


## [1.2.1] - 2026-08-21
### Added
- **Умные шаблоны названий (Smart Templates):** Добавлена настройка "Шаблон названия" в раздел ОБЩИЕ. Поддержка переменных `{title}` (оригинальное название стрима) и `{date}` (текущая дата).
- **Авто-Обложки (Thumbnails):** Автоматическое скачивание оригинальной обложки Twitch-стрима и установка её в качестве значка видео при загрузке на YouTube.


## [1.2.0] - 2026-08-21
### Added
- **Batch Processing (Очередь):** Добавлена система очередей! Теперь можно добавлять несколько видео в очередь, и программа будет автономно скачивать, нарезать и выгружать их последовательно.
- **Инлайн Нарезка (Fast Trim):** Быстрая нарезка видео напрямую без перекодировки (FFmpeg stream copy). Интегрирована в карточки платформ на главном экране (YouTube, VK, Telegram).
- **Продвинутый Ретро-UI:** Полностью переработан экран настроек. Добавлены стилизованные кнопки шифтов (LB/RB) с горячими клавишами (Q/E).
- **Сканлайны и ЭЛТ-эффекты:** Добавлена глобальная CRT-виньетка и полупрозрачные сканлайны для полного погружения в ретро-стиль.
- **Мигание интерфейса:** Терминальный курсор в Настройках, мигающая надпись "INSERT COIN".
- **Улучшенный Трей:** При закрытии приложения (крестик) теперь появляется системное диалоговое окно с предложением свернуть программу в трей (фоновый режим) или полностью закрыть. Кнопка сворачивания работает штатно.


## [1.1.4] - 2026-08-20
### Restored
- Re-integrated the `<Dashboard />` (Mission Control) component into `App.tsx` handling complex upload progress and states.
- Restored the Gamification block (Rank and XP bar) to the bottom of the left Sidebar.
- Fixed the Save button logic missing state updates for `vkGroupId`, `tgTopicId`, and `vkPostToWall`.
- Re-enabled history navigation in the Sidebar.

## [1.1.3] - 2026-08-19
### Fixed
- Restored missing Telegram Topic ID configuration fields.
- Restored VK "Post to Wall" configuration fields.
- Fixed logic to properly save Telegram Topic ID and VK Group ID to local storage upon saving settings.

## [1.1.2] - 2026-08-17
### Fixed
- Reconstructed and restored App.tsx layout to its final working state with Sidebar and Dashboard properly linked.
- Fixed React and Framer Motion unclosed tags crashing the build.
- Fixed PixelCheckbox typescript properties definition.
- Restored multi-platform tabbed settings configuration screen.

## [1.1.1] - 2026-08-17
### Fixed
- Fixed black screen issue by changing the transparent frame color fallback to #0d0f1a.
- Included updated SCIFI background styles and grid animations.

## [1.1.0] - 2026-08-16
### Added
- Phase 9: Video Trimming (Start and End times for yt-dlp).
- Phase 9.5: Gamification Engine (XP, Rank, Medals, Level Up Popups, Ship Skins).
- Implemented Triple Threat, 100 Broadcasts, First Contact, and Hot Streak medals.
- Added visual progress for Rank and XP in the main Sidebar.

### Changed
- Shifted internal parsing logic to securely store and fetch tokens locally via safeStorage.
- Refactored App.tsx state management for cleaner startup routines.
