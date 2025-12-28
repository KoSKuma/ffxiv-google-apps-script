/**
 * Main entry point for the FFXIV Google Apps Script project
 * 
 * This is a simple example to demonstrate local development workflow.
 * 
 * @author Your Name
 * @version 1.0.0
 */

/**
 * Runs automatically when the spreadsheet is opened.
 * Creates a custom menu in the Google Sheets menu bar.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FFXIV Tools')
    .addItem('Add Timestamp', 'addTimestamp')
    .addItem('Hello World Example', 'helloWorld')
    .addSeparator()
    .addItem('Read Active Cell', 'readActiveCell')
    .addToUi();
}

/**
 * Simple example: Adds a timestamp to cell A1
 * This demonstrates writing to a sheet
 */
function addTimestamp() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const timestamp = new Date().toLocaleString();
    
    sheet.getRange('A1').setValue('Last updated: ' + timestamp);
    
    SpreadsheetApp.getUi().alert('Timestamp added to cell A1!');
    Logger.log('Timestamp added: ' + timestamp);
  } catch (error) {
    Logger.log('Error in addTimestamp: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

/**
 * Simple example: Writes "Hello World" to the active cell
 * This demonstrates basic sheet interaction
 */
function helloWorld() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const activeCell = sheet.getActiveCell();
    
    activeCell.setValue('Hello World from Apps Script!');
    
    SpreadsheetApp.getUi().alert('Hello World written to ' + activeCell.getA1Notation());
    Logger.log('Hello World written to ' + activeCell.getA1Notation());
  } catch (error) {
    Logger.log('Error in helloWorld: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

/**
 * Example: Reads the value from the currently selected cell
 * This demonstrates reading from a sheet
 */
function readActiveCell() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const activeCell = sheet.getActiveCell();
    const value = activeCell.getValue();
    const address = activeCell.getA1Notation();
    
    const message = 'Cell ' + address + ' contains: "' + value + '"';
    SpreadsheetApp.getUi().alert(message);
    Logger.log(message);
  } catch (error) {
    Logger.log('Error in readActiveCell: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

/**
 * Example: Reads data from a range and processes it
 * This demonstrates batch operations (better performance)
 */
function processDataExample() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Get data from range A1:B10 (2 columns, 10 rows)
    const range = sheet.getRange('A1:B10');
    const values = range.getValues();
    
    Logger.log('Read ' + values.length + ' rows of data');
    
    // Process the data (example: log each row)
    values.forEach((row, index) => {
      Logger.log('Row ' + (index + 1) + ': ' + row.join(', '));
    });
    
    // Example: Write processed data back (to column C)
    const processedData = values.map((row, index) => {
      return ['Processed row ' + (index + 1)];
    });
    
    sheet.getRange('C1:C10').setValues(processedData);
    
    SpreadsheetApp.getUi().alert('Processed ' + values.length + ' rows!');
  } catch (error) {
    Logger.log('Error in processDataExample: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

