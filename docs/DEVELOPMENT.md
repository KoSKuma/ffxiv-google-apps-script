# Development Guide

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google account with Sheets access
- clasp CLI tool

### Initial Setup

1. Install clasp globally:
   ```bash
   npm install -g @google/clasp
   ```

2. Login to Google:
   ```bash
   clasp login
   ```

3. Create or clone your Apps Script project:
   ```bash
   # If creating new project
   clasp create --type sheets --title "FFXIV Google Apps Script"
   
   # If cloning existing project
   clasp clone <scriptId>
   ```

4. Install dependencies (if any):
   ```bash
   npm install
   ```

## Development Workflow

### Local Development

1. **Edit files locally** in your preferred editor
2. **Test your changes** by pushing to Apps Script:
   ```bash
   npm run push
   # or
   clasp push
   ```
   **Note:** Files listed in `.claspignore` (like `LIBRARY_TEMPLATE.gs` and documentation files) are excluded from push. `Test.gs` is included to allow testing in the Apps Script editor.
3. **Open in Apps Script editor** to test:
   ```bash
   npm run open
   # or
   clasp open-script
   ```
4. **View logs** after execution:
   ```bash
   npm run logs
   # or
   clasp logs
   ```

### Pulling Changes

If you make changes in the Apps Script editor:
```bash
npm run pull
# or
clasp pull
```

## Code Organization

### Adding a New Feature

1. **Determine where to add code:**
   - **API integration**: Add to `FFXIVAPI.gs` (internal functions)
   - **Spreadsheet operations**: Add to `Utils.gs` (internal utilities)
   - **Public API**: Add to `Code.gs` (exposed to library users)
   - **New feature module**: Create new `.gs` file if needed

2. **Implement feature functions:**
   - Add internal functions to appropriate module
   - Add public API function to `Code.gs` if needed
   - Use JSDoc comments for documentation

3. **Add menu item** in `Code.gs` `onOpen()` function (if user-facing)

4. **Update documentation:**
   - Update `FEATURE.md` with feature details
   - Update `API.md` if adding public API function
   - Update `ARCHITECTURE.md` if structure changes
   - Update `TODO.md` to mark feature complete

5. **Add configuration** to `Config.gs` if required

6. **Add test function** to `Test.gs` for testing

### Function Naming Conventions

- Use camelCase for function names
- Use descriptive names that indicate purpose
- Prefix test functions with `test` (e.g., `testCalculateTotal`)
- Use verbs for action functions (e.g., `processData`, `fetchRecords`)

### Example Feature Structure

**For API Integration (FFXIVAPI.gs):**
```javascript
/**
 * Internal function: Gets item information from external API
 * @param {number} itemId - The item ID
 * @return {Object} Item information
 */
function getItemDetails(itemId) {
  // API call implementation
  // Returns data structure
}
```

**For Public API (Code.gs):**
```javascript
/**
 * PUBLIC API: Looks up item information
 * 
 * When used as library: LibraryName.lookupItemInfo(itemName)
 * 
 * @param {string} itemName - Name of the item
 * @return {Object} Item information object
 */
function lookupItemInfo(itemName) {
  try {
    // Uses internal functions from FFXIVAPI.gs
    const searchResult = searchItemByName(itemName);
    const garlandData = getItemDetails(searchResult.ID);
    
    // Process and return
    return {
      itemName: garlandData.item.name,
      gatheringLocations: getGatheringLocations(garlandData),
      vendors: getVendorInfo(searchResult.ID, garlandData)
    };
  } catch (error) {
    logWithTimestamp('Error: ' + error.toString());
    throw error;
  }
}
```

## Testing

### Manual Testing
- Test functions individually in Apps Script editor
- Use `Logger.log()` for debugging
- Check execution logs for errors
- Use `Test.gs` file for dedicated test functions

### Test Functions
- Test functions are in `Test.gs` file (kept in production for debugging)
- All test functions have `test` prefix
- Test edge cases and error conditions
- Use `onTestOpen()` to create test menu for easy access
- Test functions can be run individually from Apps Script editor

### Using Test.gs
1. Push code: `clasp push` or `npm run push`
2. Open Apps Script editor: `clasp open-script` or `npm run open`
3. Select test function from dropdown (e.g., `testSearchItem`)
4. Click Run
5. View logs: View → Logs or run `clasp logs` or `npm run logs`

**Note:** `Test.gs` is included in pushes (not excluded in `.claspignore`) to allow testing functions directly in the Apps Script editor. This is intentional - test functions are kept in production for debugging purposes.

