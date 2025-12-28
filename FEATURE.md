# Feature Documentation

This document tracks all features available in the FFXIV Google Apps Script project, including how they work and how to use them.

## Table of Contents

### 📝 Example Features (May be removed)

**Note:** The following features are example/demo code to demonstrate the library architecture. They may be removed or replaced when actual FFXIV features are implemented.

#### Basic Utilities (Examples)
- [Add Timestamp](#-add-timestamp) - `addTimestamp()` ⚠️ Example
- [Hello World](#-hello-world) - `helloWorld()` ⚠️ Example
- [Read Active Cell](#-read-active-cell) - `readActiveCell()` ⚠️ Example

#### Data Processing (Examples)
- [Process Data](#-process-data) - `processData(sheetName, range)` ⚠️ Example
- [Process Data from Another Spreadsheet](#-process-data-from-another-spreadsheet) - `processDataFromSpreadsheet(spreadsheetId, sheetName, range)` ⚠️ Example
- [Get Data from Spreadsheet](#-get-data-from-spreadsheet) - `getDataFromSpreadsheet(spreadsheetId, sheetName)` ⚠️ Example

### ✅ Implemented Features
_No production features implemented yet._

### 🟡 In Progress Features
- [Item Information Lookup (MVP)](#-item-information-lookup-mvp) - `lookupItemInfo(itemName)` / `processItemList(sheetName, itemColumn, startRow)`

### ⬜ Planned Features
- [Item Information Lookup (Full)](#-item-information-lookup-full) - Full version with market board prices

---

## Feature Status

- ✅ **Implemented** - Feature is complete and working
- 🟡 **In Progress** - Feature is being developed
- ⬜ **Planned** - Feature is planned but not yet started
- ❌ **Deprecated** - Feature is no longer recommended/used

---

## Example Features (May be Removed)

**⚠️ Important:** The features below are example/demo code created to demonstrate the library architecture and development workflow. They serve as templates and may be removed or replaced when actual FFXIV-specific features are implemented.

### Basic Utilities (Examples)

#### ✅ Add Timestamp ⚠️ Example
**Function:** `addTimestamp()`

Adds a timestamp to cell A1 of the active sheet.

**Usage:**
- **As library:** `LibraryName.addTimestamp()`
- **In bound spreadsheet:** Available via menu "FFXIV Tools" → "Add Timestamp"

**How it works:**
- Gets the active sheet
- Writes current timestamp to cell A1
- Shows success alert to user

**Example:**
```javascript
FFXIVTools.addTimestamp();
// Result: Cell A1 contains "Last updated: [timestamp]"
```

---

#### ✅ Hello World ⚠️ Example
**Function:** `helloWorld()`

Writes "Hello World from Apps Script!" to the currently selected cell.

**Usage:**
- **As library:** `LibraryName.helloWorld()`
- **In bound spreadsheet:** Available via menu "FFXIV Tools" → "Hello World"

**How it works:**
- Gets the active cell
- Writes "Hello World from Apps Script!" to that cell
- Shows alert with cell address

**Example:**
```javascript
FFXIVTools.helloWorld();
// Result: Active cell contains "Hello World from Apps Script!"
```

---

#### ✅ Read Active Cell ⚠️ Example
**Function:** `readActiveCell()`

Reads and displays the value from the currently selected cell.

**Usage:**
- **As library:** `LibraryName.readActiveCell()`
- **In bound spreadsheet:** Available via menu "FFXIV Tools" → "Read Active Cell"

**Returns:** `string` - The value in the active cell

**How it works:**
- Gets the active cell
- Reads its value
- Shows alert with cell address and value
- Returns the value

**Example:**
```javascript
const value = FFXIVTools.readActiveCell();
// Shows alert: "Cell A1 contains: 'Hello'"
// Returns: "Hello"
```

---

### Data Processing (Examples)

#### ✅ Process Data ⚠️ Example
**Function:** `processData(sheetName, range)`

Processes data from the active sheet using internal utilities and config.

**Parameters:**
- `sheetName` (string, optional) - Sheet name (uses `CONFIG.SHEET_NAMES.MAIN` if not provided)
- `range` (string, optional) - Data range (defaults to 'A1:B10')

**Returns:** `Array<Array>` - Processed data array

**Usage:**
- **As library:** `LibraryName.processData(sheetName, range)`
- **In bound spreadsheet:** Available via menu "FFXIV Tools" → "Process Data"

**How it works:**
1. Gets or creates the specified sheet (uses internal `getOrCreateSheet()`)
2. Reads data from the specified range
3. Processes each row (adds a "Processed row X" column)
4. Writes processed data back to the sheet
5. Returns the processed data array

**Example:**
```javascript
// Process data from active sheet, default range
const result = FFXIVTools.processData();

// Process data from specific sheet and range
const result = FFXIVTools.processData('Data', 'A1:C20');
// Result: Array of processed rows
```

---

#### ✅ Process Data from Another Spreadsheet ⚠️ Example
**Function:** `processDataFromSpreadsheet(spreadsheetId, sheetName, range)`

Processes data from any spreadsheet by ID.

**Parameters:**
- `spreadsheetId` (string, required) - The ID of the spreadsheet to process
- `sheetName` (string, optional) - Sheet name (uses `CONFIG.SHEET_NAMES.MAIN` if not provided)
- `range` (string, optional) - Data range (defaults to 'A1:B10')

**Returns:** `Array<Array>` - Processed data array

**Usage:**
- **As library:** `LibraryName.processDataFromSpreadsheet(spreadsheetId, sheetName, range)`
- **In bound spreadsheet:** Available via menu "FFXIV Tools" → "Process Data from Another Sheet"

**How it works:**
1. Opens the spreadsheet by ID (uses internal `openSpreadsheetById()`)
2. Gets the specified sheet
3. Reads data from the specified range
4. Processes each row
5. Writes processed data back to the sheet
6. Returns the processed data array

**Example:**
```javascript
const spreadsheetId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
const result = FFXIVTools.processDataFromSpreadsheet(spreadsheetId, 'Data', 'A1:B10');
// Result: Array of processed rows from external spreadsheet
```

---

#### ✅ Get Data from Spreadsheet ⚠️ Example
**Function:** `getDataFromSpreadsheet(spreadsheetId, sheetName)`

Retrieves data from any spreadsheet as a 2D array.

**Parameters:**
- `spreadsheetId` (string, required) - The ID of the spreadsheet
- `sheetName` (string, optional) - Sheet name (uses `CONFIG.SHEET_NAMES.MAIN` if not provided)

**Returns:** `Array<Array>` - 2D array of values from the sheet

**Usage:**
- **As library:** `LibraryName.getDataFromSpreadsheet(spreadsheetId, sheetName)`

**How it works:**
1. Opens the spreadsheet by ID (uses internal `openSpreadsheetById()`)
2. Gets the specified sheet
3. Reads all data using internal `getSheetValues()`
4. Returns the data array

**Example:**
```javascript
const spreadsheetId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
const data = FFXIVTools.getDataFromSpreadsheet(spreadsheetId, 'Main');
// Result: [['Header1', 'Header2'], ['Value1', 'Value2'], ...]
```

---

## Implemented Features

_Production features will be listed here once implemented._

---

## In Progress Features

### 🟡 Item Information Lookup (MVP)

**Function:** `lookupItemInfo(itemName)` / `processItemList(sheetName, itemColumn, startRow)`

Looks up FFXIV item information including gathering locations and vendor prices. This is the MVP version that focuses on gathering locations and vendor prices only.

**Parameters:**
- `itemName` (string, required) - Name of the item to look up (e.g., "Iron Ore")
- `sheetName` (string, optional) - Sheet name for batch processing (uses `CONFIG.SHEET_NAMES.MAIN` if not provided)
- `itemColumn` (string, optional) - Column letter containing item names (defaults to 'A')
- `startRow` (number, optional) - Starting row number (defaults to 2, assuming row 1 is header)

**Returns:** 
- Single lookup: `Object` - Item information object
- Batch processing: `Array<Object>` - Array of item information objects

**Usage:**
- **As library:** `LibraryName.lookupItemInfo('Iron Ore')` or `LibraryName.processItemList('Items', 'A', 2)`
- **In bound spreadsheet:** Available via menu "FFXIV Tools" → "Lookup Item Info" or "Process Item List"

**How it works:**
1. Takes item name as input (e.g., "Iron Ore")
2. Calls XIVAPI to search for the item
3. Retrieves gathering location information (nodes, zones, gathering type)
4. Retrieves vendor information (NPC location, price, currency)
5. Returns structured data with all information
6. For batch processing: reads item names from spreadsheet column and processes each one

**Data Sources:**
- **XIVAPI** (https://xivapi.com/) - Primary API for item data, gathering locations, and vendor information
- Additional APIs may be used as needed

**Output Structure:**
```javascript
{
  itemName: "Iron Ore",
  itemId: 4,
  gatheringLocations: [
    {
      type: "Mining",
      zone: "Central Thanalan",
      node: "Mineral Deposit",
      level: 5,
      coordinates: "x, y"
    }
  ],
  vendors: [
    {
      npcName: "Merchant",
      location: "Limsa Lominsa",
      price: 5,
      currency: "Gil"
    }
  ]
}
```

**Example:**
```javascript
// Single item lookup
const itemInfo = FFXIVTools.lookupItemInfo('Iron Ore');
// Returns: Object with gathering locations and vendor info

// Batch process from spreadsheet
FFXIVTools.processItemList('Items', 'A', 2);
// Reads items from column A starting at row 2, processes each, writes results
```

**MVP Scope:**
- ✅ Item name lookup via XIVAPI
- ✅ Gathering location information
- ✅ Vendor/NPC purchase information
- ✅ Batch processing from spreadsheet
- ❌ Market board prices (future feature)

**Notes:**
- Requires internet connection to call XIVAPI
- API rate limits may apply - batch processing includes delays
- Item names must match exactly or use fuzzy matching
- Results are written to spreadsheet columns next to item names

---

## Planned Features

### ⬜ Item Information Lookup (Full)

**Function:** `lookupItemInfo(itemName, includeMarketBoard)` / `processItemList(sheetName, itemColumn, startRow, includeMarketBoard)`

Full version of item information lookup including market board prices from Universalis API.

**Additional Features (beyond MVP):**
- Market board average prices from Universalis API
- Historical price trends
- Price comparison (vendor vs market board)
- Best source recommendation (cheapest option)
- Cross-world price comparison

**Data Sources:**
- **XIVAPI** - Item data, gathering locations, vendor information
- **Universalis** (https://universalis.app/) - Market board prices and trends

**Output Structure (Extended):**
```javascript
{
  itemName: "Iron Ore",
  itemId: 4,
  gatheringLocations: [...],
  vendors: [...],
  marketBoard: {
    averagePrice: 150,
    currentPrice: 145,
    historicalAverage: 160,
    cheapestWorld: "Gilgamesh",
    priceTrend: "decreasing"
  },
  recommendations: {
    bestSource: "vendor", // or "gathering" or "marketboard"
    reason: "Vendor price (5 gil) is cheapest option"
  }
}
```

**Usage:**
```javascript
// With market board data
const itemInfo = FFXIVTools.lookupItemInfo('Iron Ore', true);
// Returns: Full object including market board prices

// Batch process with market board
FFXIVTools.processItemList('Items', 'A', 2, true);
```

**Future Enhancements:**
- Price alerts/notifications
- Crafting recipe integration
- Teamcraft export format support
- Multi-item comparison
- Gathering route optimization

---

## Feature Template

When adding a new feature, use this template:

```markdown
#### ✅ Feature Name
**Function:** `functionName(param1, param2)`

Brief description of what the feature does.

**Parameters:**
- `param1` (type, required/optional) - Description
- `param2` (type, optional) - Description

**Returns:** `type` - Description of return value

**Usage:**
- **As library:** `LibraryName.functionName(param1, param2)`
- **In bound spreadsheet:** Available via menu "FFXIV Tools" → "Menu Item Name"

**How it works:**
1. Step 1 description
2. Step 2 description
3. Step 3 description

**Example:**
```javascript
const result = FFXIVTools.functionName('value1', 'value2');
// Result: Description of result
```

**Notes:**
- Any additional notes or important information
- Edge cases or limitations
```

---

## Adding New Features

When implementing a new feature:

1. **Add the function** to `Code.gs` (public API)
2. **Use internal utilities** from `Utils.gs` if needed
3. **Use config** from `Config.gs` if needed
4. **Add menu item** in `onOpen()` if applicable
5. **Update this document** with feature documentation
6. **Update `API.md`** with function reference
7. **Update `TODO.md`** to mark feature as complete

---

## Feature Categories

Features are organized by category:

- **Basic Utilities** - Simple helper functions
- **Data Processing** - Functions that process/manipulate data
- **Data Retrieval** - Functions that fetch/read data
- **Data Writing** - Functions that write/update data
- **Advanced Features** - Complex functionality

---

## Notes

- All features use internal utilities and config automatically
- Features are designed to work both as a library and in bound spreadsheets
- Error handling is included in all public functions
- All functions include logging for debugging

