/**
 * Main entry point for the FFXIV Google Apps Script project
 * 
 * LIBRARY-FRIENDLY ARCHITECTURE (Option 4 - Hybrid Approach):
 * - Public functions (exposed to library users): All functions in this file
 * - Internal utilities: Utils.gs functions (used internally, not exposed)
 * - Internal config: Config.gs constants (used internally, not exposed)
 * 
 * When used as a library, users call: LibraryName.functionName()
 * All internal utilities and config are accessed automatically.
 * 
 * @author Your Name
 * @version 1.0.0
 */

/**
 * Runs automatically when the spreadsheet is opened.
 * Creates a custom menu in the Google Sheets menu bar.
 * 
 * Note: This only works in the bound spreadsheet, not when used as a library.
 * Library users should copy code from LIBRARY_TEMPLATE.gs (which is excluded
 * from clasp push via .claspignore to prevent conflicts).
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FFXIV Tools')
    .addItem('Lookup Item Info', 'menuLookupItemInfo')
    .addItem('Process Item List', 'menuProcessItemList')
    .addSeparator()
    .addSubMenu(ui.createMenu('Examples (May Remove)')
      .addItem('Add Timestamp', 'addTimestamp')
      .addItem('Hello World Example', 'helloWorld')
      .addItem('Read Active Cell', 'readActiveCell')
      .addSeparator()
      .addItem('Process Data', 'processData')
      .addItem('Process Data from Another Sheet', 'processDataFromSpreadsheet'))
    .addToUi();
}

/**
 * PUBLIC API: Adds a timestamp to cell A1 of the active sheet
 * 
 * Uses internal utilities and config automatically.
 * When used as library: LibraryName.addTimestamp()
 * 
 * @return {void}
 */
