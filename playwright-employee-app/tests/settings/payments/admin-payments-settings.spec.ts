import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Payments', () => {
  test('Currency dropdown US Dollars vs. Australian is present and functional @OGT-44126 @Xoriant_Test @smoke', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    paymentsSettingsPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Go to payments Settings page and select Australian $', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await paymentsSettingsPage.proceedToPaymentsSettingsPage();
      await paymentsSettingsPage.selectCurrencyDropdown('Australian Dollars');
    });
    await test.step('Re Navigate back and check settings are Australian $', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
      await paymentsSettingsPage.proceedToPaymentsSettingsPage();
      await paymentsSettingsPage.selectCurrencyDropdown('Australian Dollars');
    });

    await test.step('Goto payments Settings page and select USD', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
      await paymentsSettingsPage.proceedToPaymentsSettingsPage();
      await paymentsSettingsPage.selectCurrencyDropdown('US Dollars');
    });
    await test.step('Re Navigate back and check settings are USD', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
      await paymentsSettingsPage.proceedToPaymentsSettingsPage();
      await paymentsSettingsPage.selectCurrencyDropdown('US Dollars');
    });
  });

  test('Verify that client account can connect to Stripe @OGT-33552', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    paymentsSettingsPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Go to payments Settings page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await paymentsSettingsPage.proceedToPaymentsSettingsPage();
    });
    await test.step('Verify stripe settings button active', async () => {
      await page
        .locator(paymentsSettingsPage.elements.connectedToStripe)
        .waitFor({state: 'visible'});
      await page
        .locator(paymentsSettingsPage.elements.connectNewAccountStripe)
        .waitFor({state: 'visible'});
      await page
        .locator(paymentsSettingsPage.elements.editSettingsStripe)
        .waitFor({state: 'visible'});
    });
  });
});
