/**
 * Internal FFXIV API integration functions
 * 
 * NOTE: These functions are INTERNAL and not exposed when used as a library.
 * They are used by public functions in Code.gs.
 */

/**
 * Base URL for XIVAPI
 * Using v2 API which is more stable
 */
const XIVAPI_BASE_URL = 'https://v2.xivapi.com/api';

/**
 * Base URL for Garland Tools API
 * Alternative API for detailed item information
 */
const GARLAND_TOOLS_BASE_URL = 'https://www.garlandtools.org/db/doc/item';

/**
 * Searches for an item by name using XIVAPI v2
 * This function includes retry logic and error handling.
 * @param {string} itemName - Name of the item to search for
 * @return {Object} Item search result from API with ID and Name
 */
function searchItemByName(itemName) {
  try {
    // XIVAPI v2 search endpoint format (GET request)
    // Format: /api/search?version=7.4&query=Name="Item Name"&sheets=Item
    const queryParam = 'Name="' + itemName + '"';
    const url = XIVAPI_BASE_URL + '/search?version=7.4&query=' + encodeURIComponent(queryParam) + '&sheets=Item';
    
    const options = {
      'muteHttpExceptions': true,
      'method': 'get'
    };
    
    // Try up to 3 times with delays (XIVAPI search can be unreliable)
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = UrlFetchApp.fetch(url, options);
        const responseCode = response.getResponseCode();
        const responseText = response.getContentText();
        
        if (responseCode !== 200) {
          logWithTimestamp('XIVAPI returned error code: ' + responseCode + ' (attempt ' + attempt + '/3)');
          logWithTimestamp('Response: ' + responseText.substring(0, 200));
          if (attempt < 3) {
            Utilities.sleep(1000 * attempt); // Exponential backoff: 1s, 2s, 3s
            continue;
          }
          throw new Error('XIVAPI error: HTTP ' + responseCode + ' - ' + responseText.substring(0, 100));
        }
        
        const data = JSON.parse(responseText);
        
        // Check for API errors in response
        if (data.code && data.code !== 200) {
          const errorMsg = data.message || 'Unknown error';
          logWithTimestamp('XIVAPI search error: ' + errorMsg + ' (attempt ' + attempt + '/3)');
          
          if (attempt < 3) {
            Utilities.sleep(1000 * attempt);
            continue;
          }
          
          throw new Error('XIVAPI search error: ' + errorMsg);
        }
        
        // v2 API response structure: data.results array
        // Each result has: row_id (item ID), fields.Name (item name), sheet
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          // Return in format expected by rest of code
          return {
            ID: result.row_id,
            Name: result.fields ? result.fields.Name : itemName
          };
        }
        
        return null;
      } catch (error) {
        lastError = error;
        if (attempt < 3) {
          Utilities.sleep(1000 * attempt);
          continue;
        }
        throw error;
      }
    }
    
    throw lastError || new Error('Failed to search item after 3 attempts');
  } catch (error) {
    logWithTimestamp('Error searching item: ' + error.toString());
    throw error;
  }
}

/**
 * Gets detailed item information from Garland Tools API
 * @param {number} itemId - The ID of the item
 * @return {Object} Detailed item information from Garland Tools
 */
function getItemDetails(itemId) {
  try {
    // Garland Tools endpoint format: /db/doc/item/en/3/{itemId}.json
    const url = GARLAND_TOOLS_BASE_URL + '/en/3/' + itemId + '.json';
    
    const options = {
      'muteHttpExceptions': true,
      'method': 'get'
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode !== 200) {
      logWithTimestamp('Garland Tools returned error code: ' + responseCode);
      logWithTimestamp('Response: ' + responseText.substring(0, 200));
      throw new Error('Garland Tools error: HTTP ' + responseCode);
    }
    
    const data = JSON.parse(responseText);
    
    // Garland Tools response structure: { item: {...}, partials: [...] }
    if (!data.item) {
      throw new Error('Garland Tools error: No item data found');
    }
    
    return data;
  } catch (error) {
    logWithTimestamp('Error getting item details: ' + error.toString());
    throw error;
  }
}

/**
 * Gets gathering information for an item from Garland Tools data
 * @param {Object} garlandData - Item data from Garland Tools API
 * @return {Array<Object>} Array of gathering location objects
 */
