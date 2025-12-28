# TODO / Project Roadmap

This file tracks tasks, features, and improvements for the FFXIV Google Apps Script project.

## Status Legend
- ⬜ Not Started
- 🟡 In Progress
- ✅ Completed
- ❌ Cancelled/Deferred

---

## Current Sprint / Active Tasks

Currently, there are no active tasks in the current sprint.

---

## Planned Features

### Core Functionality
- ⬜ Item Information Lookup (Full) - Full version with market board prices from Universalis API
  - Integrate Universalis API for market board prices
  - Add price comparison (vendor vs market board)
  - Add best source recommendation

---

## Technical Debt / Improvements

### Code Quality
- ⬜ Add more utility functions as needed
- ⬜ Optimize existing functions for performance
- ⬜ Add comprehensive error handling

### Documentation
- ⬜ Keep documentation up to date (ongoing)
- ⬜ Add more examples to API.md if needed

### Testing
- ⬜ Test with large datasets
- ⬜ Test error scenarios
- ⬜ Add more test functions to Test.gs as needed

---

## Future Ideas / Backlog

- Market board price integration (Universalis API)
- Historical price trends
- Cross-world price comparison
- Crafting route optimization
- Teamcraft export format support

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

