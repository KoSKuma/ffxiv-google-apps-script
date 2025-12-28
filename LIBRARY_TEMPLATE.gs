/**
 * FFXIV Tools Library Integration - Copy-Paste Template
 * 
 * ⚠️ NOTE: This file is EXCLUDED from clasp push (see .claspignore).
 * It is a REFERENCE TEMPLATE for library users only.
 * 
 * When using this project as a STANDALONE script (bound to spreadsheet),
 * use Code.gs instead. This template is only for users who want to use
 * the project as a LIBRARY in their own spreadsheets.
 * 
 * SETUP INSTRUCTIONS (For Library Users):
 * 1. Add the library using the Script ID (see GETTING_STARTED.md)
 * 2. Copy the code below into your spreadsheet's Apps Script editor
 * 3. Replace 'FFXIVTools' below with your actual library identifier
 *    (Find it in the Libraries panel - left sidebar in Apps Script editor)
 * 4. Customize the menu items and functions as needed
 * 5. Save the script (Ctrl+S or Cmd+S)
 * 6. Refresh your spreadsheet - the menu will appear automatically
 * 
 * AVAILABLE LIBRARY FUNCTIONS:
 * - lookupItemInfo(itemName) - Look up FFXIV item information (gathering, vendors, prices)
 * - processItemList(sheetName, itemColumn, startRow) - Process a list of items from spreadsheet
 */

// IMPORTANT: Replace 'FFXIVTools' with your actual library identifier
// You can find it in the Libraries panel (left sidebar in Apps Script editor)
// Example: If your library identifier is "MyFFXIVLib", replace all FFXIVTools below

/**
 * Creates custom menu when spreadsheet opens
 * This runs automatically when the spreadsheet is opened
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('FFXIV Tools')
    .addItem('Lookup Item Info', 'menuLookupItemInfo')
    .addItem('Process Item List', 'menuProcessItemList')
    .addToUi();
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
      
      // Replace FFXIVTools with your library identifier
      const itemInfo = FFXIVTools.lookupItemInfo(itemName);
      
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
      
      // Replace FFXIVTools with your library identifier
      FFXIVTools.processItemList(null, column, startRow);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuProcessItemList: ' + error.toString());
  }
}

