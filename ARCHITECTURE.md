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
- **PUBLIC API**: All functions in this file are exposed when used as a library
- Entry point for the application
- Menu creation (`onOpen` trigger) - only works in bound spreadsheet
- High-level business logic functions
- Functions use internal utilities and config automatically
- Library users call: `LibraryName.functionName()`

### Config.gs
- **INTERNAL**: Configuration constants (not directly accessible as library)
- All configuration values centralized here
- Sheet names mapping
- Column indices
- Spreadsheet IDs
- API endpoints (if applicable)
- Feature flags
- Used internally by public functions in Code.gs

### Utils.gs
- **INTERNAL**: Utility functions (not directly accessible as library)
- Common spreadsheet operations
- Data manipulation helpers
- Logging utilities
- Error handling helpers
- Used internally by public functions in Code.gs

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

### Library-Friendly Pattern (Hybrid Approach)
- **Public Functions**: High-level functions in `Code.gs` that expose complete functionality
- **Internal Utilities**: `Utils.gs` functions used by public functions (not exposed)
- **Internal Config**: `Config.gs` constants used by public functions (not exposed)
- Library users only need to call public functions - all internals are handled automatically
- Example: `LibraryName.lookupItemInfo(itemName)` uses CONFIG and Utils internally

### Configuration Pattern
- All configuration values centralized in `Config.gs`
- Use `CONFIG` object for easy access
- Avoid hardcoding values in functions
- Config is internal - public functions use it automatically

### Utility Pattern
- Common operations abstracted to `Utils.gs`
- Functions should be pure when possible
- Document function parameters and return types
- Utilities are internal - public functions use them automatically

### Error Handling Pattern
- Wrap main functions in try-catch blocks
- Log errors with context using `logWithTimestamp()`
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
1. Create a new `.gs` file for the feature (internal utilities)
2. Add high-level public function to `Code.gs` that uses the feature
3. Add internal utility functions to `Utils.gs` if needed
4. Add configuration to `Config.gs` if needed
5. Document in this file

### Adding New Public Functions (Library API)

When adding a new public function:
1. Add function to `Code.gs` with `@public` documentation
2. Use internal utilities from `Utils.gs`
3. Use config from `Config.gs` internally
4. Document parameters and return values
5. Update `API.md` with function documentation

Example:
```javascript
/**
 * PUBLIC API: Description of what this function does
 * 
 * When used as library: LibraryName.myNewFunction(param1, param2)
 * 
 * @param {string} param1 - Description
 * @param {number} [param2] - Optional description
 * @return {Array} Description of return value
 */
function myNewFunction(param1, param2) {
  // Uses CONFIG internally
  const sheetName = param2 || CONFIG.SHEET_NAMES.MAIN;
  
  // Uses FFXIVAPI internally
  const searchResult = searchItemByName(itemName);
  const garlandData = getItemDetails(searchResult.ID);
  
  // Process and return
  return {
    itemName: garlandData.item.name,
    gatheringLocations: getGatheringLocations(garlandData),
    vendors: getVendorInfo(searchResult.ID, garlandData)
  };
}
```

