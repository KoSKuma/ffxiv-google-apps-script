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
   **Note:** Files listed in `.claspignore` (like `LIBRARY_TEMPLATE.gs`) are excluded from push to prevent conflicts.
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

1. Create a new `.gs` file (e.g., `DataProcessor.gs`)
2. Implement feature functions
3. Add menu item in `Code.gs` `onOpen()` function
4. Update `ARCHITECTURE.md` if needed
5. Add configuration to `Config.gs` if required

### Function Naming Conventions

- Use camelCase for function names
- Use descriptive names that indicate purpose
- Prefix test functions with `test` (e.g., `testCalculateTotal`)
- Use verbs for action functions (e.g., `processData`, `fetchRecords`)

### Example Feature Structure

```javascript
/**
 * Feature: Data Processor
 * Handles data transformation and processing
 */

/**
 * Processes data from the active sheet
 * @param {Array<Array>} data - Raw data to process
 * @return {Array<Array>} Processed data
 */
function processData(data) {
  // Implementation
}
```

## Testing

### Manual Testing
- Test functions individually in Apps Script editor
- Use `Logger.log()` for debugging
- Check execution logs for errors
- Use `Test.gs` file for dedicated test functions

### Test Functions
- Test functions are in `Test.gs` file (safe to keep, won't be removed)
- All test functions have `test` prefix
- Test edge cases and error conditions
- Use `onTestOpen()` to create test menu for easy access
- Test functions can be run individually from Apps Script editor

### Using Test.gs
1. Push code: `clasp push`
2. Open Apps Script editor: `clasp open`
3. Select test function from dropdown (e.g., `testSearchItem`)
4. Click Run
5. View logs: View → Logs or run `clasp logs`

**Available Test Functions:**
- `testSearchItem()` - Test item search
- `testGetItemDetails()` - Test item details retrieval
- `testLookupItemInfo()` - Test full item lookup
- `testGatheringLocations()` - Test gathering location extraction
- `testVendorInfo()` - Test vendor information
- `testAPIConnectivity()` - Test API connection
- `testMultipleItems()` - Test multiple items
- `testProcessItemList()` - Test batch processing

## Debugging

### Logging
- Use `Logger.log()` for general logging
- Use `logWithTimestamp()` from Utils.gs for timestamped logs
- Remove debug logs before production

### Common Issues

1. **Permission Errors**: Ensure OAuth scopes are correct in `appsscript.json`
2. **Execution Timeout**: Optimize loops, use batch operations
3. **Quota Exceeded**: Implement rate limiting, cache results
4. **Type Errors**: Validate data types, use JSDoc for clarity

## Deployment

### Version Control
- Commit changes regularly
- Use meaningful commit messages
- Tag releases appropriately

### Deployment Steps

1. Test thoroughly in Apps Script editor
2. Remove debug logs and test code
3. Update version in comments if needed
4. Push final version:
   ```bash
   clasp push
   ```
5. Create deployment if needed:
   ```bash
   clasp deploy
   ```

## Best Practices

- **Keep functions small and focused**
- **Use meaningful variable names**
- **Add JSDoc comments for all functions**
- **Handle errors gracefully**
- **Cache frequently accessed data**
- **Use batch operations**
- **Validate inputs**
- **Test edge cases**

## Resources

- [Apps Script Documentation](https://developers.google.com/apps-script)
- [clasp Documentation](https://github.com/google/clasp)
- [Apps Script Best Practices](https://developers.google.com/apps-script/guides/support/best-practices)

