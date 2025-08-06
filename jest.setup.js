// Jest setup file for react-native-health-link
/* eslint-env jest */

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock timers
jest.useFakeTimers();

// Global test setup
beforeEach(() => {
  jest.clearAllMocks();
});
