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
    .addItem('Process Crafting Request', 'menuProcessCraftingRequest')
    .addItem('Obtain Material Information', 'menuObtainMaterialInfo')
    .addSeparator()
    .addSubMenu(ui.createMenu('Debug')
      .addItem('Lookup Item Info', 'menuLookupItemInfo')
      .addItem('Process Item List', 'menuProcessItemList')
      .addItem('Get Crafting Materials', 'menuGetCraftingMaterials'))
    .addToUi();
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
    
    logWithTimestamp('Obtaining material information from sheet: ' + sheetName);
    processItemList(sheetName, column, startRow);
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuObtainMaterialInfo: ' + error.toString());
  }
}

// ============================================================================
// Crafting Materials Features
// ============================================================================

/**
 * PUBLIC API: Gets crafting materials needed to craft an item
 * 
 * Returns a list of all materials (including sub-ingredients) needed to craft
 * a given item. Handles recursive crafting (ingredients that need to be crafted).
 * 
 * When used as library: LibraryName.getCraftingMaterials(itemName)
 * 
 * @param {string} itemName - Name of the item to get crafting materials for (e.g., "Ceviche")
 * @param {boolean} includeSubIngredients - Whether to include sub-ingredients (default: true)
 * @return {Object} Object containing crafting tree and flattened materials list
 */
function getCraftingMaterials(itemName, includeSubIngredients) {
  try {
    if (includeSubIngredients === undefined) includeSubIngredients = true;
    
    if (!itemName || itemName.trim() === '') {
      throw new Error('Item name is required');
    }
    
    logWithTimestamp('Getting crafting materials for: ' + itemName);
    
    // Search for item by name
    let searchResult;
    try {
      searchResult = searchItemByName(itemName);
    } catch (error) {
      if (error.toString().includes('alive nodes') || error.toString().includes('Search Error')) {
        throw new Error('XIVAPI search is currently unavailable. Please try again later.');
      }
      throw error;
    }
    
    if (!searchResult) {
      throw new Error('Item "' + itemName + '" not found. Please check the spelling.');
    }
    
    const itemId = searchResult.ID;
    logWithTimestamp('Found item ID: ' + itemId);
    
    // Get crafting tree
    const tree = getCraftingTree(itemId, 0, 5, {});
    
    if (!tree) {
      throw new Error('Could not retrieve crafting information for "' + itemName + '"');
    }
    
    if (!tree.canBeCrafted) {
      return {
        itemName: tree.itemName,
        itemId: tree.itemId,
        canBeCrafted: false,
        message: 'This item cannot be crafted.',
        tree: tree,
        materials: []
      };
    }
    
    // Flatten the tree to get all materials needed
    let materials = [];
    if (includeSubIngredients) {
      const materialMap = flattenCraftingTree(tree, {});
      // Create a map of itemId -> itemName from the tree for lookup
      const itemNameMap = {};
      function buildItemNameMap(t) {
        if (t && t.itemId) {
          itemNameMap[t.itemId] = t.itemName;
        }
        if (t && t.ingredients) {
          t.ingredients.forEach(function(ing) {
            itemNameMap[ing.itemId] = ing.itemName;
            if (ing.subTree) {
              buildItemNameMap(ing.subTree);
            }
          });
        }
      }
      buildItemNameMap(tree);
      
      materials = Object.keys(materialMap).map(function(itemId) {
        const id = parseInt(itemId);
        return {
          itemId: id,
          itemName: itemNameMap[id] || 'Item #' + itemId,
          amount: materialMap[itemId]
        };
      });
    } else {
      // Just return direct ingredients
      materials = tree.ingredients.map(function(ingredient) {
        return {
          itemId: ingredient.itemId,
          itemName: ingredient.itemName,
          amount: ingredient.amount
        };
      });
    }
    
    // Format for display
    const formattedTree = formatCraftingTree(tree, 0);
    const formattedMaterials = materials.map(function(m) {
      return m.amount + 'x ' + m.itemName;
    }).join(', ');
    
    return {
      itemName: tree.itemName,
      itemId: tree.itemId,
      canBeCrafted: true,
      tree: tree,
      materials: materials,
      formattedTree: formattedTree,
      formattedMaterials: formattedMaterials
    };
  } catch (error) {
    logWithTimestamp('Error in getCraftingMaterials: ' + error.toString());
    throw error;
  }
}

