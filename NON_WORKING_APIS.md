# Non-Working APIs

This document tracks APIs that have been tested and confirmed to be non-functional. **Do not use these APIs** - they are documented here to prevent accidental reuse.

## XIVAPI v2 - Get Item Details

**Base URL:** `https://v2.xivapi.com/api`

**Endpoint:** `GET /item/{id}`

**Status:** ❌ Not Working

**Issue:** The endpoint returns error responses or is unavailable.

**Request Format:**
```
GET https://v2.xivapi.com/api/item/{itemId}?version=7.4
```

**Example Request:**
```bash
curl --location 'https://v2.xivapi.com/api/item/5111?version=7.4'
```

**Why It's Not Working:**
- Endpoint may not exist in v2 API
- Returns error codes or invalid responses
- Alternative: Use Garland Tools API instead (see `API_DOCUMENTATION.md`)

**Replacement:**
- Use **Garland Tools API** (`getItemDetails()` function) which provides the same information and more

**Date Removed:** 2024 (exact date when removed from active code)

**Notes:**
- The XIVAPI v2 search endpoint (`/search`) still works and is used for item name to ID conversion
- Only the `/item/{id}` endpoint is non-functional

---

## How to Use This Document

1. **Before implementing a new API:** Check this file to ensure it's not listed here
2. **If an API stops working:** Add it to this file with details about why it's not working
3. **When finding alternatives:** Document the replacement API in `API_DOCUMENTATION.md`

---

## References

- See `API_DOCUMENTATION.md` for working APIs
- See `FEATURE.md` for feature implementation details

