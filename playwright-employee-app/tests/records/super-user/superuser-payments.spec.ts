import {test} from '../../../src/base/base-test';
import {SUPER_USER_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

test.use({storageState: SUPER_USER_SESSION});
test.describe('Super user - non Super user settings check App - ', () => {
  test('superUser tools present and functional on Payment settings page @OGT-44420', async ({
    navigationBarPage,
    page,
    employeeAppUrl,
    paymentsSettingsPage,
    systemSettingsPage,
  }) => {
    await test.step('Navigate to settings page and verify both buttons present', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
      await systemSettingsPage.proceedToSection('Payments');
      await expect(
        page.locator(paymentsSettingsPage.elements.paymentModeLabel),
      ).toBeVisible();
      await expect(
        page.locator(paymentsSettingsPage.elements.clearStripeSettings),
      ).toBeVisible();
    });
  });
});
