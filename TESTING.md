# Testing Guide

This project uses **Vitest** for testing.

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (automatically re-runs when files change)
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite covers:

### Color Coding Logic

- `getBloodPressureColor()` - All AHA blood pressure categories

  - Normal (<120 and <80)
  - Elevated (120-129 and <80)
  - Stage 1 (130-139 or 80-89)
  - Stage 2 (≥140 or 90-119)
  - Crisis (≥180 or ≥120)

- `getPulseColor()` - All pulse ranges

  - Very low (<57)
  - Low (57-61)
  - Below normal (62-67)
  - Good (68-71)
  - Normal (72-75)
  - Elevated (76-81)
  - High (≥82)

- `getTimePeriod()` - Time period categorization
  - Midnight - 10 AM
  - 10 AM - 2 PM
  - 2 PM - Midnight

### Data Management

- `addReading()` - Adding new readings with validation
- `deleteReading()` - Deleting individual readings
- `sortByDate()` - Sorting by date and time

## Test Structure

Tests are organized in `app.test.js` with descriptive nested describe blocks:

- `BPTracker - Color Coding Logic`
- `BPTracker - Data Management`

Each test is independent and uses `beforeEach` to set up a fresh DOM and tracker instance.

## Adding New Tests

When adding new features:

1. Add corresponding test cases in `app.test.js`
2. Run tests to ensure they pass
3. Check coverage to identify untested code paths

## Continuous Integration

To integrate with CI/CD:

1. Tests run automatically on file changes in watch mode during development
2. Can be integrated into pre-commit hooks
3. Can be run in CI pipelines (GitHub Actions, GitLab CI, etc.)
