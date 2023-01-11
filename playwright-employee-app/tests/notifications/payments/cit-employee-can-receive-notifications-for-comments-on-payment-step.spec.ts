import {test} from '../../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {getCommentsLink} from '@opengov/cit-base/build/api-support/mandrillHelper';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  test.setTimeout(180 * 1000);
  test('Employee can receive emails about comments on payments step @OGT-46899 @notifications', async ({
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

    await test.step('Start record [01_Renewal_campaign_tests] from department [Test Department]', async () => {
      await createRecordPage.selectDepartment('Test Department');
      await createRecordPage.selectRecordByName('01_Renewal_campaign_tests');
    });

    await test.step('Toggle checkbox form field [Payment] and create record', async () => {
      await createRecordPage.toggleFormGroupCheckbox('Payment');
      await createRecordPage.clickOnSaveRecordButton();
    });

    await test.step('Select [Payment] step', async () => {
      await recordPage.assignApplicantToUserByEmail('api_test@opengov.com');
      await recordPage.clickCustomStepByName('Payment');
    });

    await test.step('Add comment on [Payment] step', async () => {
      await recordPage.addCommentOnRecordStep('65463465346346');
    });

    await test.step('Confirm that email is sent to assignee', async () => {
      const recNo = await recordPage.getCurrentRecordNumber();
      await getCommentsLink('api_test@opengov.com', recNo);
    });
  });
});
