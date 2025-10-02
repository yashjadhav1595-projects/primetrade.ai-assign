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

// Mock global URL if not available (for Node.js compatibility)
if (typeof global.URL === 'undefined') {
  global.URL = class URL {
    constructor(url) {
      this.href = url;
    }
  };
}

// Mock global URLSearchParams if not available
if (typeof global.URLSearchParams === 'undefined') {
  global.URLSearchParams = class URLSearchParams {
    constructor() {
      this.params = new Map();
    }
    get(name) {
      return this.params.get(name);
    }
    set(name, value) {
      this.params.set(name, value);
    }
  };
}

// Reset storage before each test
beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});
