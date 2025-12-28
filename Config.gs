/**
 * Internal configuration constants for the FFXIV Google Apps Script project
 * 
 * NOTE: This configuration is INTERNAL and not directly accessible when used as a library.
 * Public functions in Code.gs use these values internally.
 * Library users should use the high-level functions that utilize this config automatically.
 */

/**
 * Configuration object containing project settings
 * Used internally by public functions in Code.gs
 */
const CONFIG = {
  // Sheet names
  SHEET_NAMES: {
    MAIN: 'Main',
    DATA: 'Data',
  },
  
  // Column indices (0-based)
  COLUMNS: {
    // Add your column mappings here
  },
  
  // Spreadsheet IDs (for working with multiple spreadsheets)
  // Get the ID from the spreadsheet URL: 
  // https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
  SPREADSHEET_IDS: {
    // EXAMPLE: MAIN_DATA: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    // Add your spreadsheet IDs here
  },
  
  // Other configuration values
  // Add your config values here
};

