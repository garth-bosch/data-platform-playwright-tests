import {test} from '../../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  test('Employee can filter inbox tasks by Approval type and receive notifications @OGT-34503 @notifications', async ({
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

    await test.step('Toggle checkbox form field [Approval] and create record', async () => {
      await createRecordPage.toggleFormGroupCheckbox('Approval');
      await createRecordPage.clickOnSaveRecordButton();
    });

    await test.step('Select [Approval] step and assign on current user', async () => {
      const counterBefore = await navigationBarPage.getInboxCounterNumber();
      await recordPage.clickCustomStepByName('Approval');
      await recordPage.assignCustomApprovalOnMe();
      await expect
        .poll(
          async () => {
            const counterAfter =
              await navigationBarPage.getInboxCounterNumber();
            return counterBefore !== counterAfter;
          },
          {
            message: `Expected message count to no longer be ${counterBefore}`,
          },
        )
        .toBeTruthy();
    });
  });
});
