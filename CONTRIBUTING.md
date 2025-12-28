# Contributing Guidelines

## Code Style

### JavaScript/Google Apps Script

- Use ES6+ features when supported
- Prefer `const` and `let` over `var`
- Use arrow functions for callbacks
- Use async/await for asynchronous operations
- Follow camelCase for variables and functions
- Use PascalCase only for constructors (if any)

### Function Documentation

All functions must include JSDoc comments:

```javascript
/**
 * Brief description of what the function does
 * 
 * Longer description if needed, explaining the purpose,
 * behavior, and any important details.
 * 
 * @param {Type} paramName - Description of parameter
 * @param {Type} [optionalParam] - Optional parameter description
 * @return {Type} Description of return value
 * @throws {ErrorType} When this error occurs
 * 
 * @example
 * const result = exampleFunction('input');
 * // Returns: 'output'
 */
function exampleFunction(paramName, optionalParam) {
  // Implementation
}
```

### Code Organization

- One file per logical module/feature
- Group related functions together
- Keep functions focused and single-purpose
- Maximum function length: ~50 lines (exceptions allowed for complex logic)

### Error Handling

Always wrap main functions in try-catch:

```javascript
function mainFunction() {
  try {
    // Main logic
  } catch (error) {
    Logger.log('Error in mainFunction: ' + error.toString());
    SpreadsheetApp.getUi().alert('An error occurred: ' + error.message);
    throw error; // Re-throw if needed
  }
}
```

### Performance

- Cache spreadsheet and sheet objects
- Use batch operations (`getValues`/`setValues`)
- Minimize calls to SpreadsheetApp methods
- Process data in memory when possible

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add data processing functionality
fix: Resolve issue with sheet creation
docs: Update API documentation
refactor: Simplify utility functions
test: Add tests for data validation
```

Format: `type: description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Pull Request Process

1. Create a feature branch from main
2. Make your changes following the code style
3. Test your changes thoroughly
4. Update documentation if needed
5. Push your branch and create a pull request
6. Ensure all checks pass
7. Address review comments

## Testing

- Test all new functions manually
- Test edge cases and error conditions
- Verify with different data sizes
- Check execution time for large datasets
- Add test functions to `Test.gs` (kept in production for debugging)

## Documentation

- Update relevant `.md` files when adding features
- Add function documentation to `API.md`
- Update `ARCHITECTURE.md` for structural changes
- Keep `README.md` up to date

## Questions?

If you have questions about contributing:
1. Check existing documentation
2. Review similar code in the project
3. Ask for clarification in issues or discussions

