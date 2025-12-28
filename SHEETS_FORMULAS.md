# Google Sheets Formulas & Commands Reference

This document contains useful Google Sheets formulas, functions, and commands that complement the Apps Script functionality. Add formulas here as you discover and use them.

## Table of Contents

- [Material List Operations](#material-list-operations)
- [Status Sheet](#status-sheet)

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

Display the total number of unique material names (not quantities) that are needed.

**Formula (place in cell, e.g., B1):**
```excel
=COUNTA(UNIQUE(FILTER('Requested for Crafting'!C2:C, 'Requested for Crafting'!C2:C<>"")))
```

**Explanation:**
- `FILTER('Requested for Crafting'!C2:C, 'Requested for Crafting'!C2:C<>"")` - Gets all non-empty material names from column C
- `UNIQUE(...)` - Removes duplicates to get unique material names
- `COUNTA(...)` - Counts the number of unique materials (counts non-empty cells)

**Usage:**
- Place in a cell in the "Status" sheet (e.g., B1)
- Shows the total number of different materials needed
- Updates automatically when "Requested for Crafting" data changes

**Example:**
- If you need "Iron Ore", "Copper Ore", and "Iron Ore" (duplicate), the result will be 2 (two unique materials)

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
