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
   - Or run `clasp open` to open the Apps Script editor, then click "Open Spreadsheet" in the menu
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
clasp open

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
- Or run `clasp open` to see the URL

## Best Practices

1. **Always edit locally** - Don't edit in Apps Script editor if possible
2. **Push before testing** - Always `clasp push` before testing
3. **Pull if you must edit online** - If you edit in Apps Script editor, `clasp pull` immediately
4. **Commit regularly** - Use Git to track your changes
5. **Test thoroughly** - Test in Google Sheets after each push

## Next Steps

- Check out the example in `Code.gs` for a simple working script
- Read `DEVELOPMENT.md` for more advanced workflows
- See `ARCHITECTURE.md` for project structure
- Review `API.md` for function documentation

