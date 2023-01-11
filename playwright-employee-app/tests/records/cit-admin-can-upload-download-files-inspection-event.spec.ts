import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Records details @records', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Setup a record and open it', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        null,
        TestLocation.Test_Point_Location,
        [
          {
            fieldName: 'Inspection',
            fieldValue: 'true',
          },
        ],
      );
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test('User can upload and download attachments of multiple file types in an inspection event @OGT-34060 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    recordStepInspectionPage,
  }) => {
    await test.step('Navigate to Inspection Step', async () => {
      await internalRecordPage.clickRecordStepName('Inspection');
    });
    await test.step('Upload and Download the Attachments on Inspection Event', async () => {
      await recordStepInspectionPage.createNewInspection();
      await recordStepInspectionPage.uploadAttachments('jpeg', 'overall');
      await recordStepInspectionPage.downloadAttachment('jpeg');
      await recordStepInspectionPage.uploadAttachments('pdf', 'overall');
      await recordStepInspectionPage.downloadAttachment('pdf');
      await recordStepInspectionPage.uploadAttachments('docx', 'overall');
      await recordStepInspectionPage.downloadAttachment('docx');
    });
  });
});
