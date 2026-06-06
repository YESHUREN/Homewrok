import React from "react";
import ReactDOMServer from "react-dom/server";

// Mock minimal browser globals needed by the App component
const mockLocalStorage = {
  getItem: (key: string) => {
    if (key === "app_language") return "zh";
    if (key === "entry_date") return null; // Mock that date is not set!
    return null;
  },
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
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

// Import App component
import App from "../src/App";

console.log("Attempting to render App component with entry_date set...");
try {
  const html = ReactDOMServer.renderToString(<App />);
  console.log("Success! Rendered HTML length:", html.length);
} catch (error) {
  console.error("CRITICAL RUNTIME ERROR with entry_date set:");
  console.error(error);
  process.exit(1);
}