/**
 * Menu handler: Get crafting materials for an item
 */
function menuGetCraftingMaterials() {
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt('Get Crafting Materials', 'Enter item name:', ui.ButtonSet.OK_CANCEL);
    
    if (response.getSelectedButton() === ui.Button.OK) {
      const itemName = response.getResponseText().trim();
      
      if (itemName === '') {
        ui.alert('Item name cannot be empty');
        return;
      }
      
      const result = getCraftingMaterials(itemName, true);
      
      if (!result.canBeCrafted) {
        ui.alert('Crafting Information', result.message, ui.ButtonSet.OK);
        return;
      }
      
      // Display results
      let message = 'Crafting Materials for: ' + result.itemName + '\n\n';
      message += 'Materials Needed:\n' + result.formattedMaterials + '\n\n';
      message += 'Crafting Tree:\n' + result.formattedTree;
      
      ui.alert('Crafting Materials', message, ui.ButtonSet.OK);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuGetCraftingMaterials: ' + error.toString());
  }
}

/**
 * PUBLIC API: Processes crafting requests from spreadsheet
 * 
 * Reads item names and quantities from "Requested for Crafting" sheet:
 * - Column A: Item names
 * - Column B: Quantity to craft
 * 
 * Writes materials needed to columns C and D:
 * - Column C: Material names (one per line)
 * - Column D: Total quantity needed (material quantity × column B)
 * 
 * Inserts rows for materials and adds padding blank lines between items.
 * 
 * When used as library: LibraryName.processCraftingRequest()
 * 
 * @param {string} [sheetName] - Sheet name (defaults to "Requested for Crafting")
 * @param {string} [itemColumn] - Column letter for item names (defaults to 'A')
 * @param {string} [quantityColumn] - Column letter for quantities (defaults to 'B')
 * @param {number} [startRow] - Starting row number (defaults to 2, assuming row 1 is header)
 * @return {Array<Object>} Array of processing results
 */
