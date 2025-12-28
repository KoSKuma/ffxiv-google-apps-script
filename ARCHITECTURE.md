# Architecture Documentation

## Project Overview

This Google Apps Script project is designed to automate and enhance Google Sheets functionality for FFXIV-related data management and processing.

## File Structure

```
.
├── Code.gs              # Main entry point, menu setup, and public API functions
├── Config.gs            # Configuration constants and settings (INTERNAL)
├── Utils.gs             # Reusable utility functions (INTERNAL)
├── FFXIVAPI.gs          # FFXIV API integration functions (INTERNAL)
├── Test.gs              # Test functions for debugging (not pushed to production)
├── LIBRARY_TEMPLATE.gs  # Template code for library integration (not pushed)
├── appsscript.json      # Apps Script manifest and configuration
└── [Feature].gs         # Additional feature-specific modules (add as needed)
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

### FFXIVAPI.gs
- **INTERNAL**: FFXIV API integration functions (not directly accessible as library)
- Functions for interacting with XIVAPI v2 and Garland Tools APIs
- Item search, item details retrieval, gathering locations, vendor info, crafting recipes
- Used internally by public functions in Code.gs
- Functions: `searchItemByName()`, `getItemDetails()`, `getGatheringLocations()`, `getVendorInfo()`, `getCraftingTree()`, etc.

### Test.gs
- **DEVELOPMENT ONLY**: Test functions for debugging and development
- Not pushed to production (excluded via `.claspignore`)
- Contains test functions for all public API functions
- Used for local testing and validation

### LIBRARY_TEMPLATE.gs
- **TEMPLATE**: Copy-paste code for library integration
- Not pushed to production (excluded via `.claspignore`)
- Contains menu setup code for spreadsheets using the library
- Library users copy this code to their spreadsheet's script editor

### Feature Modules
- Self-contained feature logic
- Feature-specific functions
- Should be independent and reusable
- Marked as INTERNAL if not part of public API

## Data Flow

1. **User Interaction** → Menu item or library function call
2. **Code.gs** → Public API functions orchestrate the flow
3. **FFXIVAPI.gs** → External API calls (XIVAPI, Garland Tools)
4. **Utils.gs** → Helper functions for spreadsheet operations
5. **Config.gs** → Provides configuration values
6. **Spreadsheet** → Data source/destination

**Example Flow:**
```
User calls: LibraryName.lookupItemInfo('Iron Ore')
  ↓
Code.gs: lookupItemInfo()
  ↓
FFXIVAPI.gs: searchItemByName() → XIVAPI v2
  ↓
FFXIVAPI.gs: getItemDetails() → Garland Tools
  ↓
FFXIVAPI.gs: getGatheringLocations(), getVendorInfo()
  ↓
Code.gs: Returns formatted result
```

## Design Patterns

### Library-Friendly Pattern (Hybrid Approach)
- **Public Functions**: High-level functions in `Code.gs` that expose complete functionality
- **Internal Utilities**: `Utils.gs` functions used by public functions (not exposed)
- **Internal Config**: `Config.gs` constants used by public functions (not exposed)
- **Internal API Integration**: `FFXIVAPI.gs` functions used by public functions (not exposed)
- Library users only need to call public functions - all internals are handled automatically
- Example: `LibraryName.lookupItemInfo(itemName)` uses CONFIG, Utils, and FFXIVAPI internally

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
1. Create a new `.gs` file for the feature (internal utilities) OR add to existing `FFXIVAPI.gs` if API-related
2. Add high-level public function to `Code.gs` that uses the feature
3. Add internal utility functions to `Utils.gs` if needed (spreadsheet operations)
4. Add internal API functions to `FFXIVAPI.gs` if needed (external API calls)
5. Add configuration to `Config.gs` if needed
6. Update `FEATURE.md` with feature documentation
7. Update `API.md` with public API documentation
8. Document in this file

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
  try {
    // Uses CONFIG internally
    const sheetName = param2 || CONFIG.SHEET_NAMES.MAIN;
    
    // Uses Utils internally
    const sheet = getOrCreateSheet(sheetName);
    
    // Uses FFXIVAPI internally
    const searchResult = searchItemByName(itemName);
    const garlandData = getItemDetails(searchResult.ID);
    
    // Process and return
    return {
      itemName: garlandData.item.name,
      gatheringLocations: getGatheringLocations(garlandData),
      vendors: getVendorInfo(searchResult.ID, garlandData)
    };
  } catch (error) {
    logWithTimestamp('Error in myNewFunction: ' + error.toString());
    throw error;
  }
}
```

## File Exclusion

Some files are excluded from being pushed to Apps Script via `.claspignore`:
- `Test.gs` - Development test functions
- `LIBRARY_TEMPLATE.gs` - Template code for library users
- Documentation files (`.md` files)
- Configuration files (`.json`, `.gitignore`, etc.)

This prevents conflicts and keeps the production code clean.

