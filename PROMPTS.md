# AI Development Prompts

This document contains helpful prompts and context for AI assistants working on this project.

## Project Context

This is a Google Apps Script project for automating and enhancing Google Sheets functionality, specifically for FFXIV-related data management.

## Key Information for AI Assistants

### Project Structure
- Main entry: `Code.gs`
- Configuration: `Config.gs`
- Utilities: `Utils.gs`
- Manifest: `appsscript.json`

### Development Environment
- Uses `clasp` for local development
- Files use `.gs` extension for Google Apps Script
- HTML files use `.html` extension
- Runtime: V8 (modern JavaScript supported)

### Common Tasks

#### Adding a New Feature
```
I need to add a new feature that [description]. 
- Create a new .gs file for this feature
- Add menu integration in Code.gs
- Update Config.gs if configuration is needed
- Follow the existing code style and documentation patterns
```

#### Debugging
```
I'm experiencing [issue description]. 
- Check the error logs
- Review the relevant functions in [file]
- Suggest fixes following the project's error handling patterns
```

#### Performance Optimization
```
The function [function name] is slow when processing [data size].
- Review the implementation
- Suggest optimizations using batch operations
- Consider caching strategies
```

### Code Patterns to Follow

#### Function Template
```javascript
/**
 * [Description]
 * @param {Type} param - Description
 * @return {Type} Description
 */
function functionName(param) {
  try {
    // Implementation
  } catch (error) {
    Logger.log('Error in functionName: ' + error.toString());
    throw error;
  }
}
```

#### Sheet Operations
- Always use `getOrCreateSheet()` from Utils.gs
- Use batch operations: `getSheetValues()` and `setSheetValues()`
- Cache sheet objects when used multiple times

#### Configuration
- Add constants to `CONFIG` object in Config.gs
- Reference via `CONFIG.SHEET_NAMES.MAIN` etc.

### Important Constraints

1. **Execution Limits**: 6 minutes maximum execution time
2. **Quota Limits**: Be mindful of API call quotas
3. **Permissions**: Request minimal necessary OAuth scopes
4. **Error Handling**: Always include try-catch blocks
5. **Logging**: Use `logWithTimestamp()` for debugging

### Common Patterns

#### Reading Sheet Data
```javascript
const sheet = getOrCreateSheet(CONFIG.SHEET_NAMES.DATA);
const values = getSheetValues(sheet);
const headers = values[0];
const dataRows = values.slice(1);
```

#### Writing Sheet Data
```javascript
const sheet = getOrCreateSheet(CONFIG.SHEET_NAMES.OUTPUT);
const data = [headers, ...processedRows];
setSheetValues(sheet, 1, 1, data);
```

#### Menu Integration
```javascript
// In Code.gs onOpen()
ui.createMenu('FFXIV Tools')
  .addItem('New Feature', 'newFeatureFunction')
  .addToUi();
```

### When Making Changes

1. **Check existing patterns** in similar files
2. **Update documentation** (API.md, ARCHITECTURE.md)
3. **Follow naming conventions** (camelCase for functions)
4. **Add JSDoc comments** for all functions
5. **Test thoroughly** before suggesting deployment

### Useful Context for AI

- This project uses modern JavaScript (ES6+)
- All functions should be documented with JSDoc
- Error handling is mandatory
- Performance is important (batch operations)
- Configuration is centralized in Config.gs
- Utilities are in Utils.gs for reusability

### Example AI Prompts

**For adding features:**
"Add a new feature to [do something]. Follow the project structure, add proper documentation, and integrate it into the menu system."

**For fixing bugs:**
"Fix the issue where [problem]. Review the error handling and ensure it follows project patterns."

**For refactoring:**
"Refactor [function/file] to improve [aspect]. Maintain existing functionality and update documentation."

**For optimization:**
"Optimize [function] to handle larger datasets. Use batch operations and caching where appropriate."

