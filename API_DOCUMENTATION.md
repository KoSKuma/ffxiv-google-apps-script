# API Documentation - External APIs Used

This document records the external APIs used in this project and their correct usage.

## API Overview Table

| API Name | Service | Status | Purpose | Base URL | Used In Code |
|----------|---------|--------|---------|----------|--------------|
| **XIVAPI v2** | Search Item by Name | ✅ Working | Convert item name to item ID | `https://v2.xivapi.com/api` | `searchItemByName()` in `FFXIVAPI.gs` |
| **Garland Tools** | Get Item Information | ✅ Working | Get detailed item info, gathering nodes, vendors | `https://www.garlandtools.org/db/doc/item` | `getItemDetails()` in `FFXIVAPI.gs` |
| **Universalis** | Market Board Prices | ⬜ Planned | Get market board prices for items | `https://universalis.app/api/v2` | Not yet implemented |

**Status Legend:**
- ✅ Working - Currently implemented and functional
- ⬜ Planned - Planned for future implementation

**Note:** Non-working APIs are documented in `NON_WORKING_APIS.md` to prevent accidental reuse.

## XIVAPI v2

**Base URL:** `https://v2.xivapi.com/api`

### Search Item by Name

**Endpoint:** `GET /search`

**Purpose:** Convert item name to item ID

**Request Format:**
```
GET https://v2.xivapi.com/api/search?version=7.4&query=Name%3D%22Iron%20Ore%22&sheets=Item
```

**Parameters:**
- `version` (required): Game version (e.g., "7.4")
- `query` (required): Search query in format `Name="Item Name"` (URL encoded)
- `sheets` (required): Sheet type, use "Item" for items

**Example Request:**
```bash
curl --location 'https://v2.xivapi.com/api/search?version=7.4&query=Name%3D%22Iron%20Ore%22&sheets=Item'
```

**Response Format:**
```json
{
    "schema": "exdschema@2:rev:...",
    "version": "...",
    "results": [
        {
            "score": 1.0,
            "sheet": "Item",
            "row_id": 5111,
            "fields": {
                "Icon": {
                    "id": 21202,
                    "path": "ui/icon/021000/021202.tex",
                    "path_hr1": "ui/icon/021000/021202_hr1.tex"
                },
                "Name": "Iron Ore",
                "Singular": "chunk of iron ore"
            }
        }
    ]
}
```

**Response Fields:**
- `results[].row_id` - The item ID (use this for further API calls)
- `results[].fields.Name` - The item name
- `results[].sheet` - Should be "Item"

**Usage in Code:**
- Function: `searchItemByName(itemName)` in `FFXIVAPI.gs`
- Returns: `{ ID: row_id, Name: itemName }`

---

## Notes

- **Version Parameter:** Always include `version=7.4` (or current game version) in requests
- **Query Format:** For search, use `Name="Item Name"` format, URL encoded
- **Rate Limiting:** Implement delays between requests (1 second recommended)
- **Error Handling:** Check for `code` field in responses for errors
- **Response Structure:** v2 API uses lowercase `results` (not `Results`)

---

## Garland Tools

**Base URL:** `https://www.garlandtools.org/db/doc/item`

**Status:** Alternative API option for item information

**Purpose:** Get detailed item information including gathering nodes and vendors

### Get Item Information

**Endpoint:** `GET /item/{language}/{version}/{itemId}.json`

**Request Format:**
```
GET https://www.garlandtools.org/db/doc/item/en/3/{itemId}.json
```

**Parameters:**
- `{language}` (path parameter): Language code (e.g., "en" for English)
- `{version}` (path parameter): Version number (e.g., "3")
- `{itemId}` (path parameter): The item ID

**Example Request:**
```bash
curl "https://www.garlandtools.org/db/doc/item/en/3/5111.json"
```

**Response Format:**
```json
{
    "item": {
        "name": "Iron Ore",
        "description": "A decent-sized piece of rock containing the metal iron.",
        "id": 5111,
        "patch": 1.0,
        "price": 18,
        "sell_price": 1,
        "ilvl": 13,
        "category": 48,
        "stackSize": 999,
        "icon": 21202,
        "nodes": [158],
        "vendors": [1000999, 1008837, ...],
        "tradeShops": [
            {
                "shop": "Orange Scrip Exchange",
                "npcs": [1052588],
                "listings": [
                    {
                        "item": [{"id": "44035", "amount": 1}],
                        "currency": [{"id": "41785", "amount": 100}]
                    }
                ]
            }
        ],
        "reducedFrom": [43933, 43931, ...],
        "craft": [
            {
                "id": 35990,
                "job": 15,
                "ingredients": [
                    {"id": 44347, "amount": 1},
                    {"id": 43976, "amount": 2}
                ]
            }
        ],
        "drops": [21270000001671, ...],
        "ingredient_of": {
            "5057": 3,
            "5058": 2
        },
        "leves": [159, 160, ...]
    },
    "partials": [
        {
            "type": "node",
            "id": "158",
            "obj": {
                "i": 158,
                "n": "Horizon's Edge",
                "l": 15,
                "t": 0,
                "z": 42
            }
        },
        {
            "type": "npc",
            "id": "1000999",
            "obj": {
                // NPC details
            }
        },
        {
            "type": "item",
            "id": "43933",
            "obj": {
                "i": 43933,
                "n": "Goldbranch",
                "l": 670,
                "c": 22416,
                "t": 54
            }
        }
    ]
}
```

