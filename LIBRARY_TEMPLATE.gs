/**
 * FFXIV Tools Library Integration - Copy-Paste Template
 * 
 * SETUP INSTRUCTIONS:
 * 1. Add the library using the Script ID (see GETTING_STARTED.md)
 * 2. Replace 'FFXIVTools' below with your actual library identifier
 *    (Find it in the Libraries panel - left sidebar in Apps Script editor)
 * 3. Customize the menu items and functions as needed
 * 4. Save the script (Ctrl+S or Cmd+S)
 * 5. Refresh your spreadsheet - the menu will appear automatically
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
    .addItem('Add Timestamp', 'menuAddTimestamp')
    .addItem('Hello World', 'menuHelloWorld')
    .addItem('Read Active Cell', 'menuReadActiveCell')
    .addSeparator()
    .addItem('Process Data', 'menuProcessData')
    .addItem('Process Data from Another Sheet', 'menuProcessOtherSheet')
    .addItem('Get Data from Another Sheet', 'menuGetData')
    .addToUi();
}

/**
 * Menu handler: Adds timestamp to cell A1
 */
function menuAddTimestamp() {
  try {
    // Replace FFXIVTools with your library identifier
    FFXIVTools.addTimestamp();
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuAddTimestamp: ' + error.toString());
  }
}

/**
 * Menu handler: Writes "Hello World" to active cell
 */
function menuHelloWorld() {
  try {
    // Replace FFXIVTools with your library identifier
    FFXIVTools.helloWorld();
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuHelloWorld: ' + error.toString());
  }
}

/**
 * Menu handler: Reads value from active cell
 */
function menuReadActiveCell() {
  try {
    // Replace FFXIVTools with your library identifier
    FFXIVTools.readActiveCell();
    // Value is already shown in alert by the library function
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuReadActiveCell: ' + error.toString());
  }
}

/**
 * Menu handler: Processes data from active sheet
 * 
 * Customize the sheet name and range as needed
 */
function menuProcessData() {
  try {
    const sheetName = SpreadsheetApp.getActiveSheet().getName();
    const range = 'A1:B10'; // Customize this range as needed
    
    // Replace FFXIVTools with your library identifier
    const result = FFXIVTools.processData(sheetName, range);
    SpreadsheetApp.getUi().alert('Processed ' + result.length + ' rows successfully!');
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuProcessData: ' + error.toString());
  }
}

/**
 * Menu handler: Processes data from another spreadsheet
 * 
 * CUSTOMIZE: Replace 'YOUR_SPREADSHEET_ID_HERE' with actual spreadsheet ID
 * Get the ID from the spreadsheet URL: 
 * https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
 */
function menuProcessOtherSheet() {
  try {
    // CUSTOMIZE: Replace with your spreadsheet ID
    const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
    const sheetName = 'Data'; // Customize sheet name
    const range = 'A1:B10'; // Customize range
    
    if (spreadsheetId === 'YOUR_SPREADSHEET_ID_HERE') {
      SpreadsheetApp.getUi().alert('Please set the spreadsheetId in the menuProcessOtherSheet function!');
      return;
    }
    
    // Replace FFXIVTools with your library identifier
    const result = FFXIVTools.processDataFromSpreadsheet(spreadsheetId, sheetName, range);
    SpreadsheetApp.getUi().alert('Processed ' + result.length + ' rows from external spreadsheet!');
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuProcessOtherSheet: ' + error.toString());
  }
}

/**
 * Menu handler: Gets data from another spreadsheet
 * 
 * CUSTOMIZE: Replace 'YOUR_SPREADSHEET_ID_HERE' with actual spreadsheet ID
 * Get the ID from the spreadsheet URL: 
 * https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
 */
function menuGetData() {
  try {
    // CUSTOMIZE: Replace with your spreadsheet ID
    const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
    const sheetName = 'Main'; // Customize sheet name
    
    if (spreadsheetId === 'YOUR_SPREADSHEET_ID_HERE') {
      SpreadsheetApp.getUi().alert('Please set the spreadsheetId in the menuGetData function!');
      return;
    }
    
    // Replace FFXIVTools with your library identifier
    const data = FFXIVTools.getDataFromSpreadsheet(spreadsheetId, sheetName);
    SpreadsheetApp.getUi().alert('Retrieved ' + data.length + ' rows from spreadsheet!');
    Logger.log('Data preview: ' + JSON.stringify(data.slice(0, 3))); // Log first 3 rows
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuGetData: ' + error.toString());
  }
}

