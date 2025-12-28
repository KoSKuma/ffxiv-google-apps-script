# Getting Started Guide

This guide will walk you through using Google Apps Script with local development (GitHub/clasp) instead of writing directly in the Apps Script editor.

## Why Use Local Development?

- ✅ Use your favorite code editor (VS Code, Cursor, etc.)
- ✅ Version control with Git
- ✅ Better code organization
- ✅ Easier collaboration
- ✅ Access to modern development tools

## Step-by-Step Setup

### 1. Install clasp

```bash
npm install -g @google/clasp
```

### 2. Login to Google

```bash
clasp login
```

This will open your browser to authorize clasp. After authorization, you'll see "Authorization successful."

### 3. Create Your Apps Script Project

**Important**: `clasp create --type sheets` creates **BOTH** a Google Spreadsheet **AND** an Apps Script project bound to it. This is called a "container-bound script."

You have two options:

#### Option A: Create New Project from Local Files (Recommended)

1. Make sure you have your `.gs` files ready (Code.gs, Utils.gs, etc.)
2. Run:
   ```bash
   clasp create --type sheets --title "FFXIV Google Apps Script"
   ```
3. This will:
   - ✅ Create a new **Google Spreadsheet** (automatically created!)
   - ✅ Create a new **Apps Script project** bound to that spreadsheet
   - ✅ Create a `.clasp.json` file with your Script ID
   - ✅ Link your local files to the project

