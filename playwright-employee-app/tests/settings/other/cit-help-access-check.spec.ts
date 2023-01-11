import {test} from '../../../src/base/base-test';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.describe('Help settings', () => {
  async function verifySupport(page) {
    const allwindows = page.context().pages();
    const currentWindow = allwindows[1];
    await currentWindow.bringToFront();
    await currentWindow
      .frameLocator('#launcher')
      .locator(`button[aria-label="Support"]`)
      .waitFor({state: 'visible'});
    await currentWindow
      .frameLocator('#launcher')
      .locator(`button[aria-label="Support"]`)
      .click();
    await currentWindow
      .frameLocator('#webWidget')
      .locator(
        `//*[@data-testid="chat-msg-answer-bot"]//span[contains(.,"Hi! Welcome to OpenGov.")]`,
      )
      .waitFor({state: 'visible'});
  }

  test('User can get access Opengov help - Admin @OGT-33568 @Xoriant_Test @Xoriant_Temp_01_Mahesh @smoke', async ({
    authPage,
    page,
    employeeAppUrl,
    navigationBarPage,
  }) => {
    await test.step('Initialize and mark notifications read', async () => {
      await page.goto(employeeAppUrl);
      await authPage.page.waitForNavigation();
      await authPage.loginAs(
        baseConfig.citTestData.citAdminEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await authPage.page.waitForNavigation();
    });
    await test.step('Navigate to settings page - to avoid immediate flakiness', async () => {
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Navigate to Help', async () => {
      await Promise.all([
        page.context().waitForEvent('page'),
        await navigationBarPage.navigateToOpenGovHelp(),
      ]);
    });
    await test.step('Verify support chat enabled', async () => {
      await verifySupport(page);
    });
  });
  test('Admin cannot access viewpoint chat support @OGT-33569 @Xoriant_Test @Xoriant_Remove_01', async ({
    authPage,
    page,
    employeeAppUrl,
    navigationBarPage,
  }) => {
    await test.step('Initialize and mark notifications read', async () => {
      await page.goto(employeeAppUrl);
      await authPage.page.waitForNavigation();
      await authPage.loginAs(
        baseConfig.citTestData.citEmployeeEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await authPage.page.waitForNavigation();
    });
    await test.step('Navigate to Help', async () => {
      await Promise.all([
        page.context().waitForEvent('page'),
        await navigationBarPage.navigateToOpenGovHelp(),
      ]);
    });
    await test.step('Verify support chat enabled', async () => {
      await verifySupport(page);
    });
  });
});
