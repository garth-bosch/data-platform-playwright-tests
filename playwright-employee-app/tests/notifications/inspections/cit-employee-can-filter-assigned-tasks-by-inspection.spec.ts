import {expect, test} from '../../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  test('Citizen receives notifications for comments added in record steps @notifications @OGT-34504 @smoke', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    inboxPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Land to inbox page', async () => {
      await navigationBarPage.clickExploreInboxButton();
    });

    await test.step('Apply task sorting by [Inspection]', async () => {
      await inboxPage.filterTasksByType('Inspection');
    });

    await test.step('Verify that all listed tasks are inspection or notifications for inspection', async () => {
      const values = await inboxPage.getInboxItems();
      values.forEach((value) => {
        expect(
          value.toLowerCase().includes('inspection') ||
            value.toLowerCase().includes('notification'),
        ).toBeTruthy();
      });
    });
  });
});
