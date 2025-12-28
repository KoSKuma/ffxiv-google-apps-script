# API Documentation

This document provides reference documentation for the public API functions available when using this project as a library in Google Apps Script.

## Public API Functions

All functions in this section can be called when the project is used as a library:
```javascript
LibraryName.functionName(parameters);
```

---

### `lookupItemInfo(itemName)`

Looks up FFXIV item information including gathering locations, vendor prices, and aetherial reduction sources.

**Parameters:**
- `itemName` (string, required) - Name of the item to look up (e.g., "Iron Ore")

**Returns:** `Object` - Item information object with the following structure:
```javascript
{
  itemName: "Iron Ore",
  itemId: 5111,
  gatheringLocations: [...],
  vendors: [...],
  reductionSources: [...],
  canBeBought: true,
  bestPrice: 18,
  bestPriceVendor: {...},
  formattedGathering: "Mining - Horizon's Edge - Level 15",
  formattedVendors: "Material Supplier - 18 Gil (Various)",
  formattedReductionSources: "Purple Palate, Calamus Root, Levin Quartz",
  priceSummary: "Can be bought for 18 Gil from Material Supplier"
}
```

**Example:**
```javascript
const itemInfo = FFXIVTools.lookupItemInfo('Iron Ore');
Logger.log(itemInfo.formattedGathering);
Logger.log(itemInfo.priceSummary);
```

**Throws:** `Error` if item name is empty or item is not found

---

### `processItemList(sheetName, itemColumn, startRow)`

Batch processes a list of items from a spreadsheet column. Reads item names and writes gathering locations, prices, vendor info, and reduction sources to adjacent columns.

**Parameters:**
- `sheetName` (string, optional) - Sheet name (defaults to `CONFIG.SHEET_NAMES.MAIN`)
- `itemColumn` (string, optional) - Column letter containing item names (defaults to 'A')
- `startRow` (number, optional) - Starting row number (defaults to 2, assuming row 1 is header)

**Returns:** `Array<Object>` - Array of item information objects (same structure as `lookupItemInfo`)

**Output Columns:**
- Column B (or next after item column): Gathering Locations
- Column C: Price (with currency)
- Column D: Vendor Info
- Column E: Aetherial Reduction

**Example:**
```javascript
// Process items from column A starting at row 2
const results = FFXIVTools.processItemList('Items', 'A', 2);
Logger.log('Processed ' + results.length + ' items');
```

**Throws:** `Error` if sheet is not found or processing fails

---

### `getCraftingMaterials(itemName, includeSubIngredients)`

Gets all materials needed to craft an item, including recursive sub-ingredients (ingredients that need to be crafted themselves).

**Parameters:**
- `itemName` (string, required) - Name of the item to get crafting materials for (e.g., "Ceviche")
- `includeSubIngredients` (boolean, optional) - Whether to include sub-ingredients recursively (default: `true`). If `false`, only returns direct ingredients.

**Returns:** `Object` - Crafting materials object:
```javascript
{
  itemName: "Ceviche",
  itemId: 44842,
  canBeCrafted: true,
  tree: {...},  // Full crafting tree structure
  materials: [
    {
      itemId: 44347,
      itemName: "Cloudsail",
      amount: 1
    },
    // ... more materials
  ],
  formattedTree: "Ceviche:\n  - 1x Cloudsail\n  - 2x Turali Corn Oil (crafted)\n    ...",
  formattedMaterials: "1x Cloudsail, 12x Turali Corn, ..."
}
```

**Example:**
```javascript
// Get all materials including sub-ingredients
const materials = FFXIVTools.getCraftingMaterials('Ceviche');
Logger.log(materials.formattedMaterials);

// Get only direct ingredients
const directOnly = FFXIVTools.getCraftingMaterials('Ceviche', false);
Logger.log(directOnly.materials.length + ' direct ingredients');
```

**Throws:** `Error` if item name is empty, item is not found, or item cannot be crafted

---

### `processCraftingRequest(sheetName, itemColumn, quantityColumn, startRow)`

Batch processes crafting requests from a spreadsheet. Reads item names and quantities, calculates all materials needed (including recursive sub-ingredients), and writes results to the spreadsheet with proper formatting.

