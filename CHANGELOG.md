# Changelog

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
