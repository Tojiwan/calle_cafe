import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 3000",
    url: "http://localhost:3000/menu",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
