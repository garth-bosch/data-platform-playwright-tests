import {expect, test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Activity Logs', () => {
  test('Admin can see audit logs from the system setting page (Activity Log) @OGT-34165 @broken_test @CIT-3239', async ({
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

    await test.step('Verify that I filter logs by Employee', async () => {
      await activityLogSettingsPage.verifyActivityLogPageVisible();
      await activityLogSettingsPage.selectFilteringByEmployee('454 45');
      await expect(
        activityLogSettingsPage.page.locator(
          activityLogSettingsPage.elements.emptyResults,
        ),
      ).toBeVisible();
      await activityLogSettingsPage.selectFilteringByEmployee('api admin');
      await expect(
        activityLogSettingsPage.page
          .locator(activityLogSettingsPage.elements.reportActivityTable)
          .first(),
      ).toBeVisible();
    });

    await test.step('Reset filters', async () => {
      // filters reset just by refreshing the page
      await page.reload();
    });

    await test.step('Verify that I can filter logs by Date', async () => {
      await activityLogSettingsPage.verifyActivityLogPageVisible();
      await activityLogSettingsPage.selectFilteringByEmployee('api admin');
      await activityLogSettingsPage.selectDateFilter('Last 7 Days');
      await expect(
        activityLogSettingsPage.page
          .locator(activityLogSettingsPage.elements.reportActivityTable)
          .first(),
      ).toBeVisible();
    });

    await test.step('Reset filters', async () => {
      // filters reset just by refreshing the page
      await page.reload();
      await activityLogSettingsPage.verifyActivityLogPageVisible();
    });

    await test.step('Verify that I can search logs by ID', async () => {
      await activityLogSettingsPage.searchForRecord('30035');
      await expect(
        activityLogSettingsPage.page.locator(
          activityLogSettingsPage.elements.emptyResults,
        ),
      ).toBeVisible();
    });
  });
});
