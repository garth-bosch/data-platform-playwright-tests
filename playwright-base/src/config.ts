import type {PlaywrightTestConfig} from '@playwright/test';
import {devices} from '@playwright/test';
import 'dotenv/config';
/**
 * See https://playwright.dev/docs/test-configuration.
 */

// JUnit reporter config for Xray
const xrayOptions = {
  // Whether to add <properties> with all annotations; default is false
  embedAnnotationsAsProperties: true,
  // Where to put the report.
  outputFile: 'test-results/junit/junit-result.xml',
};

const config: PlaywrightTestConfig = {
  testDir: './tests',
  fullyParallel: true, // Running test in a single spec in parallel
  /* Maximum time one test can run for. */
  timeout: process.env?.GLOBAL_TIMEOUT
    ? Number(process.env.GLOBAL_TIMEOUT)
    : 90 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 30000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI && process.env.retry_test ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 3 : 6,
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['line'],
    ['github'],
    ['junit', xrayOptions],
    ['html', {outputFolder: 'test-results/html'}],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 30000,
    screenshot: 'only-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        headless: process.env.HEADLESS !== 'false',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
};

if (process.env?.TEST_MATCH) {
  config.testMatch = String(process.env.TEST_MATCH).split(',');
}

export default config;
