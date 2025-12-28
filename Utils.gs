/**
 * Utility functions for the FFXIV Google Apps Script project
 */

/**
 * Gets the active spreadsheet
 * @return {Spreadsheet} The active spreadsheet
 */
function getActiveSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Gets a sheet by name, creates it if it doesn't exist
 * @param {string} sheetName - Name of the sheet
 * @return {Sheet} The sheet object
 */
function getOrCreateSheet(sheetName) {
  const ss = getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  return sheet;
}

/**
 * Gets the data range of a sheet
 * @param {Sheet} sheet - The sheet object
 * @return {Range} The data range
 */
function getDataRange(sheet) {
  return sheet.getDataRange();
}

/**
 * Gets all values from a sheet as a 2D array
 * @param {Sheet} sheet - The sheet object
 * @return {Array<Array>} 2D array of values
 */
function getSheetValues(sheet) {
  const range = getDataRange(sheet);
  return range.getValues();
}

/**
 * Sets values to a sheet starting at the specified row and column
 * @param {Sheet} sheet - The sheet object
 * @param {number} row - Starting row (1-based)
 * @param {number} col - Starting column (1-based)
 * @param {Array<Array>} values - 2D array of values to set
 */
function setSheetValues(sheet, row, col, values) {
  const range = sheet.getRange(row, col, values.length, values[0].length);
  range.setValues(values);
}

/**
 * Clears all data from a sheet
 * @param {Sheet} sheet - The sheet object
 */
function clearSheet(sheet) {
  sheet.clear();
}

/**
 * Logs a message with timestamp
 * @param {string} message - Message to log
 */
function logWithTimestamp(message) {
  const timestamp = new Date().toISOString();
  Logger.log(`[${timestamp}] ${message}`);
}

/**
 * Opens a spreadsheet by ID
 * Useful for working with spreadsheets other than the bound one
 * @param {string} spreadsheetId - The ID of the spreadsheet to open
 * @return {Spreadsheet} The spreadsheet object
 */
function openSpreadsheetById(spreadsheetId) {
  try {
    return SpreadsheetApp.openById(spreadsheetId);
  } catch (error) {
    Logger.log('Error opening spreadsheet by ID: ' + error.toString());
    throw error;
  }
}

/**
 * Opens a spreadsheet by URL
 * Useful for working with spreadsheets other than the bound one
 * @param {string} url - The URL of the spreadsheet to open
 * @return {Spreadsheet} The spreadsheet object
 */
function openSpreadsheetByUrl(url) {
  try {
    return SpreadsheetApp.openByUrl(url);
  } catch (error) {
    Logger.log('Error opening spreadsheet by URL: ' + error.toString());
    throw error;
  }
}

