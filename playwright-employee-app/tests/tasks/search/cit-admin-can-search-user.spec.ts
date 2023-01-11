import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - navigation bar search - Record types, Clone', () => {
  test('Admin can search for a specific user by using the search bar @OGT-34107 @Xoriant_Test @smoke', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
  }) => {
    await test.step('Navigate to record type settings page', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Verify Navigation', async () => {
      await navigationBarPage.performGlobalSearchAndClick(
        baseConfig.citTestData.citAdminEmail,
        'api admin',
      );
      await page.waitForURL(/auth0/);
      await expect(await page.url()).toContain('explore/users/auth0');
    });
  });
});
