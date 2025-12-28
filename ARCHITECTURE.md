# Architecture Documentation

## Project Overview

This Google Apps Script project is designed to automate and enhance Google Sheets functionality for FFXIV-related data management and processing.

## File Structure

```
.
├── Code.gs              # Main entry point, menu setup, and primary functions
├── Config.gs            # Configuration constants and settings
├── Utils.gs             # Reusable utility functions
├── appsscript.json      # Apps Script manifest and configuration
└── [Feature].gs         # Feature-specific modules (add as needed)
```

## Module Responsibilities

### Code.gs
- Entry point for the application
- Menu creation (`onOpen` trigger)
- Main orchestration functions
- High-level business logic

### Config.gs
- All configuration constants
- Sheet names mapping
- Column indices
- API endpoints (if applicable)
- Feature flags

### Utils.gs
- Common spreadsheet operations
- Data manipulation helpers
- Logging utilities
- Error handling helpers

### Feature Modules
- Self-contained feature logic
- Feature-specific functions
- Should be independent and reusable

## Data Flow

1. **User Interaction** → Menu item or trigger
2. **Code.gs** → Orchestrates the flow
3. **Feature Modules** → Execute business logic
4. **Utils.gs** → Helper functions for data operations
5. **Config.gs** → Provides configuration values
6. **Spreadsheet** → Data source/destination

## Design Patterns

### Configuration Pattern
- All configuration values centralized in `Config.gs`
- Use `CONFIG` object for easy access
- Avoid hardcoding values in functions

### Utility Pattern
- Common operations abstracted to `Utils.gs`
- Functions should be pure when possible
- Document function parameters and return types

### Error Handling Pattern
- Wrap main functions in try-catch blocks
- Log errors with context
- Provide user-friendly error messages
- Use `logWithTimestamp()` for debugging

## Performance Considerations

- Cache spreadsheet and sheet objects
- Use batch operations (`getValues`/`setValues`)
- Minimize calls to SpreadsheetApp methods
- Process data in memory when possible
- Consider execution time limits (6 minutes)

## Extension Points

To add new features:
1. Create a new `.gs` file for the feature
2. Add feature-specific functions
3. Update `Code.gs` to integrate the feature
4. Add configuration to `Config.gs` if needed
5. Document in this file