**Parameters:**
- `sheetName` (string, optional) - Sheet name (defaults to "Requested for Crafting")
- `itemColumn` (string, optional) - Column letter for item names (defaults to 'A')
- `quantityColumn` (string, optional) - Column letter for quantities (defaults to 'B')
- `startRow` (number, optional) - Starting row number (defaults to 2, assuming row 1 is header)

**Returns:** `Array<Object>` - Array of processing results:
```javascript
[
  {
    itemName: "Ceviche",
    quantity: 3,
    success: true,
    materialCount: 8
  },
  // ... more results
]
```

**Output Structure:**
- Column A: Item names (input)
- Column B: Quantity to craft (input)
- Column C: Material names (output, one per line)
- Column D: Total material quantity needed (output, material amount × column B)

**Example:**
```javascript
// Process crafting requests from default sheet
const results = FFXIVTools.processCraftingRequest();
Logger.log('Processed ' + results.length + ' items');

// Process from custom sheet
const results = FFXIVTools.processCraftingRequest('Crafting List', 'A', 'B', 2);
```

**Features:**
- Automatically inserts rows for materials
- Calculates total quantities (multiplies by item quantity)
- Adds padding blank lines between items
- Processes items in reverse order to avoid row shifting issues

**Throws:** `Error` if sheet is not found or processing fails

---

## Internal Functions

The following functions are internal and not part of the public API. They are used internally by the public functions above.

### Utils.gs

Internal utility functions for spreadsheet operations:
- `getActiveSpreadsheet()` - Gets the currently active spreadsheet
- `getOrCreateSheet(sheetName)` - Gets a sheet by name, creating it if it doesn't exist
- `getDataRange(sheet)` - Gets the data range of a sheet
- `getSheetValues(sheet)` - Gets all values from a sheet as a 2D array
- `setSheetValues(sheet, row, col, values)` - Sets values to a sheet starting at the specified position
- `clearSheet(sheet)` - Clears all data from a sheet
- `logWithTimestamp(message)` - Logs a message with ISO timestamp
- `openSpreadsheetById(spreadsheetId)` - Opens a spreadsheet by ID
- `openSpreadsheetByUrl(url)` - Opens a spreadsheet by URL

### Config.gs

Internal configuration object (`CONFIG`) containing:
- `SHEET_NAMES` - Default sheet names
- `COLUMNS` - Column mappings
- `SPREADSHEET_IDS` - Spreadsheet IDs (if needed)

**Note:** These are internal and not directly accessible when used as a library. Public functions use these values automatically.

---

## Bound Spreadsheet Functions

The following functions only work in the bound spreadsheet (not when used as a library):

### `onOpen()`

Runs automatically when the spreadsheet is opened. Creates custom menu items in the Google Sheets menu bar.

**Note:** When using as a library, copy the menu code from `LIBRARY_TEMPLATE.gs` (in the root directory) to your spreadsheet's script editor.

---

## Error Handling

All public API functions include error handling:

```javascript
try {
  const itemInfo = FFXIVTools.lookupItemInfo('Iron Ore');
  // Process result
} catch (error) {
  Logger.log('Error: ' + error.toString());
  // Handle error appropriately
}
```

Common errors:
- `Error: Item name is required` - Item name parameter is empty
- `Error: Item "X" not found` - Item could not be found in XIVAPI
- `Error: XIVAPI search is currently unavailable` - XIVAPI service is down
- `Error: This item cannot be crafted` - Item has no crafting recipe

---

## Data Sources

The API uses the following external services:
- **XIVAPI v2** (https://v2.xivapi.com/api) - Item name to ID conversion
- **Garland Tools** (https://www.garlandtools.org/) - Detailed item information, gathering nodes, vendors, crafting recipes, and reduction sources

See `API_DOCUMENTATION.md` for detailed API endpoint documentation.

---

## Adding New Functions

When adding new public API functions:

1. Add JSDoc comments with:
   - Function description
   - `@param` for each parameter (type and description)
   - `@return` for return value (type and description)
   - `@throws` if function can throw errors

2. Update this file (`API.md`) with the new function documentation

3. Update `FEATURE.md` if the function is a new feature

4. Follow existing naming and structure conventions

---

## Related Documentation

- `FEATURE.md` - Feature documentation with detailed usage examples
- `API_DOCUMENTATION.md` - External API endpoints reference
- `GETTING_STARTED.md` - Setup and usage guide
- `../LIBRARY_TEMPLATE.gs` - Template code for library integration (in root directory)