function getGatheringLocations(garlandData) {
  const locations = [];
  
  try {
    // Garland Tools structure: { item: { nodes: [158, ...] }, partials: [{ type: "node", ... }] }
    if (!garlandData || !garlandData.item) {
      return locations;
    }
    
    const item = garlandData.item;
    const partials = garlandData.partials || [];
    
    // Get node IDs from item
    const nodeIds = item.nodes || [];
    
    if (nodeIds.length === 0) {
      return locations;
    }
    
    // Extract node details from partials
    nodeIds.forEach(function(nodeId) {
      const nodePartial = partials.find(function(p) {
        return p.type === 'node' && p.id === String(nodeId);
      });
      
      if (nodePartial && nodePartial.obj) {
        const nodeObj = nodePartial.obj;
        const nodeType = nodeObj.t === 0 ? 'Mining' : (nodeObj.t === 1 ? 'Botany' : 'Gathering');
        locations.push({
          type: nodeType,
          level: nodeObj.l || '?',
          name: nodeObj.n || 'Unknown',
          zone: nodeObj.z || null
        });
      } else {
        // Node ID exists but no partial details
        locations.push({
          type: 'Gathering',
          level: '?',
          nodeId: nodeId
        });
      }
    });
  } catch (error) {
    logWithTimestamp('Error getting gathering locations: ' + error.toString());
  }
  
  return locations;
}

/**
 * Gets vendor/NPC purchase information for an item from Garland Tools data
 * @param {number} itemId - The ID of the item
 * @param {Object} [garlandData] - Optional Garland Tools data (to avoid duplicate API call)
 * @return {Array<Object>} Array of vendor information objects
 */
function getVendorInfo(itemId, garlandData) {
  const vendors = [];
  
  try {
    // Use provided Garland Tools data if available, otherwise fetch
    const data = garlandData || getItemDetails(itemId);
    
    if (!data || !data.item) {
      return vendors;
    }
    
    const item = data.item;
    const partials = data.partials || [];
    
    // Get vendor IDs from item (for Gil purchases)
    const vendorIds = item.vendors || [];
    
    // Get trade shops (for special currency purchases)
    const tradeShops = item.tradeShops || [];
    
    // If no vendors and no trade shops found, item cannot be bought
    if (vendorIds.length === 0 && tradeShops.length === 0) {
      return vendors; // Return empty array - item is not sold
    }
    
    // Process regular vendors (Gil purchases)
    vendorIds.forEach(function(vendorId) {
      const npcPartial = partials.find(function(p) {
        return p.type === 'npc' && p.id === String(vendorId);
      });
      
      if (npcPartial && npcPartial.obj) {
        const npcObj = npcPartial.obj;
        const location = npcObj.c && npcObj.c.length >= 2 ? 
          'Coordinates: ' + npcObj.c[0] + ', ' + npcObj.c[1] : 
          'Location: ' + (npcObj.l || 'Unknown');
        
        vendors.push({
          npcName: npcObj.n || 'Unknown NPC',
          location: location,
          price: item.price || 0,
          currency: 'Gil',
          npcType: npcObj.t || null,
          level: npcObj.l || null
        });
      } else {
        // Vendor ID exists but no partial details
        vendors.push({
          npcName: 'Vendor #' + vendorId,
          location: 'Unknown',
          price: item.price || 0,
          currency: 'Gil'
        });
      }
    });
    
    // Process trade shops (special currency purchases)
    tradeShops.forEach(function(shop) {
      const shopName = shop.shop || 'Unknown Shop';
      const listings = shop.listings || [];
      
      listings.forEach(function(listing) {
        const currencies = listing.currency || [];
        
        currencies.forEach(function(currency) {
          const currencyId = currency.id;
          const amount = currency.amount || 0;
          
          // Find currency name in partials
          const currencyPartial = partials.find(function(p) {
            return p.type === 'item' && p.id === String(currencyId);
          });
          
          const currencyName = currencyPartial && currencyPartial.obj ? 
            currencyPartial.obj.n || 'Currency #' + currencyId : 
            'Currency #' + currencyId;
          
          // Get NPC details if available
          const npcIds = shop.npcs || [];
          let npcName = shopName;
          let location = 'Various';
          
          if (npcIds.length > 0) {
            const npcId = npcIds[0]; // Use first NPC
            const npcPartial = partials.find(function(p) {
              return p.type === 'npc' && p.id === String(npcId);
            });
            
            if (npcPartial && npcPartial.obj) {
              const npcObj = npcPartial.obj;
              npcName = npcObj.n || shopName;
              location = npcObj.c && npcObj.c.length >= 2 ? 
                'Coordinates: ' + npcObj.c[0] + ', ' + npcObj.c[1] : 
                'Location: ' + (npcObj.l || 'Unknown');
            }
          }
          
          vendors.push({
            npcName: npcName,
            location: location,
            price: amount,
            currency: currencyName,
            shop: shopName,
            npcType: null,
            level: null
          });
        });
      });
    });
    
    // If no vendors were successfully processed, item cannot be bought
    // (This shouldn't happen if vendorIds.length > 0 or tradeShops.length > 0, but handle edge case)
  } catch (error) {
    logWithTimestamp('Error getting vendor info: ' + error.toString());
    // Don't throw - return empty array if vendor info unavailable
  }
  
  return vendors;
}

