import {test} from '../../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {searchMessages} from '@opengov/cit-base/build/api-support/mandrillHelper';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  test('Citizen receives notifications for comments added in approval record step @notifications @OGT-34445 @broken_test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    createRecordPage,
    recordPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Goto create record page', async () => {
      await navigationBarPage.clickCreateRecordButton();
    });

    await test.step('Create record [1_UI_APPROVAL_TEST] from department [1. Inspectional Services]', async () => {
      await createRecordPage.selectDepartment('1. Inspectional Services');
      await createRecordPage.selectRecordByName('1_UI_APPROVAL_TEST');
      await createRecordPage.searchAndSelectApplicant(
        'API Test',
        'api_test@opengov.com',
      );
      await createRecordPage.clickOnSaveRecordButton();
    });

    await test.step('Select record step [Custom Approval]', async () => {
      await recordPage.clickCustomStepByName('Custom Approval');
    });

    await test.step('Assign [Custom Approval] on me', async () => {
      await recordPage.assignCustomApprovalOnMe();
    });

    await test.step('Add comment to approval step', async () => {
      await recordPage.addCommentOnRecordStep('hello world!');
    });

    await test.step('Confirm that email is sent to assignee', async () => {
      await searchMessages('api_test@opedngov.com', 'commented on');
    });
  });
});
