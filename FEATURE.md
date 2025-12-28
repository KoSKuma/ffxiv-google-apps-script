# Feature Documentation

This document tracks all features available in the FFXIV Google Apps Script project, including how they work and how to use them.

## Table of Contents

### ✅ Implemented Features
- [Item Information Lookup](#-item-information-lookup) - v1.0 (2025-12-28) - `lookupItemInfo(itemName)` / `processItemList(sheetName, itemColumn, startRow)`

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
- API rate limits apply - batch processing includes 1 second delays between items
- Item names must match exactly (case-sensitive)
- Results are written to spreadsheet columns next to item names
- Supports both Gil purchases and special currency purchases (scrips, credits, etc.)

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

