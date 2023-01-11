import {test} from '../../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  test('Citizen can filter inbox tasks by payment type @notifications @OGT-34505 @broken_test @smoke', async ({
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

    await test.step('Apply task sorting by [Approvals]', async () => {
      await inboxPage.filterTasksByType('Payment');
    });

    await test.step('Verify that all listed tasks are approvals', async () => {
      await inboxPage.validateTasksContainGivenText('Payment');
    });
  });
});
