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
- `item.vendors` - Array of vendor/NPC IDs
- `item.drops` - Array of drop source IDs
- `item.ingredient_of` - Object mapping recipe IDs to quantities needed
- `item.leves` - Array of levequest IDs that reward this item

**Partials Array:**
- Contains detailed information for nodes and NPCs referenced in the item object
- `partials[].type` - Type: "node" or "npc"
- `partials[].id` - The ID referenced in item.nodes or item.vendors
- `partials[].obj` - Detailed object:
  - **For nodes:**
    - `n` - Node name (e.g., "Horizon's Edge")
    - `l` - Level requirement
    - `t` - Type (0 = Mining, 1 = Botany, etc.)
    - `z` - Zone ID
  - **For NPCs:**
    - `n` - NPC name (e.g., "Material Supplier")
    - `l` - Location level
    - `s` - Shop type
    - `t` - NPC type/title
    - `c` - Coordinates array [x, y]

**Advantages:**
- ✅ Includes gathering node IDs and details in `partials`
- ✅ Includes vendor IDs and details in `partials`
- ✅ Includes drop sources
- ✅ Shows crafting recipes that use the item
- ✅ Includes node names, levels, and zones directly
- ✅ Single API call provides comprehensive information

**Usage Notes:**
- Requires item ID (not name search) - use XIVAPI search first to get ID
- Node and vendor details are included in `partials` array
- Can be used as alternative or supplement to XIVAPI
- More detailed gathering/vendor information than XIVAPI

**Potential Use Cases:**
- Get gathering node information (name, level, zone)
- Get vendor/NPC information
- Get drop source information
- Get crafting recipe information
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