4. **Find your new spreadsheet:**
   - The spreadsheet is automatically created and bound to your script
   - You can find it in your [Google Drive](https://drive.google.com)
   - Or run `clasp open-script-script` to open the Apps Script editor, then click "Open Spreadsheet" in the menu
   - The spreadsheet name will be the same as your project title

#### Option B: Create Spreadsheet First, Then Clone Script (Alternative)

1. **Create a Google Spreadsheet first:**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Name it (e.g., "FFXIV Data")

2. **Create Apps Script in the spreadsheet:**
   - In your spreadsheet, go to `Extensions` → `Apps Script`
   - This creates a new Apps Script project bound to your spreadsheet
   - Copy the Script ID from the URL: `https://script.google.com/home/projects/[SCRIPT_ID]/edit`

3. **Clone the project locally:**
   ```bash
   clasp clone [SCRIPT_ID]
   ```
   - This downloads the Apps Script project to your local folder
   - The script is already bound to your spreadsheet

### 4. Push Your Code to Apps Script

After making changes locally:

```bash
clasp push
```

This uploads all your `.gs` files to Apps Script.

### 5. Test in Google Sheets

1. Open your Google Sheet (the one bound to your script)
2. Refresh the page (F5 or Cmd+R)
3. You should see your custom menu "FFXIV Tools" in the menu bar (if you have `onOpen()` function)
4. Try the menu items or run functions from the Apps Script editor

### 6. Pull Changes (if you edit in Apps Script editor)

If you make changes directly in the Apps Script editor:

```bash
clasp pull
```

**Note**: It's recommended to always edit locally and push, rather than editing in Apps Script editor.

## Development Workflow

### Typical Workflow

1. **Edit locally** in your code editor
   ```bash
   # Edit Code.gs, Utils.gs, etc. in your editor
   ```

2. **Push to Apps Script**
   ```bash
   clasp push
   ```

3. **Test in Google Sheets**
   - Open your Google Sheet
   - Use the menu or run functions
   - Check execution logs if needed

4. **View logs** (if you need to debug)
   ```bash
   clasp logs
   ```

5. **Commit to Git** (when ready)
   ```bash
   git add .
   git commit -m "Add new feature"
   git push
   ```

## Understanding the Relationship

### Three Separate Things

1. **Google Spreadsheet** (the actual sheet with cells)
   - Created automatically when using `clasp create --type sheets`
   - Or created manually at [sheets.google.com](https://sheets.google.com)
   - This is where your data lives
   - Users interact with this

2. **Apps Script Project** (the code/script)
   - Created via `clasp create --type sheets` (bound to spreadsheet)
   - Or created in Apps Script editor
   - Contains your `.gs` files (Code.gs, Utils.gs, etc.)
   - When using `--type sheets`, it's automatically bound to the spreadsheet

3. **Local Files** (on your computer)
   - Your `.gs` files in this project folder
   - Synced with Apps Script project via `clasp push/pull`
   - Version controlled with Git

### How They Connect

When using `clasp create --type sheets`:
```
Local Files (Code.gs) 
    ↕ clasp push/pull
Apps Script Project (Google Cloud)
    ↕ automatically bound to
Google Spreadsheet (created together)
```

**Note**: The spreadsheet and script are created together and automatically linked when using `--type sheets`.

### Understanding the Files

#### Local Files (Your Computer)
- `Code.gs` - Your script files
- `.clasp.json` - Links local files to Apps Script project (DO NOT commit this)
- `.gitignore` - Already configured to ignore `.clasp.json`

#### Apps Script Project (Google Cloud)
- Same `.gs` files, but stored in Google's servers
- Accessible via Apps Script editor
- Can be bound to one or more spreadsheets
- Runs when triggered in Google Sheets

#### Google Spreadsheet
- The actual spreadsheet with cells and data
- Bound to your Apps Script project
- Where your script functions run

## Simple Example Workflow

Let's say you want to add a function that adds "Hello World" to cell A1:

1. **Edit `Code.gs` locally:**
   ```javascript
   function addHelloWorld() {
     const sheet = SpreadsheetApp.getActiveSheet();
     sheet.getRange('A1').setValue('Hello World!');
   }
   ```

2. **Push to Apps Script:**
   ```bash
   clasp push
   ```

3. **Test in Google Sheets:**
   - Open your sheet
   - Go to Extensions > Apps Script
   - Run `addHelloWorld` function
   - Check cell A1 in your sheet

## Common Commands

```bash
# Push local changes to Apps Script
clasp push

# Pull changes from Apps Script to local
clasp pull

# Open project in Apps Script editor (browser)
clasp open-script

# View execution logs
clasp logs

# List all files in the project
clasp list

# Deploy as web app (advanced)
clasp deploy
```

## Troubleshooting

### "No .clasp.json found"
- Run `clasp create` or `clasp clone` first
- Make sure you're in the project directory

### "Permission denied"
- Run `clasp login` again
- Make sure you have access to the Apps Script project

### Changes not appearing in Sheets
- Make sure you ran `clasp push`
- Refresh your Google Sheet
- Check if the function is being called correctly

### Can't find Script ID
- Open Apps Script editor
- Script ID is in the URL: `https://script.google.com/home/projects/[SCRIPT_ID]/edit`
- Or run `clasp open-script` to see the URL

### Library Permission Issues
- **"You do not have permission to call the service"**
  - Solution: Share the Apps Script project with the user (Share button in Apps Script editor)
  - Set permission to "Viewer" (not Editor)
  
- **"Script function not found"**
  - Solution: Make sure functions are public (not starting with `_`)
  - Solution: Use correct syntax: `LibraryName.functionName()` (check the identifier in Libraries panel)
  - Solution: Make sure you've authorized the library (first-time use requires authorization)
  
- **"Cannot access internal utilities/config"**
  - This is expected! Utilities (`Utils.gs`) and config (`Config.gs`) are internal
  - Use the public functions in `Code.gs` instead - they use utilities and config automatically
  - Example: Instead of `LibraryName.CONFIG`, use `LibraryName.lookupItemInfo()` which uses config internally

## Using Your Script with Other Spreadsheets

**Yes, you can use your Apps Script with other spreadsheets!** Here are your options:

### Option 1: Access Other Spreadsheets by ID or URL

Even though your script is bound to one spreadsheet, you can open and work with other spreadsheets:

```javascript
// Open a spreadsheet by ID
function workWithAnotherSheet() {
  const otherSpreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
  const otherSpreadsheet = SpreadsheetApp.openById(otherSpreadsheetId);
  const sheet = otherSpreadsheet.getActiveSheet();
  
  // Now you can work with this other spreadsheet
  sheet.getRange('A1').setValue('Hello from another sheet!');
}

// Or open by URL
function workWithSheetByUrl() {
  const url = 'https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit';
  const otherSpreadsheet = SpreadsheetApp.openByUrl(url);
  const sheet = otherSpreadsheet.getActiveSheet();
  
  sheet.getRange('A1').setValue('Hello!');
}
```

**Important Notes:**
- `SpreadsheetApp.getActiveSpreadsheet()` always refers to the **bound spreadsheet**
- `onOpen()` trigger only runs in the **bound spreadsheet**
- To work with other spreadsheets, use `openById()` or `openByUrl()`
- You need appropriate permissions to access other spreadsheets

### Option 2: Deploy as a Library

You can deploy your script as a library and use it in multiple spreadsheets. The project uses a **library-friendly architecture** where high-level functions are exposed while utilities and config remain internal.

#### Deploying the Library

1. **Share the Apps Script project:**
   - Open your Apps Script project (`clasp open-script`)
   - Click the **Share** button (top right)
   - Add the email addresses of users who will use the library
   - Set permission to **Viewer** (they don't need Editor access)
   - Click **Send**

2. **Deploy as Library:**
   - In Apps Script editor, go to `Deploy` → `New deployment`
   - Click the gear icon (⚙️) next to "Select type"
   - Select **Library** as the type
   - Set description (optional)
   - Choose version: **New version** (or specific version)
   - Click **Deploy**
   - **Copy the Script ID** shown (you'll need this)

3. **Add Library to Target Spreadsheet:**
   - Open the spreadsheet where you want to use the library
   - Go to `Extensions` → `Apps Script`
   - Click the **+ (Libraries)** icon on the left sidebar
   - Paste the Script ID from step 2
   - Click **Look up**
   - Select version (usually **Head** for latest)
   - Set identifier (e.g., `FFXIVTools`) - this is how you'll call it
   - Click **Add**

4. **Authorize the Library:**
   - When you first use the library, you'll be prompted to authorize
   - Click **Review permissions**
   - Select your Google account
   - Click **Advanced** → **Go to [Your Project Name] (unsafe)** if shown
   - Click **Allow**

#### Using the Library

The library exposes **high-level public functions** from `Code.gs`. Internal utilities (`Utils.gs`) and configuration (`Config.gs`) are used automatically and are not directly accessible.

**Available Public Functions:**
- `lookupItemInfo(itemName)` - Looks up FFXIV item information (gathering, vendors, prices)
- `processItemList(sheetName, itemColumn, startRow)` - Processes a list of items from spreadsheet

**Example Usage:**

```javascript
// In the target spreadsheet's Apps Script editor

// Lookup single item
function lookupItem() {
  // Replace 'FFXIVTools' with your library identifier
  const itemInfo = FFXIVTools.lookupItemInfo('Iron Ore');
  Logger.log('Item: ' + itemInfo.itemName);
  Logger.log('Price: ' + itemInfo.priceSummary);
}

// Process item list from spreadsheet
function processItems() {
  FFXIVTools.processItemList(null, 'A', 2);
}

// Create menu that uses library
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FFXIV Tools')
    .addItem('Lookup Item Info', 'lookupItem')
    .addItem('Process Item List', 'processItems')
    .addToUi();
}
```

#### Copy-Paste Template for New Spreadsheets

A complete, ready-to-use code template is available in **[LIBRARY_TEMPLATE.gs](LIBRARY_TEMPLATE.gs)**.

**Note:** `LIBRARY_TEMPLATE.gs` is excluded from `clasp push` (via `.claspignore`) to prevent conflicts with `Code.gs`'s `onOpen()` function. This file is kept in the repository for reference only - library users copy its contents into their own spreadsheets.

**Quick Setup:**

1. **Add the library** (see steps above in "Deploy as a Library" section)

2. **Copy the template:**
   - Open `LIBRARY_TEMPLATE.gs` in this repository
   - Copy all the code

3. **Paste into your spreadsheet's Apps Script editor:**
   - Open your target spreadsheet
   - Go to `Extensions` → `Apps Script`
   - Paste the code
   - Replace `FFXIVTools` with your actual library identifier (found in Libraries panel)
   - Customize spreadsheet IDs, sheet names, and ranges as needed
   - Save (Ctrl+S or Cmd+S)

4. **Refresh your spreadsheet** - the menu will appear automatically!

**Customization Tips:**
- Change `LIBRARY_NAME` or replace `FFXIVTools` with your actual library identifier
- Modify menu items by editing the `.addItem()` calls
- Customize spreadsheet IDs, sheet names, and ranges in the functions
- Add or remove menu items as needed
- The menu appears automatically when you open the spreadsheet

**Important Notes:**
- ✅ **Public functions** in `Code.gs` are accessible: `LibraryName.functionName()`
- ❌ **Internal utilities** (`Utils.gs`) are NOT accessible directly
- ❌ **Configuration** (`Config.gs`) is NOT accessible directly
- ✅ Public functions use utilities and config **automatically** internally
- ✅ All functions are self-contained and handle everything internally
- ✅ Functions work with any spreadsheet (not just the bound one)

**Library Architecture:**
```
Public API (Code.gs)
  ↓ uses internally
Internal Utilities (Utils.gs)
  ↓ uses internally  
Internal Config (Config.gs)
```

This means library users only need to call high-level functions - all the complexity is handled internally!

### Option 3: Create a Standalone Script

If you want a script that's not bound to any spreadsheet:

```bash
clasp create --type standalone --title "My Standalone Script"
```

Then use `openById()` or `openByUrl()` to access any spreadsheet you need.

### Summary

| Method | Bound Spreadsheet | Other Spreadsheets |
|--------|------------------|-------------------|
| `getActiveSpreadsheet()` | ✅ Works | ❌ Only works in bound sheet |
| `openById()` / `openByUrl()` | ✅ Works | ✅ Works (with permissions) |
| `onOpen()` trigger | ✅ Works | ❌ Only works in bound sheet |
| Deploy as Library | ✅ Works | ✅ Works in all sheets using it |

**Recommendation**: 
- **For library distribution**: Use Option 2 (Deploy as Library) - best for sharing functionality across multiple spreadsheets
- **For single script with multiple sheets**: Use Option 1 (`openById()`/`openByUrl()`) - simpler for one script accessing multiple sheets

## Best Practices

1. **Always edit locally** - Don't edit in Apps Script editor if possible
2. **Push before testing** - Always `clasp push` before testing
3. **Pull if you must edit online** - If you edit in Apps Script editor, `clasp pull` immediately
4. **Commit regularly** - Use Git to track your changes
5. **Test thoroughly** - Test in Google Sheets after each push
6. **Store spreadsheet IDs in Config.gs** - If working with multiple sheets, keep IDs in your config
7. **Library design**: Keep public functions high-level and self-contained - they should use internal utilities and config automatically
8. **Document public API**: All functions in `Code.gs` are public - document them clearly for library users

## Understanding the Library Architecture

This project uses a **library-friendly architecture** (Option 4 - Hybrid Approach):

### Public API (Code.gs)
- All functions in `Code.gs` are **public** and exposed when used as a library
- Functions are high-level and self-contained
- Users call: `LibraryName.functionName()`
- Functions automatically use internal utilities and config

### Internal Utilities (Utils.gs)
- Utility functions are **internal** and not directly accessible
- Used by public functions automatically
- Library users don't need to access these directly

### Internal Config (Config.gs)
- Configuration constants are **internal** and not directly accessible
- Used by public functions automatically
- Public functions use config values automatically

### Example Flow
```javascript
// Library user calls:
FFXIVTools.lookupItemInfo('Iron Ore');

// Internally, the function:
// 1. Uses searchItemByName() (from FFXIVAPI.gs)
// 2. Calls getItemDetails() (from FFXIVAPI.gs)
// 3. Calls getGatheringLocations() (from FFXIVAPI.gs)
// 4. Calls getVendorInfo() (from FFXIVAPI.gs)
// 5. Returns structured item information
```

This architecture means:
- ✅ Library users get simple, high-level functions
- ✅ Internal complexity is hidden
- ✅ Utilities and config are automatically used
- ✅ Easy to maintain and extend

## Next Steps

- Check out the example functions in `Code.gs` - all are public API
- Read `DEVELOPMENT.md` for more advanced workflows
- See `ARCHITECTURE.md` for detailed project structure and library design patterns
- Review `API.md` for complete function documentation

