import {test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {RecordStep} from '../../src/pages/ea-record-page';

test.describe('Employee App - Employee can see Activity log and it contains the same entries as in the record step @records', () => {
  test.use({storageState: EMPLOYEE_SESSION});

  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citAdminEmail,
      );
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test('Employee can see Activity log and it contains the same entries as in the record step @OGT-34507 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    recordPage,
  }) => {
    await test.step(' Go to the record and add a step', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Inspection],
        'Adhoc-Inspection',
      );
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
    });

    await test.step('Verify the activity feed message', async () => {
      const key1 = `added inspection step Adhoc-Inspection`;
      const message =
        TestUsers.Api_Admin.name +
        ` added inspection step Adhoc-Inspection to Record ${baseConfig.citTempData.recordName}`;
      await internalRecordPage.validateActivityFeed(key1, message);
    });

    await test.step(' Assign a user and update the step', async () => {
      await internalRecordPage.clickRecordStepName('Adhoc-Inspection');
      await internalRecordPage.addAssigneeForWorkflowSteps(
        'Adhoc-Inspection',
        TestUsers.Test_User.email,
      );
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
    });

    await test.step('Verify the activity feed message', async () => {
      const key1 = `assigned inspection step Adhoc-Inspection`;
      const message =
        TestUsers.Api_Admin.name +
        ` assigned inspection step Adhoc-Inspection to ${TestUsers.Test_User.name} on Record ${baseConfig.citTempData.recordName}`;
      await internalRecordPage.validateActivityFeed(key1, message);
    });
  });
});
