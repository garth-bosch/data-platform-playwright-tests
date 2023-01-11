import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Activity Logs', () => {
  test('Admin can explore export activity logs feature on system setting page (Activity Log) @OGT-34167 @PLCE-2293', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    recordTypesSettingsPage,
    activityLogSettingsPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Goto Settings page and select Activity Logs', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToActivitySettingsPage();
    });

    await test.step('Select Export Log on top navigation menu', async () => {
      await activityLogSettingsPage.navigateToExportLog();
    });

    await test.step('Verify that I can see activity logs', async () => {
      await activityLogSettingsPage.verifyExportLogPageVisible();
    });
  });
});
