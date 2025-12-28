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
    .addItem('Process Crafting Request', 'menuProcessCraftingRequest')
    .addItem('Obtain Material Information', 'menuObtainMaterialInfo')
    .addToUi();
}

/**
 * Menu handler: Process crafting requests
 * 
 * Processes items from the "Requested for Crafting" sheet.
 * This is the main production workflow for batch crafting material calculation.
 */
function menuProcessCraftingRequest() {
  try {
    const sheetName = 'Requested for Crafting';
    
    // Replace FFXIVTools with your library identifier
    FFXIVTools.processCraftingRequest(sheetName);
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuProcessCraftingRequest: ' + error.toString());
  }
}

/**
 * Menu handler: Obtain material information
 * 
 * Processes items from the "Material Info" sheet starting at column A, row 2.
 * This is the main production workflow for obtaining material information.
 */
function menuObtainMaterialInfo() {
  try {
    const sheetName = 'Material Info';
    const column = 'A';
    const startRow = 2;
    
    // Replace FFXIVTools with your library identifier
    FFXIVTools.processItemList(sheetName, column, startRow);
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuObtainMaterialInfo: ' + error.toString());
  }
}