**Response Fields:**

**Item Object:**
- `item.id` - Item ID
- `item.name` - Item name
- `item.description` - Item description
- `item.price` - Base price
- `item.sell_price` - NPC sell price
- `item.nodes` - Array of gathering node IDs
- `item.vendors` - Array of vendor/NPC IDs (for Gil purchases)
- `item.tradeShops` - Array of trade shop objects (for special currency purchases)
  - `tradeShops[].shop` - Shop name
  - `tradeShops[].npcs` - Array of NPC IDs
  - `tradeShops[].listings` - Array of listings with `item` and `currency` arrays
- `item.drops` - Array of drop source IDs
- `item.reducedFrom` - Array of item IDs that can be reduced to obtain this item (aetherial reduction)
- `item.craft` - Array of crafting recipes to craft this item
  - `craft[].id` - Recipe ID
  - `craft[].job` - Crafting job ID
  - `craft[].ingredients` - Array of ingredient objects with `id` and `amount`
- `item.ingredient_of` - Object mapping recipe IDs to quantities needed (recipes that USE this item as ingredient)
- `item.leves` - Array of levequest IDs that reward this item

**Partials Array:**
- Contains detailed information for nodes, NPCs, and items referenced in the item object
- `partials[].type` - Type: "node", "npc", or "item"
- `partials[].id` - The ID referenced in item.nodes, item.vendors, item.reducedFrom, or craft ingredients
- `partials[].obj` - Detailed object:
  - **For nodes (`type: "node"`):**
    - `i` - Node ID
    - `n` - Node name (e.g., "Horizon's Edge")
    - `l` - Level requirement
    - `t` - Type (0 = Mining, 1 = Botany, etc.)
    - `z` - Zone ID
  - **For NPCs (`type: "npc"`):**
    - `i` - NPC ID
    - `n` - NPC name (e.g., "Material Supplier")
    - `l` - Location level
    - `s` - Shop type
    - `t` - NPC type/title
    - `c` - Coordinates array [x, y]
  - **For items (`type: "item"`):**
    - `i` - Item ID
    - `n` - Item name
    - `l` - Item level
    - `c` - Icon ID
    - `t` - Category ID

**Advantages:**
- ✅ Includes gathering node IDs and details in `partials`
- ✅ Includes vendor IDs and details in `partials` (both Gil and special currency)
- ✅ Includes trade shops for special currency purchases
- ✅ Includes aetherial reduction sources (`reducedFrom`)
- ✅ Includes crafting recipes (`craft`) with ingredients
- ✅ Includes drop sources
- ✅ Shows crafting recipes that use the item (`ingredient_of`)
- ✅ Includes node names, levels, and zones directly
- ✅ Single API call provides comprehensive information

**Usage Notes:**
- Requires item ID (not name search) - use XIVAPI search first to get ID
- Node, vendor, and item details are included in `partials` array
- `item.vendors` contains NPC IDs for Gil purchases
- `item.tradeShops` contains special currency purchase information
- `item.reducedFrom` contains item IDs that can be reduced to obtain this item
- `item.craft` contains recipes to craft this item (use `craft[0].ingredients` for ingredients)
- `item.ingredient_of` contains recipes that use this item as an ingredient (reverse relationship)
- Can be used as alternative or supplement to XIVAPI
- More detailed gathering/vendor information than XIVAPI

**Potential Use Cases:**
- Get gathering node information (name, level, zone)
- Get vendor/NPC information (both Gil and special currency)
- Get aetherial reduction sources
- Get crafting recipe information (both recipes to craft item and recipes that use item)
- Get drop source information
- Alternative source when XIVAPI is unavailable

**Example Workflow:**
1. Use XIVAPI to search item name → get item ID
2. Use Garland Tools with item ID → get detailed gathering/vendor info
3. Combine information for complete item data

---

## Future APIs

### Universalis (Market Board Prices)

**Base URL:** `https://universalis.app/api/v2`

**Status:** Planned for future implementation

**Purpose:** Get market board prices for items

**Documentation:** https://universalis.app/docs

---

## References

- [XIVAPI v2 Documentation](https://v2.xivapi.com/api/docs)
- [XIVAPI GitHub](https://github.com/xivapi/xivapi-php)
- [Garland Tools](https://www.garlandtools.org/)

