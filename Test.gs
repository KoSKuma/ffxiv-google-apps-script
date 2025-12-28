/**
 * Test Functions for FFXIV Google Apps Script
 * 
 * This file contains test functions for debugging and testing features.
 * This file is safe to keep - it won't be removed during clasp push.
 * 
 * Usage:
 * 1. Push code: clasp push
 * 2. Open Apps Script editor: clasp open-script
 * 3. Select a test function from the dropdown
 * 4. Click Run
 * 5. Check logs: View → Logs or clasp logs
 */

/**
 * Test: Search for an item by name
 * Tests the searchItemByName function
 */
function testSearchItem() {
  try {
    Logger.log('=== Testing searchItemByName ===');
    const itemName = 'Iron Ore';
    Logger.log('Searching for: ' + itemName);
    
    const result = searchItemByName(itemName);
    Logger.log('Result: ' + JSON.stringify(result));
    
    if (result && result.ID) {
      Logger.log('✅ Success! Found item ID: ' + result.ID);
      Logger.log('Item Name: ' + result.Name);
    } else {
      Logger.log('❌ Failed: No result found');
    }
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}

/**
 * Test: Get item details by ID
 * Tests the getItemDetails function (now uses Garland Tools API)
 */
function testGetItemDetails() {
  try {
    Logger.log('=== Testing getItemDetails (Garland Tools) ===');
    const itemId = 5111; // Iron Ore ID
    Logger.log('Getting details for item ID: ' + itemId);
    
    const result = getItemDetails(itemId);
    
    if (result && result.item) {
      Logger.log('Item Name: ' + (result.item.name || 'N/A'));
      Logger.log('Item ID: ' + (result.item.id || 'N/A'));
      Logger.log('Price: ' + (result.item.price || 'N/A') + ' Gil');
      Logger.log('Sell Price: ' + (result.item.sell_price || 'N/A') + ' Gil');
      Logger.log('Nodes: ' + (result.item.nodes ? result.item.nodes.length : 0));
      Logger.log('Vendors: ' + (result.item.vendors ? result.item.vendors.length : 0));
      Logger.log('Partials: ' + (result.partials ? result.partials.length : 0));
      Logger.log('✅ Success! Item details retrieved from Garland Tools');
    } else {
      Logger.log('❌ Failed: Invalid response structure');
    }
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}

/**
 * Test: Full item lookup (search + details)
 * Tests the complete lookupItemInfo function including price prioritization
 */
function testLookupItemInfo() {
  try {
    Logger.log('=== Testing lookupItemInfo ===');
    const itemName = 'Iron Ore';
    Logger.log('Looking up: ' + itemName);
    
    const result = lookupItemInfo(itemName);
    
    Logger.log('=== Results ===');
    Logger.log('Item Name: ' + result.itemName);
    Logger.log('Item ID: ' + result.itemId);
    Logger.log('');
    Logger.log('💰 PRICE INFORMATION:');
    Logger.log('  Can be bought: ' + result.canBeBought);
    if (result.canBeBought) {
      Logger.log('  Best Price: ' + result.bestPrice + ' Gil');
      Logger.log('  Best Vendor: ' + (result.bestPriceVendor ? result.bestPriceVendor.npcName : 'N/A'));
      Logger.log('  Price Summary: ' + result.priceSummary);
    }
    Logger.log('');
    Logger.log('Gathering Locations: ' + result.formattedGathering);
    Logger.log('All Vendors: ' + result.formattedVendors);
    
    Logger.log('✅ Success! Full item info retrieved');
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}

/**
 * Test: Get gathering locations
 * Tests gathering location extraction from Garland Tools data
 */
function testGatheringLocations() {
  try {
    Logger.log('=== Testing getGatheringLocations ===');
    const itemId = 5111; // Iron Ore
    
    const garlandData = getItemDetails(itemId);
    const locations = getGatheringLocations(garlandData);
    
    Logger.log('Gathering Locations Count: ' + locations.length);
    Logger.log('Locations: ' + JSON.stringify(locations));
    Logger.log('Formatted: ' + formatGatheringLocations(locations));
    
    if (locations.length > 0) {
      locations.forEach(function(loc, index) {
        Logger.log('  Location ' + (index + 1) + ': ' + loc.type + 
          (loc.name ? ' - ' + loc.name : '') + 
          (loc.level ? ' (Level ' + loc.level + ')' : ''));
      });
    }
    
    Logger.log('✅ Success!');
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}

/**
 * Test: Get vendor information
 * Tests vendor/NPC information extraction from Garland Tools data
 */
function testVendorInfo() {
  try {
    Logger.log('=== Testing getVendorInfo ===');
    const itemId = 5111; // Iron Ore
    
    const garlandData = getItemDetails(itemId);
    const vendors = getVendorInfo(itemId, garlandData);
    
    Logger.log('Vendors Count: ' + vendors.length);
    Logger.log('Vendors: ' + JSON.stringify(vendors));
    Logger.log('Formatted: ' + formatVendorInfo(vendors));
    
    if (vendors.length > 0) {
      Logger.log('');
      Logger.log('💰 Price Information:');
      vendors.forEach(function(vendor, index) {
        Logger.log('  Vendor ' + (index + 1) + ': ' + vendor.npcName + 
          ' - ' + vendor.price + ' ' + vendor.currency + 
          ' (' + vendor.location + ')');
      });
    }
    
    Logger.log('✅ Success!');
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}

/**
 * Test: Process item list from active sheet
 * Tests batch processing functionality
 */
function testProcessItemList() {
  try {
    Logger.log('=== Testing processItemList ===');
    
    // Test with default parameters (column A, starting row 2)
    const result = processItemList();
    
    Logger.log('Processed ' + result.length + ' items');
    Logger.log('✅ Success!');
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}

/**
 * Test: API endpoint directly
 * Tests the raw API calls to verify connectivity for both APIs
 */
function testAPIConnectivity() {
  try {
    Logger.log('=== Testing API Connectivity ===');
    
    // Test XIVAPI v2 Search
    Logger.log('');
    Logger.log('--- Testing XIVAPI v2 Search ---');
    const xivapiUrl = 'https://v2.xivapi.com/api/search?version=7.4&query=Name%3D%22Iron%20Ore%22&sheets=Item';
    Logger.log('URL: ' + xivapiUrl);
    
    const xivapiResponse = UrlFetchApp.fetch(xivapiUrl, {muteHttpExceptions: true});
    const xivapiCode = xivapiResponse.getResponseCode();
    const xivapiText = xivapiResponse.getContentText();
    
    Logger.log('Response Code: ' + xivapiCode);
    
    if (xivapiCode === 200) {
      const xivapiData = JSON.parse(xivapiText);
      Logger.log('Results found: ' + (xivapiData.results ? xivapiData.results.length : 0));
      if (xivapiData.results && xivapiData.results.length > 0) {
        Logger.log('First result row_id: ' + xivapiData.results[0].row_id);
        Logger.log('First result name: ' + xivapiData.results[0].fields.Name);
      }
      Logger.log('✅ XIVAPI is working!');
    } else {
      Logger.log('❌ XIVAPI returned error code: ' + xivapiCode);
      Logger.log('Response: ' + xivapiText.substring(0, 200));
    }
    
    // Test Garland Tools API
    Logger.log('');
    Logger.log('--- Testing Garland Tools API ---');
    const garlandUrl = 'https://www.garlandtools.org/db/doc/item/en/3/5111.json';
    Logger.log('URL: ' + garlandUrl);
    
    const garlandResponse = UrlFetchApp.fetch(garlandUrl, {muteHttpExceptions: true});
    const garlandCode = garlandResponse.getResponseCode();
    const garlandText = garlandResponse.getContentText();
    
    Logger.log('Response Code: ' + garlandCode);
    
    if (garlandCode === 200) {
      const garlandData = JSON.parse(garlandText);
      if (garlandData.item) {
        Logger.log('Item Name: ' + garlandData.item.name);
        Logger.log('Item ID: ' + garlandData.item.id);
        Logger.log('Price: ' + garlandData.item.price + ' Gil');
        Logger.log('Nodes: ' + (garlandData.item.nodes ? garlandData.item.nodes.length : 0));
        Logger.log('Vendors: ' + (garlandData.item.vendors ? garlandData.item.vendors.length : 0));
        Logger.log('Partials: ' + (garlandData.partials ? garlandData.partials.length : 0));
        Logger.log('✅ Garland Tools API is working!');
      } else {
        Logger.log('❌ Garland Tools: Invalid response structure');
      }
    } else {
      Logger.log('❌ Garland Tools returned error code: ' + garlandCode);
      Logger.log('Response: ' + garlandText.substring(0, 200));
    }
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}

/**
 * Test: Multiple items
 * Tests searching for multiple different items with full information
 */
function testMultipleItems() {
  try {
    Logger.log('=== Testing Multiple Items ===');
    const items = ['Iron Ore', 'Copper Ore', 'Silver Ore'];
    
    items.forEach(function(itemName, index) {
      Logger.log('');
      Logger.log('--- Item ' + (index + 1) + ': ' + itemName + ' ---');
      try {
        const result = lookupItemInfo(itemName);
        Logger.log('✅ ' + itemName + ':');
        Logger.log('   ID: ' + result.itemId);
        Logger.log('   Can be bought: ' + result.canBeBought);
        if (result.canBeBought && result.bestPrice) {
          Logger.log('   Best Price: ' + result.bestPrice + ' Gil');
        }
        Logger.log('   Gathering: ' + result.formattedGathering);
        Logger.log('   Vendors: ' + (result.vendors.length > 0 ? result.vendors.length + ' vendors' : 'None'));
      } catch (error) {
        Logger.log('❌ ' + itemName + ': ' + error.toString());
      }
      
      // Delay between requests to respect rate limits
      if (index < items.length - 1) {
        Utilities.sleep(1000);
      }
    });
    
    Logger.log('');
    Logger.log('=== Test Complete ===');
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}

/**
 * Quick test menu
 * Creates a menu for easy test function access
 */
function onTestOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🧪 Tests')
    .addItem('Test Search Item', 'testSearchItem')
    .addItem('Test Get Item Details', 'testGetItemDetails')
    .addItem('Test Full Lookup', 'testLookupItemInfo')
    .addSeparator()
    .addItem('Test Gathering Locations', 'testGatheringLocations')
    .addItem('Test Vendor Info', 'testVendorInfo')
    .addSeparator()
    .addItem('Test API Connectivity', 'testAPIConnectivity')
    .addItem('Test Multiple Items', 'testMultipleItems')
    .addSeparator()
    .addItem('Test Process Item List', 'testProcessItemList')
    .addToUi();
}

