# Vitest Anti-Hanging Configuration Guide

## Problem
Vitest can sometimes hang in certain environments, especially in CI/CD or automated environments.

## Solutions Implemented

### 1. Vitest Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,        // Disabled to prevent hanging
    watch: false,          // Disabled watch mode
    run: true,             // Force run mode
    testTimeout: 5000,     // 5 second timeout per test
    hookTimeout: 5000,     // 5 second timeout for hooks
    teardownTimeout: 5000, // 5 second timeout for teardown
    coverage: {
      provider: 'v8',
      reporter: ['text'],  // Simplified to text only
      // ... other coverage options
    },
  },
})
```

### 2. Package.json Scripts

```json
{
  "scripts": {
    "test": "TZ=utc vitest run",
    "test:coverage": "TZ=utc vitest run --coverage",
    "test:run": "TZ=utc vitest run",
    "test:watch": "TZ=utc vitest --watch"
  }
}
```

### 3. Direct Command Alternative

If npm scripts still hang, you can run vitest directly:

```bash
# Direct vitest command
npx vitest run

# With timezone
TZ=utc npx vitest run

# With coverage
TZ=utc npx vitest run --coverage
```

### 4. Emergency Fallback - Jest

If Vitest continues to hang, you can install Jest as a fallback:

```bash
npm install --save-dev jest @types/jest ts-jest
```

Add to package.json:
```json
{
  "scripts": {
    "test:jest": "TZ=utc jest --testEnvironment=node --runInBand --forceExit"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "forceExit": true,
    "detectOpenHandles": true
  }
}
```

## Anti-Hanging Measures Summary

1. **Disabled Globals**: Prevents global state issues
2. **Explicit Run Mode**: Forces non-watch mode
3. **Multiple Timeouts**: Prevents infinite waits
4. **Simplified Coverage**: Reduces complexity
5. **Process Control**: Explicit teardown timeouts
6. **Timezone Setting**: Consistent TZ=utc
7. **Direct Commands**: Bypass npm script issues

## Testing the Setup

```bash
# Test with timeout (should complete in ~5 seconds)
timeout 15 npm test

# Test coverage (should complete in ~5 seconds)
timeout 15 npm run test:coverage

# Test direct command
timeout 15 npx vitest run
```

## Expected Behavior

- Tests should complete in under 5 seconds
- Coverage should complete in under 5 seconds
- No hanging or infinite waits
- Clean exit with proper status codes

## If Still Hanging

1. Check if any tests have infinite loops
2. Verify no async operations without proper cleanup
3. Consider using Jest as fallback
4. Check system resources (low memory can cause hanging)
5. Try running in a different terminal/environment

## Environment Variables

Set these if still experiencing issues:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
export VITEST_SEGFAULT_RETRY=0
export CI=true
```

This configuration should prevent hanging in 99% of cases while maintaining full test functionality and coverage.