import {expect, test} from '../../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  test('Citizen receives notifications that inspection requested @OGT-46898 @notifications', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    createRecordPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    const counterBefore = await navigationBarPage.getInboxCounterNumber();

    await test.step('Goto create record page', async () => {
      await navigationBarPage.clickCreateRecordButton();
    });

    await test.step('Create record [01_Renewal_campaign_tests] from department [Test Department]', async () => {
      await createRecordPage.selectDepartment('Test Department');
      await createRecordPage.selectRecordByName('01_Renewal_campaign_tests');
      await createRecordPage.searchAndSelectApplicant(
        'API Employee',
        'api_employee@opengov.com',
      );
    });

    await test.step('Toggle checkbox form field [Payment] and create record', async () => {
      await createRecordPage.toggleFormGroupCheckbox('Payment');
      await createRecordPage.clickOnSaveRecordButton();
    });

    await test.step('Check inbox counter after record with payment was created', async () => {
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
