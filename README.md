# FFXIV Google Apps Script Project

Google Apps Script project for Google Sheets automation and functionality.

## Setup

### Prerequisites
- Node.js and npm installed
- Google account with access to Google Sheets
- Google Apps Script API enabled in your Google Cloud Console

### Initial Setup

1. **Install clasp (Command Line Apps Script Projects)**
   ```bash
   npm install -g @google/clasp
   ```

2. **Login to Google**
   ```bash
   clasp login
   ```

3. **Create a new Apps Script project**
   - Option A: Create in Google Sheets UI and clone
     ```bash
     clasp clone <scriptId>
     ```
   - Option B: Create from local files
     ```bash
     clasp create --type sheets --title "FFXIV Google Apps Script"
     ```

4. **Push your code to Apps Script**
   ```bash
   clasp push
   ```

5. **Open in Apps Script editor**
   ```bash
   clasp open-script
   # or
   clasp open-container
   ```

## Project Structure

```
.
├── appsscript.json      # Apps Script manifest
├── .clasp.json         # clasp configuration (gitignored)
├── Code.gs             # Main entry point (public API)
├── Utils.gs            # Internal utility functions
├── Config.gs           # Internal configuration constants
├── FFXIVAPI.gs         # Internal FFXIV API integration
├── Test.gs             # Test functions (safe to keep)
├── LIBRARY_TEMPLATE.gs # Copy-paste template for library users (excluded from push)
├── .claspignore        # Files excluded from clasp push
├── README.md           # This file
├── GETTING_STARTED.md  # Step-by-step guide for beginners
├── FEATURE.md          # Feature documentation and tracking
├── API_DOCUMENTATION.md # External API documentation (XIVAPI, etc.)
├── NON_WORKING_APIS.md  # Non-functional APIs to avoid
├── TODO.md             # Task tracking and roadmap
├── ARCHITECTURE.md     # Project architecture
├── DEVELOPMENT.md      # Development guide
├── API.md              # Internal API documentation
├── CONTRIBUTING.md     # Contributing guidelines
└── PROMPTS.md          # AI development prompts
```

## Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - ⭐ **Start here!** Step-by-step guide for using clasp with local development
- **[FEATURE.md](FEATURE.md)** - Feature documentation - what's available and how features work
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - External API documentation (XIVAPI endpoints and usage)
- **[NON_WORKING_APIS.md](NON_WORKING_APIS.md)** - Non-functional APIs to avoid (prevents accidental reuse)
- **[TODO.md](TODO.md)** - Task tracking, roadmap, and progress
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Project architecture and design patterns
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development workflow and best practices
- **[API.md](API.md)** - Internal API reference for all functions
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Code style and contribution guidelines
- **[PROMPTS.md](PROMPTS.md)** - Context and prompts for AI-assisted development

## Development Workflow

1. **Edit files locally** in your preferred editor
2. **Push changes** to Apps Script:
   ```bash
   clasp push
   ```
3. **Test in Apps Script editor** or directly in Google Sheets
4. **Pull changes** if made in Apps Script editor:
   ```bash
   clasp pull
   ```

## Useful Commands

- `clasp push` - Push local changes to Apps Script
- `clasp pull` - Pull changes from Apps Script
- `clasp open-script` or `clasp open-container` - Open project in Apps Script editor
- `clasp logs` - View execution logs
- `clasp deploy` - Deploy as web app or add-on
- `clasp versions` - List versions
- `clasp version` - Create a new version

## File Naming

- Use `.gs` extension for Google Apps Script files
- Use `.html` extension for HTML dialog/sidebar files
- Use descriptive names that reflect file purpose

## Best Practices

- Keep functions focused and single-purpose
- Use JSDoc comments for documentation
- Handle errors appropriately
- Cache frequently accessed data
- Use batch operations for better performance
- Test thoroughly before deployment

## Resources

- [Apps Script Documentation](https://developers.google.com/apps-script)
- [clasp Documentation](https://github.com/google/clasp)
- [Apps Script Best Practices](https://developers.google.com/apps-script/guides/support/best-practices)

