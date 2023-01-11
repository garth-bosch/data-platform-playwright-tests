import {test} from '../../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {searchMessages} from '@opengov/cit-base/build/api-support/mandrillHelper';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  test('Citizen receives notifications for comments added in document record step @notifications @OGT-46105', async ({
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

    await test.step('Create record [0_UI_Renew_TEST] from department [1. Inspectional Services]', async () => {
      await createRecordPage.selectDepartment('1. Inspectional Services');
      await createRecordPage.selectRecordByName('0_UI_Renew_TEST');
      await createRecordPage.searchAndSelectApplicant(
        'API Test',
        'api_test@opengov.com',
      );
      await createRecordPage.clickOnSaveRecordButton();
    });

    await test.step('Select [Custom Document] step', async () => {
      await recordPage.clickCustomStepByName('Custom Document');
    });

    await test.step('Add comment on Document step', async () => {
      await recordPage.addCommentOnRecordStep('hello world!');
    });

    await test.step('Confirm that email is sent to assignee', async () => {
      await searchMessages('api_test@opengov.com', 'commented on');
    });
  });
});
