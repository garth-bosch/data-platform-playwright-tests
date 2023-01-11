import {test} from '../../src/base/base-test';
import {expect} from '@playwright/test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Resend activation option', () => {
  test('Resend option button is present in the list of users @OGT-44186 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    systemSettingsPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to Manage users page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await systemSettingsPage.proceedToSection('Users');
    });
    const userEmail =
      await test.step('I create new user and confirm', async () => {
        return await systemSettingsPage.createUser();
      });
    await test.step('I verify if resend activation option is present', async () => {
      const resendButton =
        systemSettingsPage.getResendActivationButton(userEmail);
      await expect(resendButton).toBeVisible();
    });
  });
});
