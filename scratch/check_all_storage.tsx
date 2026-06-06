import React from "react";
import ReactDOMServer from "react-dom/server";

// Minimal browser mocks
let mockStorageData: Record<string, string | null> = {};

const mockLocalStorage = {
  getItem: (key: string) => mockStorageData[key] || null,
  setItem: (key: string, val: string) => { mockStorageData[key] = val; },
  removeItem: (key: string) => { delete mockStorageData[key]; },
  clear: () => { mockStorageData = {}; },
  length: 0,
  key: () => null,
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  localStorage: mockLocalStorage,
  navigator: {
    userAgent: "node",
    serviceWorker: {
      ready: Promise.resolve({ showNotification: () => {} }),
      register: () => Promise.resolve({ scope: "/" }),
    },
  },
} as any;

global.localStorage = mockLocalStorage as any;
Object.defineProperty(global, 'navigator', {
  value: global.window.navigator,
  configurable: true,
  writable: true,
});

global.document = {
  documentElement: {
    classList: {
      add: () => {},
      remove: () => {},
    },
  },
} as any;

import App from "../src/App";

const testCases = [
  { name: "Fresh State (everything null)", storage: {} },
  { name: "Language EN, no date", storage: { app_language: "en" } },
  { name: "Language KO, date set", storage: { app_language: "ko", entry_date: "2026-07-01" } },
  { name: "Invalid Date Set", storage: { entry_date: "invalid-date" } },
  { name: "Empty Date Set", storage: { entry_date: "" } },
  { name: "User logged in, cache exists", storage: { service_community_user_id: "user123", local_cached_profile: '{"id":"user123","name":"Test","nickname":"T","avatar":"","tag":"","university":"","major":""}' } },
  { name: "User logged in, cache is null string", storage: { service_community_user_id: "user123", local_cached_profile: 'null' } },
  { name: "User logged in, cache is undefined string", storage: { service_community_user_id: "user123", local_cached_profile: 'undefined' } },
  { name: "User logged in, cache is invalid JSON", storage: { service_community_user_id: "user123", local_cached_profile: '{invalid}' } },
  { name: "Notified reminders invalid JSON", storage: { notified_reminders: '{invalid}' } },
];

for (const tc of testCases) {
  console.log(`\n--- Running Test Case: ${tc.name} ---`);
  mockStorageData = tc.storage;
  try {
    const html = ReactDOMServer.renderToString(<App />);
    console.log(`  Success! Rendered HTML length: ${html.length}`);
  } catch (error) {
    console.error(`  FAILED: Render crashed for case "${tc.name}":`, error);
  }
}
