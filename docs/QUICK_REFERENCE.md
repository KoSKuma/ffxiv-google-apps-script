# Quick Reference Guide

## Essential Commands

```bash
# First time setup
npm install -g @google/clasp
clasp login
clasp create --type sheets --title "Your Project Name"

# Daily workflow
clasp push          # Upload local changes to Apps Script
clasp pull          # Download changes from Apps Script
clasp open-script   # Open in Apps Script editor (browser)
clasp open-container # Open container-bound script (browser)
clasp logs          # View execution logs
```

## Workflow Diagram

```
┌─────────────────┐
│  Edit Locally   │  ← Use your code editor (VS Code, Cursor, etc.)
│  (Code.gs, etc) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   clasp push    │  ← Upload to Google
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Test in Sheets │  ← Run functions in Google Sheets
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Commit to Git  │  ← Save to version control
└─────────────────┘
```

## File Locations

- **Local files**: Your computer (in this project folder)
- **Apps Script files**: Google Cloud (accessed via `clasp open-script` or browser)
- **`.clasp.json`**: Links local ↔ Apps Script (DO NOT commit to Git)

## Testing Your Script

1. **Push your code:**
   ```bash
   clasp push
   ```

2. **Open your Google Sheet**

3. **Look for custom menu** (if you have `onOpen()` function)
   - Should appear as "FFXIV Tools" in the menu bar

4. **Or run manually:**
   - Extensions → Apps Script → Select function → Run

5. **Check logs:**
   ```bash
   clasp logs
   ```

## Example: Adding a New Function

1. **Edit `Code.gs` locally:**
   ```javascript
   function myNewFunction() {
     const sheet = SpreadsheetApp.getActiveSheet();
     sheet.getRange('A1').setValue('Hello!');
   }
   ```

2. **Push to Apps Script:**
   ```bash
   clasp push
   ```

3. **Test in Google Sheets:**
   - Run the function from Apps Script editor or add to menu

## Common Issues

| Problem | Solution |
|---------|----------|
| "No .clasp.json found" | Run `clasp create` or `clasp clone` |
| Changes not appearing | Run `clasp push` and refresh sheet |
| Permission denied | Run `clasp login` again |
| Can't find Script ID | Run `clasp open-script` to see URL |

## Key Differences from Direct Editing

| Direct Editing (Old Way) | Local Development (New Way) |
|---------------------------|---------------------------|
| Edit in browser | Edit in code editor |
| No version control | Git version control |
| Limited tools | Full IDE features |
| Manual copy/paste | Automated sync with `clasp` |

## Next Steps

1. Read **[GETTING_STARTED.md](GETTING_STARTED.md)** for detailed instructions
2. Try the example functions in `Code.gs`
3. Check **[DEVELOPMENT.md](DEVELOPMENT.md)** for advanced workflows

