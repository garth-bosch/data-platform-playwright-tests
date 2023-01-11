import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {getCommentsLink} from '@opengov/cit-base/build/api-support/mandrillHelper';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Notifications', () => {
  test('Citizen receives notifications about comments on inspection step @notifications @OGT-39589 @ESN-4792', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    createRecordPage,
    recordPage,
  }) => {
    await test.step('Set timeout for 180s', async () => {
      // increase timeout for mandrill API to return emails
      test.setTimeout(180 * 1000);
    });

    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Goto create record page', async () => {
      await navigationBarPage.clickCreateRecordButton();
    });

    await test.step('Create record [01_Renewal_campaign_tests] from department [Test Department]', async () => {
      await createRecordPage.selectDepartment('Test Department');
      await createRecordPage.selectRecordByName('01_Renewal_campaign_tests');
    });

    await test.step('Toggle checkbox form field [Inspection] and create record', async () => {
      await createRecordPage.toggleFormGroupCheckbox('Inspection');
      await createRecordPage.clickOnSaveRecordButton();
    });

    await test.step('Select [Inspection] step', async () => {
      await recordPage.assignApplicantToUserByEmail('api_test@opengov.com');
      await recordPage.clickCustomStepByName('Inspection');
    });

    await test.step('Add comment on [Inspection] step', async () => {
      await recordPage.addCommentOnRecordStep('Hello World!');
    });

    await test.step('Confirm that email is sent to assignee', async () => {
      const recNo = await recordPage.getCurrentRecordNumber();
      await getCommentsLink('api_test@opengov.com', recNo);
    });
  });
});
