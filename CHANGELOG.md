# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-28

### Added
- **Item Information Lookup**: Retrieve gathering locations, vendor prices (Gil and special currencies), and aetherial reduction sources for FFXIV items
- **Crafting Request Processing**: Batch process crafting requests with automatic recursive material calculation
- **Debug/Utility Tools**: Testing tools for individual item lookup and crafting materials
- **Library-Friendly Architecture**: Designed to work as both bound spreadsheet and library
- **Comprehensive Documentation**: Full documentation including setup guides, API reference, and Google Sheets formulas

### Technical
- Library-friendly architecture with public API and internal utilities
- Error handling and logging with user-friendly messages
- Rate limiting for external API calls
- Cycle detection and depth limiting for crafting recipes
- Dynamic row insertion for spreadsheet updates

**Full Release Notes:** [releases/v1.0.0.md](releases/v1.0.0.md)

---

[1.0.0]: https://github.com/KoSKuma/ffxiv-google-apps-script/releases/tag/v1.0.0