function processCraftingRequest(sheetName, itemColumn, quantityColumn, startRow) {
  try {
    const targetSheetName = sheetName || 'Requested for Crafting';
    const itemCol = itemColumn || 'A';
    const qtyCol = quantityColumn || 'B';
    const start = startRow || 2;
    
    // Get or create sheet
    const sheet = getOrCreateSheet(targetSheetName);
    
    // Write headers if not present
    if (start === 2) {
      sheet.getRange('A1').setValue('Item Name');
      sheet.getRange('B1').setValue('Quantity');
      sheet.getRange('C1').setValue('Material Name');
      sheet.getRange('D1').setValue('Material Quantity');
    }
    
    // Read items and quantities
    const lastRow = sheet.getLastRow();
    if (lastRow < start) {
      SpreadsheetApp.getUi().alert('No items found in sheet "' + targetSheetName + '" starting at row ' + start);
      return [];
    }
    
    const items = [];
    for (let row = start; row <= lastRow; row++) {
      const itemName = sheet.getRange(itemCol + row).getValue();
      const quantity = sheet.getRange(qtyCol + row).getValue();
      
      if (itemName && itemName.toString().trim() !== '') {
        const qty = parseFloat(quantity) || 1;
        items.push({
          row: row,
          name: itemName.toString().trim(),
          quantity: qty
        });
      }
    }
    
    if (items.length === 0) {
      SpreadsheetApp.getUi().alert('No items found in column ' + itemCol);
      return [];
    }
    
    logWithTimestamp('Processing ' + items.length + ' crafting requests');
    
    const results = [];
    
    // Process items in reverse order to avoid row shifting issues
    // When we insert rows, it won't affect items we haven't processed yet
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      const itemRow = item.row;
      
      try {
        logWithTimestamp('Processing item ' + (i + 1) + '/' + items.length + ': ' + item.name + ' x' + item.quantity);
        
        // Get crafting materials
        const materialsResult = getCraftingMaterials(item.name, true);
        
        if (!materialsResult.canBeCrafted) {
          // Item cannot be crafted - write error message
          sheet.getRange('C' + itemRow).setValue('Cannot be crafted');
          sheet.getRange('D' + itemRow).setValue('N/A');
          results.push({
            itemName: item.name,
            quantity: item.quantity,
            success: false,
            error: materialsResult.message
          });
          
          // Add padding line after error
          sheet.insertRowAfter(itemRow);
          
          // Add delay to respect API rate limits
          if (i > 0) {
            Utilities.sleep(1000);
          }
          continue;
        }
        
        // Get materials list
        const materials = materialsResult.materials || [];
        
        if (materials.length === 0) {
          sheet.getRange('C' + itemRow).setValue('No materials needed');
          sheet.getRange('D' + itemRow).setValue('0');
          results.push({
            itemName: item.name,
            quantity: item.quantity,
            success: true,
            materialsCount: 0
          });
          
          // Add padding line
          sheet.insertRowAfter(itemRow);
          
          if (i > 0) {
            Utilities.sleep(1000);
          }
          continue;
        }
        
        // Insert rows for materials (we need materials.length rows + 1 padding row)
        const rowsToInsert = materials.length + 1; // +1 for padding blank line
        for (let j = 0; j < rowsToInsert; j++) {
          sheet.insertRowAfter(itemRow);
        }
        
        // Write materials to column C and D
        let materialRow = itemRow + 1;
        materials.forEach(function(material) {
          const totalQuantity = material.amount * item.quantity;
          sheet.getRange('C' + materialRow).setValue(material.itemName);
          sheet.getRange('D' + materialRow).setValue(totalQuantity);
          materialRow++;
        });
        
        // Add padding blank line (already inserted, just leave it blank)
        // materialRow is now pointing to the padding line, which is already blank
        
        results.push({
          itemName: item.name,
          quantity: item.quantity,
          success: true,
          materialsCount: materials.length
        });
        
        // Add delay to respect API rate limits
        if (i > 0) {
          Utilities.sleep(1000);
        }
      } catch (error) {
        logWithTimestamp('Error processing item "' + item.name + '": ' + error.toString());
        sheet.getRange('C' + itemRow).setValue('Error: ' + error.toString());
        sheet.getRange('D' + itemRow).setValue('Error');
        
        results.push({
          itemName: item.name,
          quantity: item.quantity,
          success: false,
          error: error.toString()
        });
        
        // Add padding line after error
        sheet.insertRowAfter(itemRow);
      }
    }
    
    const successCount = results.filter(function(r) { return r.success; }).length;
    logWithTimestamp('Processed ' + successCount + '/' + items.length + ' items successfully');
    SpreadsheetApp.getUi().alert('Processed ' + successCount + '/' + items.length + ' crafting requests successfully!');
    
    return results;
  } catch (error) {
    logWithTimestamp('Error in processCraftingRequest: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    throw error;
  }
}

/**
 * Menu handler: Process crafting requests from spreadsheet
 * 
 * Processes items from the "Requested for Crafting" sheet.
 * This is the main production workflow for batch crafting material calculation.
 */
function menuProcessCraftingRequest() {
  try {
    const sheetName = 'Requested for Crafting';
    logWithTimestamp('Processing crafting requests from sheet: ' + sheetName);
    processCraftingRequest(sheetName);
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
    Logger.log('Error in menuProcessCraftingRequest: ' + error.toString());
  }
}

