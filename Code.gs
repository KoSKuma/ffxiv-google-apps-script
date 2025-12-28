/**
 * Main entry point for the FFXIV Google Apps Script project
 * 
 * @author Your Name
 * @version 1.0.0
 */

/**
 * Runs when the spreadsheet is opened
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FFXIV Tools')
    .addItem('Run Function', 'main')
    .addToUi();
}

/**
 * Main function - entry point for manual execution
 */
function main() {
  try {
    Logger.log('Starting FFXIV Google Apps Script...');
    
    // Your main logic here
    
    Logger.log('Execution completed successfully');
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

