import '@testing-library/jest-dom';

// Mock localStorage with actual storage behavior
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

global.localStorage = localStorageMock;

// Reset storage before each test
beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});
