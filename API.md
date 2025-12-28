# API Documentation

## Function Reference

### Code.gs

#### `onOpen()`
Runs automatically when the spreadsheet is opened. Creates custom menu items.

**Triggers**: `onOpen` (automatic)

**Returns**: `void`

---

#### `main()`
Main entry point for manual execution. Orchestrates the primary workflow.

**Returns**: `void`

**Throws**: Logs errors and shows alert to user

---

### Utils.gs

#### `getActiveSpreadsheet()`
Gets the currently active spreadsheet.

**Returns**: `Spreadsheet` - The active spreadsheet object

---

#### `getOrCreateSheet(sheetName)`
Gets a sheet by name, creating it if it doesn't exist.

**Parameters**:
- `sheetName` (string) - Name of the sheet to get or create

**Returns**: `Sheet` - The sheet object

**Example**:
```javascript
const sheet = getOrCreateSheet('Data');
```

---

#### `getDataRange(sheet)`
Gets the data range of a sheet (all cells with data).

**Parameters**:
- `sheet` (Sheet) - The sheet object

**Returns**: `Range` - The data range object

---

#### `getSheetValues(sheet)`
Gets all values from a sheet as a 2D array.

**Parameters**:
- `sheet` (Sheet) - The sheet object

**Returns**: `Array<Array>` - 2D array of values (rows × columns)

**Example**:
```javascript
const values = getSheetValues(sheet);
// values[0][0] is first row, first column
```

---

#### `setSheetValues(sheet, row, col, values)`
Sets values to a sheet starting at the specified position.

**Parameters**:
- `sheet` (Sheet) - The sheet object
- `row` (number) - Starting row (1-based)
- `col` (number) - Starting column (1-based)
- `values` (Array<Array>) - 2D array of values to set

**Returns**: `void`

**Example**:
```javascript
const data = [['Name', 'Value'], ['Item1', 100]];
setSheetValues(sheet, 1, 1, data);
```

---

#### `clearSheet(sheet)`
Clears all data from a sheet.

**Parameters**:
- `sheet` (Sheet) - The sheet object

**Returns**: `void`

---

#### `logWithTimestamp(message)`
Logs a message with ISO timestamp.

**Parameters**:
- `message` (string) - Message to log

**Returns**: `void`

**Example**:
```javascript
logWithTimestamp('Processing started');
// Logs: [2024-01-01T12:00:00.000Z] Processing started
```

---

### Config.gs

#### `CONFIG`
Configuration object containing all project settings.

**Structure**:
```javascript
{
  SHEET_NAMES: {
    MAIN: 'Main',
    DATA: 'Data',
  },
  COLUMNS: {
    // Column mappings
  },
  // Other configuration values
}
```

**Usage**:
```javascript
const mainSheet = getOrCreateSheet(CONFIG.SHEET_NAMES.MAIN);
```

---

## Data Types

### Spreadsheet
Google Apps Script Spreadsheet object. Represents the entire spreadsheet file.

### Sheet
Google Apps Script Sheet object. Represents a single sheet/tab within a spreadsheet.

### Range
Google Apps Script Range object. Represents a cell or group of cells.

### Array<Array>
2D array where:
- First dimension represents rows
- Second dimension represents columns
- Example: `[['Header1', 'Header2'], ['Value1', 'Value2']]`

---

## Error Handling

All functions should handle errors appropriately:

```javascript
try {
  // Function logic
} catch (error) {
  Logger.log('Error: ' + error.toString());
  // Handle error appropriately
}
```

---

## Common Patterns

### Reading Data
```javascript
const sheet = getOrCreateSheet('Data');
const values = getSheetValues(sheet);
// Process values array
```

### Writing Data
```javascript
const sheet = getOrCreateSheet('Output');
const data = [['Header1', 'Header2'], ['Value1', 'Value2']];
setSheetValues(sheet, 1, 1, data);
```

### Processing Rows
```javascript
const values = getSheetValues(sheet);
const headers = values[0]; // First row
const dataRows = values.slice(1); // Remaining rows

dataRows.forEach((row, index) => {
  // Process each row
  // row[0] is first column, row[1] is second column, etc.
});
```

---

## Adding New Functions

When adding new functions:

1. Add JSDoc comments with:
   - Function description
   - `@param` for each parameter (type and description)
   - `@return` for return value (type and description)
   - `@throws` if function can throw errors

2. Update this file with the new function documentation

3. Follow existing naming and structure conventions

