import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Activity Logs', () => {
  //* TODO: This is a duplicate of  @OGT-34165 @duplicate
  test('Admin can see audit logs from the system setting page (Activity Log) @CIT-3239', async ({
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

    await test.step('Verify that I can see activity logs', async () => {
      await activityLogSettingsPage.verifyActivityLogPageVisible();
    });
  });
});
