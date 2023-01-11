import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Reporting settings page', () => {
  /*  @OGT-44254 - is already tested .. 257 etc would not be possible without this test so not really usefull*/
  test('Admin can select/de-select (enable/disable) searchable record @OGT-34155 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    publicPortalSettingPage,
    navigationBarPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to Reporting Settings', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await publicPortalSettingPage.proceedToPortalSection('Public Search');
      await publicPortalSettingPage.awaitPublicSearchSection();
    });
    await test.step('Switch On and Verify', async () => {
      await publicPortalSettingPage.allowPublicSearch(
        'on',
        'Public Record Search',
      );
    });
    await test.step('Switch Off and Verify', async () => {
      await publicPortalSettingPage.allowPublicSearch(
        'off',
        'Public Record Search',
      );
    });
    await test.step('Switch On for default', async () => {
      await publicPortalSettingPage.allowPublicSearch(
        'on',
        'Public Record Search',
      );
    });
  });
});
