# Google Sheets Formulas & Commands Reference

This document contains useful Google Sheets formulas, functions, and commands that complement the Apps Script functionality. Add formulas here as you discover and use them.

## Table of Contents

### Material List Operations
- [Get Unique Material Names (De-duplicated)](#get-unique-material-names-de-duplicated)
- [Sum Material Quantities by Item Name](#sum-material-quantities-by-item-name)
- [Calculate Additional Materials Needed (Shortage)](#calculate-additional-materials-needed-shortage)

### Status Sheet
- [Count of Unique Materials Needed](#count-of-unique-materials-needed)
- [Check for Duplicates in Request for Material](#check-for-duplicates-in-request-for-material)
- [Check for Missing Materials](#check-for-missing-materials)
- [List Missing Materials](#list-missing-materials)

---

## Material List Operations

### Get Unique Material Names (De-duplicated)

Get all unique material names from "Requested for Crafting" sheet, column C, starting at row 2.

**Formula:**
```excel
=UNIQUE(FILTER('Requested for Crafting'!C2:C, 'Requested for Crafting'!C2:C<>""))
```

**Explanation:**
- `FILTER('Requested for Crafting'!C2:C, 'Requested for Crafting'!C2:C<>"")` - Filters out empty cells from column C
- `UNIQUE(...)` - Returns only unique values, removing duplicates
- Each unique material name appears as one row

**Usage:**
- Place this formula in a cell (e.g., in a "Material Summary" sheet)
- The formula will automatically expand to show all unique materials
- Updates automatically when source data changes

**Alternative (if you want to include empty cells in the filter):**
```excel
=UNIQUE('Requested for Crafting'!C2:C)
```

**Note:** If you're using this in a different sheet, make sure the sheet name matches exactly (case-sensitive).

### Sum Material Quantities by Item Name

Sum the total quantity needed for each material by matching material names from "Requested for Crafting" sheet.

**Formula (place in column B, starting at B2):**
```excel
=IF(A2="", "", SUMIF('Requested for Crafting'!C2:C, A2, 'Requested for Crafting'!D2:D))
```

**Apply to entire column (place in B2, will auto-fill down):**
```excel
=ARRAYFORMULA(IF(A2:A="", "", SUMIF('Requested for Crafting'!C2:C, A2:A, 'Requested for Crafting'!D2:D)))
```

**Explanation:**
- `IF(A2="", "", ...)` - Checks if A2 is blank; if blank, returns blank, otherwise runs the SUMIF
- `'Requested for Crafting'!C2:C` - Range to check for material names (column C, starting at row 2)
- `A2` - The material name to match (from current sheet, column A)
- `'Requested for Crafting'!D2:D` - Range to sum quantities from (column D, starting at row 2)
- Returns blank if A2 is empty, otherwise returns the sum of all quantities in column D where the corresponding material name in column C matches A2

**Usage:**
- **Single cell version:** Place in B2 and copy down for all rows
- **Array formula version:** Place in B2 only - it will automatically apply to all rows in column B
  - The ARRAYFORMULA version calculates for all rows at once
  - No need to copy the formula down
  - Automatically expands as you add more rows to column A

**Both versions will:**
- Show blank if column A is empty
- Sum all quantities for each material from "Requested for Crafting" sheet when column A has a value

**Example:**
- "Request for Material" sheet:
  - A2: "Iron Ore"
  - B2: `=SUMIF('Requested for Crafting'!C2:C, A2, 'Requested for Crafting'!D2:D)`
  - Result: Sum of all quantities in column D where column C contains "Iron Ore"

**Note:** This formula handles multiple occurrences of the same material name and sums all their quantities.

### Calculate Additional Materials Needed (Shortage)

Calculate how much more material is needed by subtracting available quantity (C) from needed quantity (B). Only calculates when column A (material name) is not empty.

**Formula (single cell version, place in column D, starting at D2):**
```excel
=IF(A2="", "", B2-C2)
```

**Array formula version (apply to entire column, place in D2 only):**
```excel
=ARRAYFORMULA(IF(A2:A="", "", B2:B-C2:C))
```

**Explanation:**
- `IF(A2="", "", ...)` - Checks if A2 is blank; if blank, returns blank, otherwise calculates B2-C2
- `B2-C2` - Subtracts value in column C from value in column B
- Array version applies to all rows automatically

**Usage:**
- **Single cell version:** Place in D2 and copy down for all rows
- **Array formula version:** Place in D2 only - it will automatically apply to all rows in column D
  - No need to copy the formula down
  - Automatically expands as you add more rows

**Example:**
- A2: "Iron Ore" (material name)
- B2: 100 (total needed quantity - from sum formula)
- C2: 50 (available quantity in inventory)
- D2: `=IF(A2="", "", B2-C2)` → Result: 50 (additional materials needed)

**Use case:**
- Column A: Material names
- Column B: Total quantity needed (from SUMIF formula)
- Column C: Quantity available in inventory
- Column D: Additional materials needed (shortage) = B - C

**Both versions will:**
- Show blank if column A is empty
- Calculate B - C when column A has a value


## Status Sheet

Formulas for the "Status" sheet that displays summary information about materials.

### Count of Unique Materials Needed

Display the total number of unique material names (not quantities) that still need to be obtained (where "Need More" column D is greater than 0).

**Formula (place in cell, e.g., B1):**
```excel
=IF(COUNTIF('Request for Material'!D2:D, ">0") = 0, 0, COUNTA(FILTER('Request for Material'!A2:A, ('Request for Material'!A2:A<>"") * ('Request for Material'!D2:D>0))))
```

**Explanation:**
- `COUNTIF('Request for Material'!D2:D, ">0")` - Counts how many materials have "Need More" (D) greater than 0
- `IF(..., 0, ...)` - If no materials need more (count = 0), returns 0; otherwise counts materials
- `FILTER('Request for Material'!A2:A, ...)` - Gets material names from column A that meet the conditions
- `('Request for Material'!A2:A<>"")` - Material name must not be empty
- `('Request for Material'!D2:D>0)` - "Need More" quantity (column D) must be greater than 0
- `*` - Both conditions must be true (AND logic)
- `COUNTA(...)` - Counts the number of materials (counts non-empty cells)
- **Note:** UNIQUE is not needed since column A is already guaranteed to have no duplicates

**Usage:**
- Place in a cell in the "Status" sheet (e.g., B1)
- Shows the total number of different materials that still need to be obtained (where shortage > 0)
- Updates automatically when "Request for Material" data changes
- Only counts materials where you still need more (column D > 0)
- Uses "Request for Material" sheet as the source (column A for names, column D for "Need More")

**Example:**
- If "Request for Material" has "Iron Ore" (D=50), "Copper Ore" (D=0), and "Silver Ore" (D=30), the result will be 2 (only "Iron Ore" and "Silver Ore" have D > 0)
- If all materials are fulfilled (all D = 0 or negative), the result will be 0 (not 1)

### Check for Duplicates in Request for Material

Check if there are any duplicate material names in "Request for Material" column A. Shows a status message indicating whether duplicates exist.

**Formula (place in cell, e.g., B2):**
```excel
=IF(COUNTA(FILTER('Request for Material'!A2:A, 'Request for Material'!A2:A<>"")) = COUNTA(UNIQUE(FILTER('Request for Material'!A2:A, 'Request for Material'!A2:A<>""))), "✓ No duplicates", "⚠ Duplicates found")
```

**Explanation:**
- `FILTER('Request for Material'!A2:A, 'Request for Material'!A2:A<>"")` - Gets all non-empty material names from column A
- `COUNTA(...)` - Counts total number of non-empty material names
- `UNIQUE(...)` - Gets unique material names (removes duplicates)
- `COUNTA(UNIQUE(...))` - Counts number of unique materials
- `IF(...)` - Compares total count with unique count
  - If equal: No duplicates → "✓ No duplicates"
  - If different: Duplicates exist → "⚠ Duplicates found"

**Usage:**
- Place in a cell in the "Status" sheet (e.g., B2)
- Shows "✓ No duplicates" if all material names are unique
- Shows "⚠ Duplicates found" if there are duplicate material names
- Updates automatically when "Request for Material" data changes

**Optional: List Duplicate Materials**

If you want to see which materials are duplicated, use this formula (place in cell, e.g., A4, will auto-expand down):
```excel
=IFERROR(UNIQUE(FILTER('Request for Material'!A2:A, 
  ('Request for Material'!A2:A<>"") * 
  (COUNTIF('Request for Material'!A2:A, 'Request for Material'!A2:A) > 1)
)), "✓ No duplicates")
```

**Explanation of duplicate list formula:**
- `COUNTIF('Request for Material'!A2:A, 'Request for Material'!A2:A)` - Counts occurrences of each material name
- `> 1` - Returns TRUE if material appears more than once (duplicate)
- `FILTER(...)` - Gets only materials that appear more than once
- `UNIQUE(...)` - Removes duplicate entries from the duplicate list itself
- `IFERROR(..., "✓ No duplicates")` - Shows friendly message if no duplicates found

**Example:**
- If "Request for Material" has "Iron Ore", "Copper Ore", "Iron Ore", "Silver Ore":
  - Status cell: "⚠ Duplicates found"
  - Duplicate list: "Iron Ore" (appears twice)

### Check for Missing Materials

Check if there are any materials from "Requested for Crafting" column C that are missing from "Request for Material" column A. Shows a status message indicating whether missing materials exist.

**Formula (place in cell, e.g., B3):**
```excel
=IF(IF(SUMPRODUCT(('Requested for Crafting'!C2:C<>"") * (ISERROR(MATCH('Requested for Crafting'!C2:C, 'Request for Material'!A2:A, 0)))) = 0, 0, COUNTA(UNIQUE(FILTER('Requested for Crafting'!C2:C, ('Requested for Crafting'!C2:C<>"") * (ISERROR(MATCH('Requested for Crafting'!C2:C, 'Request for Material'!A2:A, 0))))))) = 0, "✓ All materials are tracked", "⚠ Missing materials found")
```

**Explanation:**
- `SUMPRODUCT(('Requested for Crafting'!C2:C<>"") * (ISERROR(MATCH(...))))` - Counts how many materials are missing by checking each row
- `('Requested for Crafting'!C2:C<>"")` - Material name must not be empty
- `MATCH('Requested for Crafting'!C2:C, 'Request for Material'!A2:A, 0)` - Checks if material exists in "Request for Material" column A
- `ISERROR(...)` - Returns TRUE if material is NOT found (missing)
- `*` - Both conditions must be true (AND logic)
- `IF(SUMPRODUCT(...) = 0, 0, COUNTA(UNIQUE(FILTER(...))))` - If no missing materials (SUMPRODUCT = 0), returns 0; otherwise counts unique missing materials using FILTER
- `FILTER(...)` - Gets material names that are missing (only used when there are missing materials)
- `UNIQUE(...)` - Removes duplicates from the missing materials list
- `COUNTA(...)` - Counts the number of unique missing materials
- `IF(..., "✓ All materials are tracked", "⚠ Missing materials found")` - If count is 0, shows "✓ All materials are tracked"; otherwise shows "⚠ Missing materials found"

**Usage:**
- Place in a cell in the "Status" sheet (e.g., B3)
- Shows "✓ All materials are tracked" if all materials from "Requested for Crafting" are in "Request for Material"
- Shows "⚠ Missing materials found" if there are materials missing
- Updates automatically when data changes

**Example:**
- If all materials from "Requested for Crafting" are in "Request for Material": "✓ All materials are tracked"
- If "Iron Ore" is in "Requested for Crafting" but not in "Request for Material": "⚠ Missing materials found"

### List Missing Materials

Display a list of materials from "Requested for Crafting" column C that are missing from "Request for Material" column A. Shows a friendly message if everything is fine.

**Formula (place in cell, e.g., A3, will auto-expand down):**
```excel
=IFERROR(UNIQUE(FILTER('Requested for Crafting'!C2:C, 
  ('Requested for Crafting'!C2:C<>"") * 
  (ISERROR(MATCH('Requested for Crafting'!C2:C, 'Request for Material'!A2:A, 0)))
)), "✓ All materials are tracked")
```

**Explanation:**
- `IFERROR(..., "✓ All materials are tracked")` - Catches errors from FILTER (when no matches found) and displays friendly message
- If FILTER finds missing materials, shows the list
- If FILTER finds no matches (error), displays "✓ All materials are tracked"
- `'Requested for Crafting'!C2:C` - All material names from crafting requests
- `FILTER(..., 'Requested for Crafting'!C2:C<>"")` - Filters out empty cells
- `MATCH('Requested for Crafting'!C2:C, 'Request for Material'!A2:A, 0)` - Checks if material exists in "Request for Material" column A
- `ISERROR(...)` - Returns TRUE if material is NOT found (missing)
- `UNIQUE(...)` - Removes duplicates from the missing materials list

**Usage:**
- Place in a cell in the "Status" sheet (e.g., A3)
- The formula will automatically expand to show all missing materials, one per row
- Updates automatically when data changes
- Shows materials that need to be added to "Request for Material" sheet

**Example Status Sheet Layout:**
```
A1: "Total Materials Needed:"
B1: =COUNTA(UNIQUE(FILTER('Requested for Crafting'!C2:C, 'Requested for Crafting'!C2:C<>"")))
A2: "Missing Materials:"
A3: =UNIQUE(FILTER('Requested for Crafting'!C2:C, 
      ('Requested for Crafting'!C2:C<>"") * 
      (ISERROR(MATCH('Requested for Crafting'!C2:C, 'Request for Material'!A2:A, 0)))
    ))
```

**Note:** If no materials are missing, the formula will display "✓ All materials are tracked" instead of showing an error or empty result.

---

## Notes

- Add formulas and patterns as you discover them
- Keep examples practical and relevant to the FFXIV crafting workflow
- Include explanations of what each formula does
- Note any specific use cases or requirements

---

## Contributing

Add useful formulas and patterns as you discover them. Keep examples practical and relevant to the FFXIV crafting workflow.
