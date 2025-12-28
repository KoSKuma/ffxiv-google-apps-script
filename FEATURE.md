# Feature Documentation

This document tracks all features available in the FFXIV Google Apps Script project, including how they work and how to use them.

## Table of Contents

### ✅ Implemented Features
- [Item Information Lookup](#-item-information-lookup) - v1.0 (2025-12-28) - `lookupItemInfo(itemName)` / `processItemList(sheetName, itemColumn, startRow)`
- [Crafting Request Processing](#-crafting-request-processing) - v1.0 (2025-12-28) - `processCraftingRequest(sheetName, itemColumn, quantityColumn, startRow)`

### 🟡 In Progress Features
- None currently

### ⬜ Planned Features
- [Item Information Lookup (Full)](#-item-information-lookup-full) - Full version with market board prices

---

## Feature Status

- ✅ **Implemented** - Feature is complete and working
- 🟡 **In Progress** - Feature is being developed
- ⬜ **Planned** - Feature is planned but not yet started
- ❌ **Deprecated** - Feature is no longer recommended/used

---

## Implemented Features

### ✅ Item Information Lookup

**Version:** 1.0  
**Last Updated:** 2025-12-28  
**Function:** `lookupItemInfo(itemName)` / `processItemList(sheetName, itemColumn, startRow)`

Looks up FFXIV item information including gathering locations, vendor prices, and aetherial reduction sources. Version 1.0 implementation.

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
- **XIVAPI v2** (https://v2.xivapi.com/api) - Item name to ID conversion
- **Garland Tools** (https://www.garlandtools.org/) - Detailed item information, gathering nodes, vendors, and reduction sources

**Output Structure:**
```javascript
{
  itemName: "Iron Ore",
  itemId: 5111,
  gatheringLocations: [
    {
      type: "Mining",
      name: "Horizon's Edge",
      level: 15,
      zone: 42
    }
  ],
  vendors: [
    {
      npcName: "Material Supplier",
      location: "Various",
      price: 18,
      currency: "Gil"
    }
  ],
  reductionSources: [
    {
      itemId: 46249,
      itemName: "Purple Palate"
    }
  ],
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
// Single item lookup
const itemInfo = FFXIVTools.lookupItemInfo('Iron Ore');
// Returns: Object with gathering locations and vendor info

// Batch process from spreadsheet
FFXIVTools.processItemList('Items', 'A', 2);
// Reads items from column A starting at row 2, processes each, writes results
```

**Features:**
- ✅ Item name lookup via XIVAPI v2 search
- ✅ Gathering location information (node names, levels, types)
- ✅ Vendor/NPC purchase information (Gil and special currencies)
- ✅ Aetherial reduction sources (items that can be reduced to obtain this item)
- ✅ Price prioritization (shows best price first)
- ✅ Vendor deduplication (removes duplicate vendor entries)
- ✅ Batch processing from spreadsheet (writes to multiple columns)
- ❌ Market board prices (planned for future version)

**Spreadsheet Output Columns:**
- Column B: Gathering Locations
- Column C: Price (with currency)
- Column D: Vendor Info
- Column E: Aetherial Reduction

**Notes:**
- Requires internet connection to call XIVAPI and Garland Tools APIs

---

### ✅ Crafting Request Processing

**Version:** 1.0  
**Last Updated:** 2025-12-28  
**Function:** `processCraftingRequest(sheetName, itemColumn, quantityColumn, startRow)`

Batch processes crafting requests from a spreadsheet. Reads item names and quantities, calculates all materials needed (including recursive sub-ingredients), and writes results to the spreadsheet with proper formatting and padding.

**Parameters:**
- `sheetName` (string, optional) - Sheet name (defaults to "Requested for Crafting")
- `itemColumn` (string, optional) - Column letter for item names (defaults to 'A')
- `quantityColumn` (string, optional) - Column letter for quantities (defaults to 'B')
- `startRow` (number, optional) - Starting row number (defaults to 2, assuming row 1 is header)

**Returns:** 
- `Array<Object>` - Array of processing results with success status and material counts

**Usage:**
- **As library:** `LibraryName.processCraftingRequest()` or `LibraryName.processCraftingRequest('Requested for Crafting', 'A', 'B', 2)`
- **In bound spreadsheet:** Available via menu "FFXIV Tools" → "Process Crafting Request"

**How it works:**
1. Reads item names from column A and quantities from column B
2. For each item, gets crafting materials (including recursive sub-ingredients)
3. Calculates total material quantities (material amount × item quantity)
4. Inserts rows for materials below each item
5. Writes material names to column C and quantities to column D
6. Adds padding blank line between items for readability

**Data Sources:**
- **XIVAPI v2** (https://v2.xivapi.com/api) - Item name to ID conversion
- **Garland Tools** (https://www.garlandtools.org/) - Crafting recipes and ingredient information

**Spreadsheet Structure:**
- **Column A:** Item names (input)
- **Column B:** Quantity to craft (input)
- **Column C:** Material names (output, one per line)
- **Column D:** Total material quantity needed (output, material amount × column B)

**Example:**
```
Input:
Row 1: Item Name | Quantity | Material Name | Material Quantity
Row 2: Ceviche   | 3        |               |
Row 3: Iron Ore   | 5        |               |

Output after processing:
Row 1: Item Name | Quantity | Material Name | Material Quantity
Row 2: Ceviche   | 3        |               |
Row 3:           |          | Cloudsail     | 3
Row 4:           |          | Turali Corn   | 36
Row 5:           |          | ...           | ...
Row 6:           |          |               | (blank padding line)
Row 7: Iron Ore  | 5        |               |
Row 8:           |          | (materials)   | (quantities)
```

**Features:**
- ✅ Batch processing of multiple items
- ✅ Automatic quantity calculation (multiplies by item quantity)
- ✅ Recursive crafting support (includes sub-ingredients)
- ✅ Dynamic row insertion for materials
- ✅ Padding blank lines between items
- ✅ Error handling for non-craftable items
- ✅ Processes items in reverse order to avoid row shifting issues

**Notes:**
- Requires internet connection to call XIVAPI and Garland Tools APIs
- Processes items in reverse order to handle row insertion correctly
- Adds 1 second delay between items to respect API rate limits
- Items that cannot be crafted will show "Cannot be crafted" in column C
- Material quantities are automatically multiplied by the quantity in column B

---

## In Progress Features

### 🟡 Crafting Materials

**Version:** 1.0  
**Last Updated:** 2025-12-28  
**Function:** `getCraftingMaterials(itemName, includeSubIngredients)`

Gets all materials needed to craft an item, including recursive sub-ingredients (ingredients that need to be crafted themselves). Handles nested crafting recipes automatically.

**Parameters:**
- `itemName` (string, required) - Name of the item to get crafting materials for (e.g., "Ceviche")
- `includeSubIngredients` (boolean, optional) - Whether to include sub-ingredients recursively (default: true). If false, only returns direct ingredients.

**Returns:** 
- `Object` - Crafting materials object with tree structure and flattened materials list

**Usage:**
- **As library:** `LibraryName.getCraftingMaterials('Ceviche')` or `LibraryName.getCraftingMaterials('Ceviche', true)`
- **In bound spreadsheet:** Available via menu "FFXIV Tools" → "In Development" → "Get Crafting Materials"

**How it works:**
1. Takes item name as input (e.g., "Ceviche")
2. Searches for the item using XIVAPI to get item ID
3. Retrieves crafting recipe from Garland Tools API
4. Recursively processes ingredients that can be crafted (up to 5 levels deep)
5. Flattens the crafting tree to get all base materials needed
6. Returns structured data with both tree view and flattened materials list

**Data Sources:**
- **XIVAPI v2** (https://v2.xivapi.com/api) - Item name to ID conversion
- **Garland Tools** (https://www.garlandtools.org/) - Crafting recipes and ingredient information

**Output Structure:**
```javascript
{
  itemName: "Ceviche",
  itemId: 44842,
  canBeCrafted: true,
  tree: {
    itemId: 44842,
    itemName: "Ceviche",
    canBeCrafted: true,
    ingredients: [
      {
        itemId: 44347,
        itemName: "Cloudsail",
        amount: 1,
        canBeCrafted: false,
        subTree: null,
        subIngredients: []
      },
      {
        itemId: 43976,
        itemName: "Turali Corn Oil",
        amount: 2,
        canBeCrafted: true,
        subTree: {...},
        subIngredients: [...]
      }
    ]
  },
  materials: [
    {
      itemId: 44347,
      itemName: "Cloudsail",
      amount: 1
    },
    {
      itemId: 43981,
      itemName: "Turali Corn",
      amount: 12  // 2x Turali Corn Oil requires 6x Turali Corn each
    }
  ],
  formattedTree: "Ceviche:\n  - 1x Cloudsail\n  - 2x Turali Corn Oil (crafted)\n    - 6x Turali Corn\n    ...",
  formattedMaterials: "1x Cloudsail, 12x Turali Corn, ..."
}
```

**Example:**
```javascript
// Get all materials needed (including sub-ingredients)
const materials = FFXIVTools.getCraftingMaterials('Ceviche');
// Returns: Object with tree, materials array, and formatted strings

// Get only direct ingredients (no recursion)
const directOnly = FFXIVTools.getCraftingMaterials('Ceviche', false);
// Returns: Only direct ingredients, no sub-ingredients
```

**Features:**
- ✅ Recursive crafting tree (handles ingredients that need to be crafted)
- ✅ Automatic quantity calculation (multiplies amounts through recipe chain)
- ✅ Cycle detection (prevents infinite loops)
- ✅ Depth limiting (max 5 levels to prevent excessive API calls)
- ✅ Tree view and flattened materials list
- ✅ Formatted output for easy reading

**Notes:**
- This is a debug/utility function for testing individual items
- Requires internet connection to call XIVAPI and Garland Tools APIs
- Recursive crafting can result in many API calls - be patient for complex recipes
- Maximum recursion depth is 5 levels to prevent excessive API usage
- Items that cannot be crafted will return `canBeCrafted: false`
- Item names must match exactly (case-sensitive)

---

### ✅ Crafting Request Processing

**Version:** 1.0  
**Last Updated:** 2025-12-28  
**Function:** `processCraftingRequest(sheetName, itemColumn, quantityColumn, startRow)`

Batch processes crafting requests from a spreadsheet. Reads item names and quantities, calculates all materials needed (including recursive sub-ingredients), and writes results to the spreadsheet with proper formatting and padding.

**Parameters:**
- `sheetName` (string, optional) - Sheet name (defaults to "Requested for Crafting")
- `itemColumn` (string, optional) - Column letter for item names (defaults to 'A')
- `quantityColumn` (string, optional) - Column letter for quantities (defaults to 'B')
- `startRow` (number, optional) - Starting row number (defaults to 2, assuming row 1 is header)

**Returns:** 
- `Array<Object>` - Array of processing results with success status and material counts

**Usage:**
- **As library:** `LibraryName.processCraftingRequest()` or `LibraryName.processCraftingRequest('Requested for Crafting', 'A', 'B', 2)`
- **In bound spreadsheet:** Available via menu "FFXIV Tools" → "Process Crafting Request"

**How it works:**
1. Reads item names from column A and quantities from column B
2. For each item, gets crafting materials (including recursive sub-ingredients)
3. Calculates total material quantities (material amount × item quantity)
4. Inserts rows for materials below each item
5. Writes material names to column C and quantities to column D
6. Adds padding blank line between items for readability

**Data Sources:**
- **XIVAPI v2** (https://v2.xivapi.com/api) - Item name to ID conversion
- **Garland Tools** (https://www.garlandtools.org/) - Crafting recipes and ingredient information

**Spreadsheet Structure:**
- **Column A:** Item names (input)
- **Column B:** Quantity to craft (input)
- **Column C:** Material names (output, one per line)
- **Column D:** Total material quantity needed (output, material amount × column B)

**Example:**
```
Input:
Row 1: Item Name | Quantity | Material Name | Material Quantity
Row 2: Ceviche   | 3        |               |
Row 3: Iron Ore   | 5        |               |

Output after processing:
Row 1: Item Name | Quantity | Material Name | Material Quantity
Row 2: Ceviche   | 3        |               |
Row 3:           |          | Cloudsail     | 3
Row 4:           |          | Turali Corn   | 36
Row 5:           |          | ...           | ...
Row 6:           |          |               | (blank padding line)
Row 7: Iron Ore  | 5        |               |
Row 8:           |          | (materials)   | (quantities)
```

**Features:**
- ✅ Batch processing of multiple items
- ✅ Automatic quantity calculation (multiplies by item quantity)
- ✅ Recursive crafting support (includes sub-ingredients)
- ✅ Dynamic row insertion for materials
- ✅ Padding blank lines between items
- ✅ Error handling for non-craftable items
- ✅ Processes items in reverse order to avoid row shifting issues

**Notes:**
- Requires internet connection to call XIVAPI and Garland Tools APIs
- Processes items in reverse order to handle row insertion correctly
- Adds 1 second delay between items to respect API rate limits
- Items that cannot be crafted will show "Cannot be crafted" in column C
- Material quantities are automatically multiplied by the quantity in column B

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

**Version:** X.Y  
**Last Updated:** YYYY-MM-DD  
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

