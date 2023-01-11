import {test} from '../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  test('Employee can Re-assign Assignee and Due Date from Inbox @notifications @OGT-34506 @broken_test @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    inboxPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Change Due Date and Re-assign Assignee', async () => {
      await inboxPage.filterTasksByType('Approval');
      await inboxPage.changeDueDateByDay();
      await inboxPage.verifyDueDateOfGivenRecordStepFromInbox('Approval', 0);
      await inboxPage.reassignTaskToUser('api admin');
    });
  });
});
