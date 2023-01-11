import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestSteps,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Inspection canceling', () => {
  test(
    'Applicant receives notification when scheduled inspection is canceled ' +
      '@Partial_Automation @known_defect @OGT-44262 @Xoriant_Test',
    async ({
      page,
      employeeAppUrl,
      recordsApi,
      internalRecordPage,
      recordPage,
    }) => {
      await test.step('Create a Record with Inspection step and applicant', async () => {
        await recordsApi.createRecordWith(
          TestRecordTypes.Record_Steps_Test,
          baseConfig.citTestData.citCitizenEmail,
          null,
          [
            {
              fieldName: TestSteps.Inspection,
              fieldValue: 'true',
            },
          ],
        );
      });
      await test.step('Schedule created Inspection', async () => {
        await recordsApi.scheduleInspection(
          'Inspection',
          TestUsers.Api_Admin.email,
          1,
        );
      });
      await test.step('Navigate to the Employee App', async () => {
        await page.goto(employeeAppUrl);
      });
      await test.step('Navigate to craeted Record and follow to Inspection step', async () => {
        await internalRecordPage.proceedToRecordById(
          baseConfig.citTempData.recordId,
        );
        await recordPage.clickRecordStepName(TestSteps.Inspection);
      });
      await test.step('Cancel inspection and verify if applicant recieved email notification', async () => {
        await internalRecordPage.clickOnCancelRecordStepButton();
        await internalRecordPage.clickOnDialogButtonByName('Cancel Inspection');
        //TODO - complete this step after canceling email notification will be implemented
      });
    },
  );
});
