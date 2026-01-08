import '@testing-library/jest-dom';
import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { clearQuestlogCache } from './src/utils/questlogDescriptionParser';
import { clearStatCache } from './src/utils/statsUtils';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Clear caches before tests run
beforeEach(() => {
  // Clear description cache
  clearQuestlogCache();

  // Clear stat cache
  clearStatCache();
});
