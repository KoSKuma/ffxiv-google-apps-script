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
 * Library users should create their own onOpen() if needed.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FFXIV Tools')
    .addItem('Add Timestamp', 'addTimestamp')
    .addItem('Hello World Example', 'helloWorld')
    .addSeparator()
    .addItem('Read Active Cell', 'readActiveCell')
    .addSeparator()
    .addItem('Process Data', 'processData')
    .addItem('Process Data from Another Sheet', 'processDataFromSpreadsheet')
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

