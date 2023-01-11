import {test} from '../../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  //* TODO: This is a dpulicate of  @OGT-34503, but the test does not reflect the content of the work item @duplicate
  test('Citizen can filter inbox tasks by approval type @broken_test', async ({
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
      await inboxPage.filterTasksByType('Approval');
    });

    await test.step('Verify that all listed tasks are approvals', async () => {
      await inboxPage.validateTasksContainGivenText('Approval');
    });
  });
});