/**
 * Formats gathering locations for display
 * @param {Array<Object>} locations - Array of gathering location objects
 * @return {string} Formatted string of gathering locations
 */
function formatGatheringLocations(locations) {
  if (!locations || locations.length === 0) {
    return 'Not available';
  }
  
  return locations.map(function(loc) {
    const parts = [loc.type];
    if (loc.name) {
      parts.push(loc.name);
    }
    if (loc.level) {
      parts.push('Level ' + loc.level);
    }
    return parts.join(' - ');
  }).join('; ');
}

/**
 * Formats vendor information for display
 * Deduplicates vendors by name, price, and currency
 * @param {Array<Object>} vendors - Array of vendor objects
 * @return {string} Formatted string of vendor information
 */
function formatVendorInfo(vendors) {
  if (!vendors || vendors.length === 0) {
    return 'Not available';
  }
  
  // Deduplicate vendors by name, price, and currency
  const seen = {};
  const uniqueVendors = [];
  
  vendors.forEach(function(vendor) {
    // Create a unique key from vendor name, price, and currency
    const key = vendor.npcName + '|' + vendor.price + '|' + vendor.currency;
    
    if (!seen[key]) {
      seen[key] = true;
      uniqueVendors.push(vendor);
    }
  });
  
  return uniqueVendors.map(function(vendor) {
    return vendor.npcName + ' - ' + vendor.price + ' ' + vendor.currency + ' (' + vendor.location + ')';
  }).join('; ');
}

/**
 * Gets reduction source information for an item from Garland Tools data
 * Items can be obtained by reducing other items (aetherial reduction)
 * @param {Object} garlandData - Garland Tools data
 * @return {Array<Object>} Array of reduction source objects with item names
 */
function getReductionSources(garlandData) {
  const sources = [];
  
  try {
    if (!garlandData || !garlandData.item) {
      return sources;
    }
    
    const item = garlandData.item;
    const partials = garlandData.partials || [];
    
    // Get reduction source item IDs
    const reducedFrom = item.reducedFrom || [];
    
    if (reducedFrom.length === 0) {
      return sources;
    }
    
    // Extract item names from partials
    reducedFrom.forEach(function(itemId) {
      const itemPartial = partials.find(function(p) {
        return p.type === 'item' && p.id === String(itemId);
      });
      
      if (itemPartial && itemPartial.obj) {
        sources.push({
          itemId: itemId,
          itemName: itemPartial.obj.n || 'Item #' + itemId
        });
      } else {
        // Item ID exists but no partial details
        sources.push({
          itemId: itemId,
          itemName: 'Item #' + itemId
        });
      }
    });
  } catch (error) {
    logWithTimestamp('Error getting reduction sources: ' + error.toString());
  }
  
  return sources;
}

/**
 * Formats reduction sources for display
 * @param {Array<Object>} sources - Array of reduction source objects
 * @return {string} Formatted string of reduction sources
 */
function formatReductionSources(sources) {
  if (!sources || sources.length === 0) {
    return 'Not available';
  }
  
  return sources.map(function(source) {
    return source.itemName;
  }).join(', ');
}