function addTimestamp() {
  try {
    // Uses internal utility function
    const sheet = SpreadsheetApp.getActiveSheet();
    const timestamp = new Date().toLocaleString();
    
    sheet.getRange('A1').setValue('Last updated: ' + timestamp);
    
    // Uses internal logging utility
    logWithTimestamp('Timestamp added to cell A1');
    
    SpreadsheetApp.getUi().alert('Timestamp added to cell A1!');
  } catch (error) {
    logWithTimestamp('Error in addTimestamp: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

/**
 * PUBLIC API: Writes "Hello World" to the active cell
 * 
 * When used as library: LibraryName.helloWorld()
 * 
 * @return {void}
 */
function helloWorld() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const activeCell = sheet.getActiveCell();
    
    activeCell.setValue('Hello World from Apps Script!');
    
    const message = 'Hello World written to ' + activeCell.getA1Notation();
    logWithTimestamp(message);
    SpreadsheetApp.getUi().alert(message);
  } catch (error) {
    logWithTimestamp('Error in helloWorld: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

/**
 * PUBLIC API: Reads the value from the currently selected cell
 * 
 * When used as library: LibraryName.readActiveCell()
 * 
 * @return {string} The value in the active cell
 */
function readActiveCell() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const activeCell = sheet.getActiveCell();
    const value = activeCell.getValue();
    const address = activeCell.getA1Notation();
    
    const message = 'Cell ' + address + ' contains: "' + value + '"';
    logWithTimestamp(message);
    SpreadsheetApp.getUi().alert(message);
    
    return value;
  } catch (error) {
    logWithTimestamp('Error in readActiveCell: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    throw error;
  }
}

/**
 * PUBLIC API: Processes data from the active sheet
 * 
 * High-level function that uses internal utilities and config.
 * Reads data from the active sheet, processes it, and writes results.
 * 
 * When used as library: LibraryName.processData()
 * 
 * @param {string} [sheetName] - Optional sheet name (uses CONFIG.SHEET_NAMES.MAIN if not provided)
 * @param {string} [range] - Optional range (defaults to 'A1:B10')
 * @return {Array<Array>} Processed data array
 */
function processData(sheetName, range) {
  try {
    // Uses internal config
    const targetSheetName = sheetName || CONFIG.SHEET_NAMES.MAIN;
    const targetRange = range || 'A1:B10';
    
    // Uses internal utility to get or create sheet
    const sheet = getOrCreateSheet(targetSheetName);
    
    // Get data using internal utility
    const dataRange = sheet.getRange(targetRange);
    const values = dataRange.getValues();
    
    logWithTimestamp('Read ' + values.length + ' rows of data from ' + targetSheetName);
    
    // Process the data (example: add processing logic here)
    const processedData = values.map((row, index) => {
      // Example processing: add a processed column
      return [...row, 'Processed row ' + (index + 1)];
    });
    
    // Write processed data back using internal utility
    if (processedData.length > 0 && processedData[0].length > 0) {
      const outputCol = dataRange.getNumColumns() + 1;
      setSheetValues(sheet, 1, outputCol, processedData.map(row => [row[row.length - 1]]));
    }
    
    logWithTimestamp('Processed ' + values.length + ' rows successfully');
    SpreadsheetApp.getUi().alert('Processed ' + values.length + ' rows!');
    
    return processedData;
  } catch (error) {
    logWithTimestamp('Error in processData: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    throw error;
  }
}

/**
 * PUBLIC API: Processes data from another spreadsheet
 * 
 * High-level function that works with any spreadsheet by ID.
 * Uses internal utilities and config automatically.
 * 
 * When used as library: LibraryName.processDataFromSpreadsheet(spreadsheetId, sheetName)
 * 
 * @param {string} spreadsheetId - The ID of the spreadsheet to process
 * @param {string} [sheetName] - Optional sheet name (uses CONFIG.SHEET_NAMES.MAIN if not provided)
 * @param {string} [range] - Optional range (defaults to 'A1:B10')
 * @return {Array<Array>} Processed data array
 */
function processDataFromSpreadsheet(spreadsheetId, sheetName, range) {
  try {
    if (!spreadsheetId) {
      throw new Error('spreadsheetId is required');
    }
    
    // Uses internal config
    const targetSheetName = sheetName || CONFIG.SHEET_NAMES.MAIN;
    const targetRange = range || 'A1:B10';
    
    // Uses internal utility to open spreadsheet
    const spreadsheet = openSpreadsheetById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(targetSheetName);
    
    if (!sheet) {
      throw new Error('Sheet "' + targetSheetName + '" not found in spreadsheet');
    }
    
    // Get data using internal utility
    const dataRange = sheet.getRange(targetRange);
    const values = dataRange.getValues();
    
    logWithTimestamp('Read ' + values.length + ' rows from spreadsheet ' + spreadsheetId);
    
    // Process the data
    const processedData = values.map((row, index) => {
      return [...row, 'Processed row ' + (index + 1)];
    });
    
    // Write processed data back
    if (processedData.length > 0 && processedData[0].length > 0) {
      const outputCol = dataRange.getNumColumns() + 1;
      setSheetValues(sheet, 1, outputCol, processedData.map(row => [row[row.length - 1]]));
    }
    
    logWithTimestamp('Processed ' + values.length + ' rows from external spreadsheet');
    SpreadsheetApp.getUi().alert('Processed ' + values.length + ' rows from spreadsheet!');
    
    return processedData;
  } catch (error) {
    logWithTimestamp('Error in processDataFromSpreadsheet: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    throw error;
  }
}

/**
 * PUBLIC API: Gets data from a spreadsheet and returns it
 * 
 * Simple high-level function for reading data from any spreadsheet.
 * 
 * When used as library: LibraryName.getDataFromSpreadsheet(spreadsheetId, sheetName)
 * 
 * @param {string} spreadsheetId - The ID of the spreadsheet
 * @param {string} [sheetName] - Optional sheet name (uses CONFIG.SHEET_NAMES.MAIN if not provided)
 * @return {Array<Array>} 2D array of values from the sheet
 */
function getDataFromSpreadsheet(spreadsheetId, sheetName) {
  try {
    if (!spreadsheetId) {
      throw new Error('spreadsheetId is required');
    }
    
    const targetSheetName = sheetName || CONFIG.SHEET_NAMES.MAIN;
    
    // Uses internal utilities
    const spreadsheet = openSpreadsheetById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(targetSheetName);
    
    if (!sheet) {
      throw new Error('Sheet "' + targetSheetName + '" not found');
    }
    
    // Uses internal utility to get values
    const values = getSheetValues(sheet);
    
    logWithTimestamp('Retrieved ' + values.length + ' rows from spreadsheet ' + spreadsheetId);
    
    return values;
  } catch (error) {
    logWithTimestamp('Error in getDataFromSpreadsheet: ' + error.toString());
    throw error;
  }
}

// ============================================================================
// FFXIV Item Information Features
// ============================================================================

/**
 * PUBLIC API: Looks up FFXIV item information (gathering locations and vendor prices)
 * 
 * MVP version that retrieves gathering locations and vendor/NPC purchase information
 * for a given item name using XIVAPI.
 * 
 * When used as library: LibraryName.lookupItemInfo(itemName)
 * 
 * @param {string} itemName - Name of the item to look up (e.g., "Iron Ore")
 * @return {Object} Item information object with gathering locations and vendor info
 */
function lookupItemInfo(itemName) {
  try {
    if (!itemName || itemName.trim() === '') {
      throw new Error('Item name is required');
    }
    
    logWithTimestamp('Looking up item: ' + itemName);
    
    // Search for item by name
    let searchResult;
    try {
      searchResult = searchItemByName(itemName);
    } catch (error) {
      // If search fails (XIVAPI search endpoint issues), provide helpful error
      if (error.toString().includes('alive nodes') || error.toString().includes('Search Error')) {
        throw new Error('XIVAPI search is currently unavailable. The search service appears to be down. Please try again later, or use item IDs directly if available.');
      }
      throw error;
    }
    
    if (!searchResult) {
      throw new Error('Item "' + itemName + '" not found. Please check the spelling or try a different item name.');
    }
    
    const itemId = searchResult.ID;
    logWithTimestamp('Found item ID: ' + itemId);
    
    // Get detailed item information from Garland Tools
    const garlandData = getItemDetails(itemId);
    
    // Extract item name from Garland Tools data
    const itemNameFromData = garlandData.item ? garlandData.item.name : itemName;
    
    // Get gathering locations
    const gatheringLocations = getGatheringLocations(garlandData);
    
    // Get vendor information (pass garlandData to avoid duplicate API call)
    const vendors = getVendorInfo(itemId, garlandData);
    
    // Get reduction sources (items this can be reduced from)
    const reductionSources = getReductionSources(garlandData);
    
    // Determine if item can be bought and get best price
    const canBeBought = vendors && vendors.length > 0;
    let bestPrice = null;
    let bestPriceVendor = null;
    
    if (canBeBought) {
      // Prioritize Gil vendors, but also consider special currency vendors
      const gilVendors = vendors.filter(function(v) {
        return v.currency === 'Gil' && v.price > 0;
      });
      
      if (gilVendors.length > 0) {
        // Find best Gil price
        gilVendors.sort(function(a, b) {
          return a.price - b.price;
        });
        bestPrice = gilVendors[0].price;
        bestPriceVendor = gilVendors[0];
      } else {
        // If no Gil vendors, use first available vendor (special currency)
        // Sort by price to get the cheapest option
        const sortedVendors = vendors.filter(function(v) {
          return v.price > 0;
        }).sort(function(a, b) {
          return a.price - b.price;
        });
        
        if (sortedVendors.length > 0) {
          bestPrice = sortedVendors[0].price;
          bestPriceVendor = sortedVendors[0];
        }
      }
    }
    
    // Build result object
    const result = {
      itemName: itemNameFromData,
      itemId: itemId,
      gatheringLocations: gatheringLocations,
      vendors: vendors,
      reductionSources: reductionSources,
      canBeBought: canBeBought,
      bestPrice: bestPrice,
      bestPriceVendor: bestPriceVendor,
      formattedGathering: formatGatheringLocations(gatheringLocations),
      formattedVendors: formatVendorInfo(vendors),
      formattedReductionSources: formatReductionSources(reductionSources),
      priceSummary: canBeBought && bestPrice ? 
        'Can be bought for ' + bestPrice + ' ' + (bestPriceVendor.currency || 'Gil') + 
        (bestPriceVendor.npcName ? ' from ' + bestPriceVendor.npcName : '') : 
        'Cannot be bought from vendors'
    };
    
    logWithTimestamp('Item lookup completed for: ' + itemName);
    
    return result;
  } catch (error) {
    logWithTimestamp('Error in lookupItemInfo: ' + error.toString());
    throw error;
  }
}

/**
 * PUBLIC API: Processes a list of items from a spreadsheet column
 * 
 * Reads item names from a spreadsheet column and looks up information for each item.
 * Writes results to adjacent columns:
 * - Column B: Gathering locations
 * - Column C: Price (best price if buyable, or "Cannot be bought")
 * - Column D: Vendor information (vendor names and locations)
 * - Column E: Aetherial Reduction (items this can be obtained by reducing)
 * 
 * When used as library: LibraryName.processItemList(sheetName, itemColumn, startRow)
 * 
 * @param {string} [sheetName] - Sheet name (uses CONFIG.SHEET_NAMES.MAIN if not provided)
 * @param {string} [itemColumn] - Column letter containing item names (defaults to 'A')
 * @param {number} [startRow] - Starting row number (defaults to 2, assuming row 1 is header)
 * @return {Array<Object>} Array of item information objects
 */
function processItemList(sheetName, itemColumn, startRow) {
  try {
    const targetSheetName = sheetName || CONFIG.SHEET_NAMES.MAIN;
    const column = itemColumn || 'A';
    const start = startRow || 2;
    
    // Get or create sheet
    const sheet = getOrCreateSheet(targetSheetName);
    
    // Read item names from column
    const lastRow = sheet.getLastRow();
    if (lastRow < start) {
      SpreadsheetApp.getUi().alert('No items found in column ' + column + ' starting at row ' + start);
      return [];
    }
    
    const itemNames = [];
    for (let row = start; row <= lastRow; row++) {
      const cellValue = sheet.getRange(column + row).getValue();
      if (cellValue && cellValue.toString().trim() !== '') {
        itemNames.push({
          row: row,
          name: cellValue.toString().trim()
        });
      }
    }
    
    if (itemNames.length === 0) {
      SpreadsheetApp.getUi().alert('No item names found in column ' + column);
      return [];
    }
    
    logWithTimestamp('Processing ' + itemNames.length + ' items');
    
    // Setup output columns (B = Gathering, C = Price, D = Vendors, E = Reduced From)
    const gatheringCol = String.fromCharCode(column.charCodeAt(0) + 1);
    const priceCol = String.fromCharCode(column.charCodeAt(0) + 2);
    const vendorCol = String.fromCharCode(column.charCodeAt(0) + 3);
    const reductionCol = String.fromCharCode(column.charCodeAt(0) + 4);
    
    // Write headers if not present
    if (start === 2) {
      sheet.getRange(gatheringCol + '1').setValue('Gathering Location');
      sheet.getRange(priceCol + '1').setValue('Price');
      sheet.getRange(vendorCol + '1').setValue('Vendor Info');
      sheet.getRange(reductionCol + '1').setValue('Aetherial Reduction');
    }
    
    const results = [];
    
    // Process each item
    for (let i = 0; i < itemNames.length; i++) {
      const item = itemNames[i];
      
      try {
        logWithTimestamp('Processing item ' + (i + 1) + '/' + itemNames.length + ': ' + item.name);
        
        const itemInfo = lookupItemInfo(item.name);
        
        // Write results to spreadsheet - separate price and vendor info
        sheet.getRange(gatheringCol + item.row).setValue(itemInfo.formattedGathering);
        
        // Price column - show price with currency
        let priceDisplay = 'Cannot be bought';
        if (itemInfo.canBeBought && itemInfo.bestPrice) {
          const currency = itemInfo.bestPriceVendor ? itemInfo.bestPriceVendor.currency || 'Gil' : 'Gil';
          priceDisplay = itemInfo.bestPrice + ' ' + currency;
        }
        sheet.getRange(priceCol + item.row).setValue(priceDisplay);
        
        // Vendor column - show vendor details
        sheet.getRange(vendorCol + item.row).setValue(itemInfo.formattedVendors);
        
        // Reduction column - show items this can be reduced from
        sheet.getRange(reductionCol + item.row).setValue(itemInfo.formattedReductionSources);
        
        results.push(itemInfo);
        
        // Add delay to respect API rate limits (1 second between requests)
        if (i < itemNames.length - 1) {
          Utilities.sleep(1000);
        }
      } catch (error) {
        logWithTimestamp('Error processing item "' + item.name + '": ' + error.toString());
        // Write error to cells
        sheet.getRange(gatheringCol + item.row).setValue('Error: ' + error.toString());
        sheet.getRange(priceCol + item.row).setValue('Error');
        sheet.getRange(vendorCol + item.row).setValue('Error');
        sheet.getRange(reductionCol + item.row).setValue('Error');
      }
    }
    
    logWithTimestamp('Processed ' + results.length + ' items successfully');
    SpreadsheetApp.getUi().alert('Processed ' + results.length + ' items successfully!');
    
    return results;
  } catch (error) {
    logWithTimestamp('Error in processItemList: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    throw error;
  }
}

/**
 * Menu handler: Lookup single item information
 */
function menuLookupItemInfo() {
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt('Lookup Item Info', 'Enter item name:', ui.ButtonSet.OK_CANCEL);
    
    if (response.getSelectedButton() === ui.Button.OK) {
      const itemName = response.getResponseText().trim();
      
      if (itemName === '') {
        ui.alert('Item name cannot be empty');
        return;
      }
      
      const itemInfo = lookupItemInfo(itemName);
      
      // Display results - prioritize price information
      let message = 'Item: ' + itemInfo.itemName + '\n\n';
      
      // Show price first if item can be bought
      if (itemInfo.canBeBought) {
        message += '💰 PRICE: ' + itemInfo.priceSummary + '\n\n';
        if (itemInfo.vendors && itemInfo.vendors.length > 1) {
          message += 'All Vendors:\n' + itemInfo.formattedVendors + '\n\n';
        }
      } else {
        message += '💰 PRICE: ' + itemInfo.priceSummary + '\n\n';
      }
      
      message += 'Gathering Locations:\n' + itemInfo.formattedGathering;
      
      ui.alert('Item Information', message, ui.ButtonSet.OK);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuLookupItemInfo: ' + error.toString());
  }
}

/**
 * Menu handler: Process item list from spreadsheet
 */
function menuProcessItemList() {
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt('Process Item List', 
      'Enter column letter (e.g., A) and starting row (e.g., 2)\nFormat: Column,Row (default: A,2)', 
      ui.ButtonSet.OK_CANCEL);
    
    if (response.getSelectedButton() === ui.Button.OK) {
      const input = response.getResponseText().trim();
      let column = 'A';
      let startRow = 2;
      
      if (input !== '') {
        const parts = input.split(',');
        if (parts.length >= 1) column = parts[0].trim().toUpperCase();
        if (parts.length >= 2) startRow = parseInt(parts[1].trim()) || 2;
      }
      
      processItemList(null, column, startRow);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuProcessItemList: ' + error.toString());
  }
}