**Available Test Functions:**
- `testSearchItem()` - Test item search via XIVAPI
- `testGetItemDetails()` - Test item details retrieval from Garland Tools
- `testLookupItemInfo()` - Test full item lookup (gathering + vendors)
- `testGatheringLocations()` - Test gathering location extraction
- `testVendorInfo()` - Test vendor information extraction
- `testProcessItemList()` - Test batch item processing from spreadsheet
- `testAPIConnectivity()` - Test API connection and error handling
- `testMultipleItems()` - Test processing multiple items
- `testGetCraftingMaterials()` - Test crafting materials with recursive sub-ingredients
- `testGetCraftingMaterialsDirectOnly()` - Test crafting materials (direct ingredients only)

## Debugging

### Logging
- Use `Logger.log()` for general logging
- Use `logWithTimestamp()` from Utils.gs for timestamped logs
- Remove debug logs before production

### Common Issues

1. **Permission Errors**: 
   - Ensure OAuth scopes are correct in `appsscript.json`
   - When using as library, users need to authorize the library

2. **Execution Timeout**: 
   - Optimize loops, use batch operations
   - Apps Script has 6-minute execution limit
   - Break large operations into smaller chunks

3. **Quota Exceeded**: 
   - Implement rate limiting (use `Utilities.sleep()` between API calls)
   - Cache results when possible
   - XIVAPI and Garland Tools have rate limits

4. **Type Errors**: 
   - Validate data types, use JSDoc for clarity
   - Check API response structure matches expectations

5. **API Errors**:
   - XIVAPI search can be unreliable - code includes retry logic
   - Check `API_DOCUMENTATION.md` for correct endpoint usage
   - See `NON_WORKING_APIS.md` for APIs that don't work

6. **Library Conflicts**:
   - `LIBRARY_TEMPLATE.gs` is excluded from push to prevent `onOpen()` conflicts
   - Library users should copy code from `LIBRARY_TEMPLATE.gs` to their spreadsheet

## Deployment

### Version Control
- Commit changes regularly
- Use meaningful commit messages
- Tag releases appropriately

### Deployment Steps

1. **Test thoroughly** in Apps Script editor using `Test.gs` functions
2. **Update documentation:**
   - Update `FEATURE.md` with feature details and version
   - Update `API.md` if adding/changing public API
   - Update `TODO.md` to mark tasks complete
3. **Review code:**
   - Remove excessive debug logs (keep `logWithTimestamp()` for important events)
   - Ensure error handling is in place
   - Verify all public functions have JSDoc comments
4. **Push final version:**
   ```bash
   npm run push
   # or
   clasp push
   ```
5. **Test in production** (bound spreadsheet or as library)
6. **Create deployment** if needed (for standalone scripts):
   ```bash
   clasp deploy
   ```

### Library Deployment

When deploying as a library:
1. Push code to Apps Script project
2. In Apps Script editor: Publish → Deploy as library
3. Set version description
4. Share Script ID with users
5. Users add library via: Resources → Libraries → Add library
6. Users copy menu code from `LIBRARY_TEMPLATE.gs` to their spreadsheet

## Best Practices

### Code Organization
- **Keep functions small and focused** - Single responsibility principle
- **Use meaningful variable names** - Clear, descriptive names
- **Add JSDoc comments for all functions** - Especially public API functions
- **Separate concerns** - Public API in `Code.gs`, internals in other files
- **Mark internal functions** - Use comments to indicate internal vs public

### Error Handling
- **Handle errors gracefully** - Use try-catch blocks
- **Log errors with context** - Use `logWithTimestamp()` for debugging
- **Provide user-friendly messages** - Don't expose internal errors to users
- **Validate inputs** - Check parameters before processing

### Performance
- **Cache frequently accessed data** - Spreadsheet objects, API responses when safe
- **Use batch operations** - `getValues()`/`setValues()` instead of cell-by-cell
- **Implement rate limiting** - Use `Utilities.sleep()` between API calls
- **Minimize API calls** - Pass data between functions to avoid duplicate calls

### API Integration
- **Respect rate limits** - Add delays between external API calls
- **Handle API errors** - Implement retry logic for unreliable APIs
- **Document API usage** - Update `API_DOCUMENTATION.md` when using new endpoints
- **Test API connectivity** - Use `testAPIConnectivity()` function

### Testing
- **Test edge cases** - Empty inputs, missing data, API failures
- **Test with real data** - Use actual item names and IDs
- **Keep test functions** - `Test.gs` is safe to keep in production
- **Document test functions** - Add JSDoc comments to test functions

## Resources

- [Apps Script Documentation](https://developers.google.com/apps-script)
- [clasp Documentation](https://github.com/google/clasp)
- [Apps Script Best Practices](https://developers.google.com/apps-script/guides/support/best-practices)

