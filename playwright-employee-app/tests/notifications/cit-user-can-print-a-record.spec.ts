import {test} from '../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  test('Employee can Re-assign Assignee and Due Date from Inbox @notifications @OGT-34239 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    inboxPage,
    internalRecordPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Navigate to Inbox page', async () => {
      await inboxPage.openTask();
      await internalRecordPage.clickPrintRecordButton();
      await internalRecordPage.validatePrintRecordData();
    });
  });
});
