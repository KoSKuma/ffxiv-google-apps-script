# TODO / Project Roadmap

This file tracks tasks, features, and improvements for the FFXIV Google Apps Script project.

## Status Legend
- ⬜ Not Started
- 🟡 In Progress
- ✅ Completed
- ❌ Cancelled/Deferred

---

## Current Sprint / Active Tasks

### Setup & Configuration
- ⬜ Set up `.clasp.json` with your Script ID
- ⬜ Configure `appsscript.json` timezone if needed
- ⬜ Test initial push to Apps Script
- ⬜ Verify menu appears in Google Sheets

---

## Planned Features

### Core Functionality
- ⬜ [Feature Name] - Description of what this feature does
  - Subtask 1
  - Subtask 2

### Data Processing
- ⬜ [Feature Name] - Description

### UI/UX Improvements
- ⬜ [Feature Name] - Description

---

## Technical Debt / Improvements

### Code Quality
- ⬜ Add more utility functions as needed
- ⬜ Optimize existing functions for performance
- ⬜ Add comprehensive error handling

### Documentation
- ⬜ Keep documentation up to date
- ⬜ Add more examples to API.md
- ⬜ Create user guide if needed

### Testing
- ⬜ Create test functions for critical logic
- ⬜ Test with large datasets
- ⬜ Test error scenarios

---

## Future Ideas / Backlog

- [Idea 1] - Description
- [Idea 2] - Description
- [Idea 3] - Description

---

## Completed Tasks

### 2025-12-28
- ✅ **Project Initialization**
  - Set up project structure with `.cursorrules`, documentation files, and basic code files
  - Configured `.gitignore`, `package.json`, and `clasp` integration
  - Created comprehensive documentation (ARCHITECTURE.md, DEVELOPMENT.md, API.md, CONTRIBUTING.md, PROMPTS.md, GETTING_STARTED.md, QUICK_REFERENCE.md)
- ✅ **Item Information Lookup (v1.0)**
  - Implemented gathering locations, vendor prices, and aetherial reduction sources
  - Integrated XIVAPI v2 and Garland Tools API
  - Added batch processing with spreadsheet integration
- ✅ **Crafting Materials & Request Processing (v1.0)**
  - Implemented recursive crafting materials lookup with cycle detection
  - Created batch processing for crafting requests from spreadsheet
  - Added dynamic row insertion and quantity calculation
- ✅ **Documentation & Organization**
  - Created SHEETS_FORMULAS.md for Google Sheets formula reference
  - Created FEATURE.md for feature tracking and documentation
  - Created API_DOCUMENTATION.md and NON_WORKING_APIS.md for API reference
  - Updated .cursorrules with date/time handling and documentation maintenance guidelines
  - Finalized menu structure (production features in main menu, debug tools in Debug submenu)
  - Created LIBRARY_TEMPLATE.gs for easy library integration

---

## Notes

Add any notes, blockers, or important information here:

- 

---

## How to Use This File

1. **Add new tasks** under the appropriate section
2. **Update status** using the status legend (⬜ 🟡 ✅ ❌)
3. **Move completed tasks** to the "Completed Tasks" section periodically
4. **Add notes** about blockers or important context
5. **Review regularly** to prioritize and plan work

---

## Quick Add Template

When adding a new task, use this format:

```markdown
- ⬜ [Task Name] - Brief description
  - Subtask 1
  - Subtask 2
  - Notes or context
```

