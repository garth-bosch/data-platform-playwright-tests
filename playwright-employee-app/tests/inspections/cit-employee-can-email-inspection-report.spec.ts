import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestSteps,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {searchMessage} from '@opengov/cit-base/build/api-support/mandrillHelper';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Inspection @records @record-steps @inspections', () => {
  let inspectionId: string;

  test.beforeEach(async ({recordsApi, recordPage}) => {
    await test.step('Create a record', async () => {
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
    await test.step('Schedule an inspection', async () => {
      inspectionId = await recordsApi.scheduleInspection(
        TestSteps.Inspection,
        baseConfig.citTestData.citAdminEmail,
        0,
      );
    });
    await test.step('Open the record', async () => {
      await recordPage.proceedToRecordByUrl();
    });
  });

  test('Validate emailing inspection report is working @known_defect @OGT-34234 @broken_test @Xoriant_test', async ({
    recordPage,
    recordStepInspectionPage,
  }) => {
    await test.step('Navigate to the inspection step', async () => {
      await recordPage.clickRecordStepName(TestSteps.Inspection);
    });

    await test.step('Pass the inspection', async () => {
      await recordStepInspectionPage.passInspection(true, true);
    });

    await test.step('Open the inspection history', async () => {
      await recordStepInspectionPage.openLastInspectionHistory();
    });

    await test.step('Email the report', async () => {
      await recordStepInspectionPage.emailInspectionReport(
        // baseConfig.citTestData.citCitizenEmail,
        'api_test@opengov.com',
      );
    });

    await test.step('Verify user received an email with the report', async () => {
      await searchMessage(
        // baseConfig.citTestData.citCitizenEmail,
        'api_test@opengov.com',
        `Inspection Report for inspection #${inspectionId}`,
      );
    });
  });
});
